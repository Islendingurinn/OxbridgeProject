import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
    newEvent: Joi.object().keys({
        name: Joi.string().required().min(3),
        eventStart: Joi.date().required(),
        eventEnd: Joi.date().required(),
        eventCode: Joi.string().required().min(3),
        city: Joi.string().required().min(3),
    }),
    updateEvent: Joi.object().keys({
        name: Joi.string().optional().min(3),
        eventStart: Joi.date().optional(),
        eventEnd: Joi.date().optional(),
        city: Joi.string().optional().min(3),
    }),
    eventId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
};