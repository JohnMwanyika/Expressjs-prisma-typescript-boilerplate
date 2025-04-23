import prisma from "../client";
import { PaymentMethod, PaymentMethodType } from "../generated/prisma-client-js";
import ApiError from "../utils/ApiError";
import httpStatus from 'http-status';


const createPaymentMethod = async (
    name: PaymentMethodType,
    description: string,
): Promise<PaymentMethod> => {
    if (await getPaymentMethodByName(name)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Profile exists already');
    }
    return prisma.paymentMethod.create({
        data: {
            name,
            description,
        }
    });
};

const getPaymentMethodByName = async (
    paymentMethod: string,
): Promise<PaymentMethod | null> => {
    return prisma.paymentMethod.findFirst({
        where: { name: PaymentMethodType[paymentMethod as keyof typeof PaymentMethodType] },
    });
}

export default {
    createPaymentMethod,
    getPaymentMethodByName
};