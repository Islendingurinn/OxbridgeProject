import Joi from '@hapi/joi';
import { JoiAuthBearer } from '../../../helpers/validator';

export default {
    userCredential: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
    }),
    email: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
    refreshToken: Joi.object().keys({
        refreshToken: Joi.string().required().min(1),
    }),
    auth: Joi.object().keys({
        authorization: JoiAuthBearer().required(),
    }).unknown(true),
    signup: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
    }),
};