import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
    newEventRegistration: Joi.object().keys({
        shipId: JoiObjectId().required(),
        trackColor: Joi.string().optional().min(3),
        teamName: Joi.string().required().min(3),
    }),
    updateEventRegistration: Joi.object().keys({
        shipId: JoiObjectId().optional(),
        trackColor: Joi.string().optional().min(3),
        teamName: Joi.string().optional().min(3),
    }),
    eventRegistrationId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
    eventId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
    eventCode: Joi.object().keys({
        code: Joi.string().required().min(3),
    }),
};