import Joi from "joi";

const getUserProfile = {
    params: Joi.object().keys({
        userId: Joi.number().integer()
    })
};

export default {
    getUserProfile
};