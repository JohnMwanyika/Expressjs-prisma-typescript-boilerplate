import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { NextFunction, Request, Response } from 'express';
import pick from '../utils/pick';
import Joi from 'joi';

/**
 * Middleware to validate the request object against a given schema.
 *
 * @param schema - An object defining the validation schema for the request.
 *                 The schema can include `params`, `query`, and `body` keys.
 * 
 * @returns A middleware function that validates the request and either
 *          proceeds to the next middleware or throws an error if validation fails.
 *
 * @throws {ApiError} - If validation fails, an ApiError is thrown with a
 *                      `BAD_REQUEST` status and a detailed error message.
 *
 * @example
 * import Joi from 'joi';
 * import validate from './validate';
 *
 * const schema = {
 *   body: Joi.object({
 *     name: Joi.string().required(),
 *     age: Joi.number().integer().min(0),
 *   }),
 * };
 *
 * app.post('/example', validate(schema), (req, res) => {
 *   res.send('Validation passed!');
 * });
 */
const validate = (schema: object) => (req: Request, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const obj = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(obj);
  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

export default validate;
