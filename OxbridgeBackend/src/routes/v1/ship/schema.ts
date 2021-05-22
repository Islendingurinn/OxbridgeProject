import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
    newShip: Joi.object().keys({
        userId: JoiObjectId().required(),
        name: Joi.string().required().min(3),
    }),
    updateShip: Joi.object().keys({
        userId: JoiObjectId().required(),
        name: Joi.string().required().min(3),
    }),
    shipId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
    eventId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
};