import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
    newUser: Joi.object().keys({
        firstname: Joi.string().required().min(3),
        lastname: Joi.string().required().min(3),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
    }),
    updateUser: Joi.object().keys({
        firstname: Joi.string().required().min(3),
        lastname: Joi.string().required().min(3),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
    }),
    userId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
    email: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
};