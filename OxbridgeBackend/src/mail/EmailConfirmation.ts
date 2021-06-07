import { Types } from "mongoose";
import EventRepo from "../database/repository/EventRepo";
import UserRepo from "../database/repository/UserRepo";
import ShipRepo from '../database/repository/ShipRepo';
import { transporter } from './';

/**
  * The class handles sending out the confirmation emails
  * to users who register for different events.
  */

export default class EmailConfirmation{

    shipid: Types.ObjectId;
    eventid: Types.ObjectId;

    constructor(shipid: Types.ObjectId, eventid: Types.ObjectId){
        this.shipid = shipid;
        this.eventid = eventid;

        try{
            this.task();
        }catch(e){
            console.error(' error: ' + e);
        }
    }

    async task(): Promise<void> {
        const ship = await ShipRepo.findById(this.shipid);
        if(!ship) return;

        const user = await UserRepo.findByIdSecured(ship.userId);
        if(!user) return;

        const event = await EventRepo.findById(this.eventid);
        if(!event) return;

        await transporter.sendMail({
            from: '"Tregatta" <tregattasonderborg@gmail.com>',
            to: user.email,
            subject: "Du er nu registered for " + event.name + "!",
            text: "Din event " + event.name + " er i " + event.city + "! De skal starter " + event.eventStart + ".",
            html: "<strong>Din event " + event.name + " er i " + event.city + "! De skal starter " + event.eventStart + ".</strong>",
            headers: { 'x-myheader': 'Tregatta Event' }
          });
    }
}