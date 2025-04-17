import { userService } from "../services";
import profileService from "../services/profile.service";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import httpStatus from 'http-status';


const getProfile = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    const profile = await profileService.getUserProfileByUserId(req.params.userId);
    res.send({
        status: "success",
        data: profile,
    })
});

export default {
    getProfile
};