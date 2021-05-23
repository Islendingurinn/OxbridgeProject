import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
    newRacepoint: Joi.object().keys({
        type: Joi.string().required(),
        firstLongtitude: Joi.number().required(),
        firstLatitude: Joi.number().required(),
        secondLongtitude: Joi.number().required(),
        secondLatitude: Joi.number().required(),
        eventId: JoiObjectId().required(),
    }),
    eventId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
};