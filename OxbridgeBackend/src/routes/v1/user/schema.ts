import Joi from '@hapi/joi';
import { JoiObjectId } from '../../../helpers/validator';

export default {
    newUser: Joi.object().keys({
        firstname: Joi.string().required().min(3),
        lastname: Joi.string().required().min(3),
        emailUsername: Joi.string().required().min(3),
        password: Joi.string().required().min(6),
    }),
    updateUser: Joi.object().keys({
        firstname: Joi.string().required().min(3),
        lastname: Joi.string().required().min(3),
        emailUsername: Joi.string().required().min(3),
        password: Joi.string().required().min(6),
    }),
    userId: Joi.object().keys({
        id: JoiObjectId().required(),
    }),
    emailUsername: Joi.object().keys({
        emailUsername: Joi.string().required().min(3),
    }),
};