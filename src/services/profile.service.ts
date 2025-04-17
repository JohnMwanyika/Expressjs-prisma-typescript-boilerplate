import prisma from "../client";
import { User, Profile } from "../generated/prisma-client-js";
import ApiError from "../utils/ApiError";
import httpStatus from 'http-status';


const createUserProfile = async (
    userId: number,
    bio: string,
    avatarUrl: string,
): Promise<Profile> => {
    if (await getUserProfileByUserId(userId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Profile exists already');
    }
    return prisma.profile.create({
        data: {
            userId,
            bio,
            avatarUrl,
        }
    });
};


/**
 * Get user by email
 * @param {number} userId
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserProfileByUserId = async <Key extends keyof Profile>(
    userId: number,
    keys: Key[] = [
        'id',
        'userId',
        'bio',
        'avatarUrl',
        'createdAt',
        'updatedAt'
    ] as Key[]
): Promise<Pick<Profile, Key> | null> => {
    return prisma.profile.findUnique({
        where: { userId },
        select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
    }) as Promise<Pick<Profile, Key> | null>;
};

export default {
    getUserProfileByUserId,
    createUserProfile
}