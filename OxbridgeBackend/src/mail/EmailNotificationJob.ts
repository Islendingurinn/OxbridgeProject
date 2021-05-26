import { CronJob } from 'cron';
import EventRepo from '../database/repository/EventRepo';
import Event from '../database/model/Event';
import EventRegistrationRepo from '../database/repository/EventRegistrationRepo';
import UserRepo from '../database/repository/UserRepo';
import ShipRepo from '../database/repository/ShipRepo';
import { transporter } from './';

/**
  * The class handles the Cron job that runs every day,
  * checking for upcoming events and staying on top of sending
  * the participants notifications by email reminding them of the event.
  */

class EmailNotification {

    cronJob: CronJob;

    constructor(){
        // 0 8 * * * --> every day 8am
        // * * * * * --> every minute
        this.cronJob = new CronJob('0 8 * * *', async () => {
            try{
                await this.task();
            } catch (e){
                console.error('cron-job error: ' + e);
            }
        });

        //Start job
        if(!this.cronJob.running){
            this.cronJob.start();
        }
    }

    //The method that runs every day
    async task(): Promise<void> {
        //Find events that haven't started and haven't been notified
        const returnedEvents = await EventRepo.findHasBeenNotified();
        if(returnedEvents.length == 0) return;

        //You should be notified three days before the event, find the dates
        const max = new Date();
        const min = new Date();
        min.setDate(min.getDate() - 3);

        //Narrow down the list of events to only those in the upcoming three days
        let events : Event[] = [];
        for(const event of returnedEvents){
            if(isBetween(event.eventStart, min, max))
                events.push(event);
        }
        if(events.length == 0) return;

        for(const event of events){
            //Find the event registrations of the event
            const eventRegistrations = await EventRegistrationRepo.findByEvent(event._id);
            if(eventRegistrations.length == 0) continue;

            for(const registration of eventRegistrations){
                //Find the user assosciated with the registration
                const ship = await ShipRepo.findById(registration.shipId);
                if(!ship) continue;

                const user = await UserRepo.findByIdSecured(ship.userId);
                if(!user) continue;

                //Finally, send the user a reminder through email
                const info = await transporter.sendMail({
                    from: '"Tregatta" <tregattasonderborg@gmail.com>',
                    to: user.email,
                    subject: "Glem ikke din kommende begivenhed!",
                    text: "Din event " + event.name + " starter snart! De skal starter " + event.eventStart + ".",
                    html: "<strong>Din event " + event.name + " starter snart! De skal starter " + event.eventStart + ".</strong>",
                    headers: { 'x-myheader': 'Tregatta Event' }
                  });
            }

            event.notified = true;
            await EventRepo.update(event);
        }
    }
}

// Check if date is between max, min dates
const isBetween = (date: Date, min: Date, max: Date) => (date.getTime() >= min.getTime() && date.getTime() <= max.getTime());

const emailNotification = new EmailNotification();