import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
    newLocationRegistration: Joi.object().keys({
        eventRegId: JoiObjectId().required(),
        racePointId: JoiObjectId().required(),
        longtitude: Joi.number().required(),
        latitude: Joi.number().required(),
        raceScore: Joi.number().required(),
        finishTime: Joi.date().required(),
    }),
    updateLocationRegistration: Joi.object().keys({
        eventRegId: JoiObjectId().optional(),
        racePointId: JoiObjectId().optional(),
        locationTime: Joi.date().optional(),
        longtitude: Joi.number().optional(),
        latitude: Joi.number().optional(),
        raceScore: Joi.number().optional(),
        finishTime: Joi.date().optional(),
    }),
    locationRegistrationId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
    eventId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
    eventRegistrationId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
};