import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { userService } from '../services';

const createUser = catchAsync(async (req, res) => {
  const { email, password, name, role } = req.body;
  const user = await userService.createUser(email, password, name, role);
  res.status(httpStatus.CREATED).send({
    status: "success",
    data: user,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['firstName', 'lastName', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  // Convert string values to numbers
  if (options.limit) options.limit = parseInt(String(options.limit), 10);
  if (options.page) options.page = parseInt(String(options.page), 10);
  console.log({ filter, options })
  const { users, totalCount } = await userService.queryUsers(filter, options);
  // res.send(result);
  res.send({
    status: 'success',
    data: users,
    page: options.page || 1,
    limit: options.limit || 10,
    totalCount
  });
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  // res.send(user);
  res.send({
    status: "success",
    data: user,
  })
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  // res.send(user);
  res.send({
    status: "success",
    data: user,
  })
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send({
    status: "success",
    data: null
  });
});

export default {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
