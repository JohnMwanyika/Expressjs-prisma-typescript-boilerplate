import Joi from 'joi';

const createPaymentMethod = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string(),
    })
};

export default {
    createPaymentMethod
};