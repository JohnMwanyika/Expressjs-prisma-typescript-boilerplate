import { RequestHandler } from 'express';
import { Request, Response, NextFunction } from 'express-serve-static-core';

export interface CustomParamsDictionary {
  [key: string]: any;
}

/**
 * A higher-order function that wraps an asynchronous route handler to catch errors.
 * This utility ensures that any errors thrown in the asynchronous function are passed
 * to the `next` middleware, avoiding the need for repetitive try-catch blocks.
 *
 * @template P - The type of route parameters.
 * @template ResBody - The type of the response body.
 * @template ReqBody - The type of the request body.
 * @template ReqQuery - The type of the request query parameters.
 * @template Locals - The type of local variables available in the response object.
 *
 * @param fn - The asynchronous route handler function to be wrapped.
 * @returns A new function that wraps the provided handler and catches any errors.
 */
const catchAsync =
  (fn: RequestHandler<CustomParamsDictionary, any, any, qs.ParsedQs, Record<string, any>>) =>
    (
      req: Request<CustomParamsDictionary, any, any, any, Record<string, any>>,
      res: Response<any, Record<string, any>, number>,
      next: NextFunction
    ) => {
      Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };

export default catchAsync;
