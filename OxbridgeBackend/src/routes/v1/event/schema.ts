import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
    newEvent: Joi.object().keys({
        name: Joi.string().required().min(3),
        eventStart: Joi.date().required(),
        eventEnd: Joi.date().required(),
        city: Joi.string().required().min(3),
    }),
    updateEvent: Joi.object().keys({
        name: Joi.string().required().min(3),
        eventStart: Joi.date().required(),
        eventEnd: Joi.date().required(),
        city: Joi.string().required().min(3),
    }),
    eventId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
};