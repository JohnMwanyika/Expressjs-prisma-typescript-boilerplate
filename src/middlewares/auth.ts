import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { roleRights } from '../config/roles';
import { NextFunction, Request, Response } from 'express';
import { User } from '../generated/prisma-client-js';

/**
 * A callback function used to verify user authentication and authorization.
 *
 * @param req - The request object, which will be augmented with the authenticated user.
 * @param resolve - A function to call when the verification is successful.
 * @param reject - A function to call when the verification fails.
 * @param requiredRights - An array of rights required to access the resource.
 * @returns An asynchronous function that processes the authentication and authorization logic.
 *
 * The inner function takes the following parameters:
 * - `err`: Any error that occurred during authentication.
 * - `user`: The authenticated user object or `false` if authentication failed.
 * - `info`: Additional information about the authentication process.
 *
 * The function performs the following:
 * 1. Rejects the request with an `UNAUTHORIZED` error if there is an error, no user, or additional info indicating failure.
 * 2. Assigns the authenticated user to `req.user`.
 * 3. Checks if the user has the required rights to access the resource.
 * 4. Rejects the request with a `FORBIDDEN` error if the user lacks the required rights and is not the owner of the resource.
 * 5. Resolves the request if all checks pass.
 */
const verifyCallback =
  (
    req: any,
    resolve: (value?: unknown) => void,
    reject: (reason?: unknown) => void,
    requiredRights: string[]
  ) =>
    async (err: unknown, user: User | false, info: unknown) => {
      if (err || info || !user) {
        return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
      }
      req.user = user;

      if (requiredRights.length) {
        const userRights = roleRights.get(user.role) ?? [];
        const hasRequiredRights = requiredRights.every((requiredRight) =>
          userRights.includes(requiredRight)
        );
        if (!hasRequiredRights && req.params.userId !== user.id) {
          return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
        }
      }

      resolve();
    };

/**
 * Middleware to authenticate a user and verify their rights using Passport.js.
 * 
 * This middleware uses the 'jwt' strategy to authenticate the user. After successful
 * authentication, it checks if the user has the required rights. If the user is not
 * authenticated or does not have the necessary rights, an error is passed to the next
 * middleware.
 * 
 * @param {...string[]} requiredRights - A list of rights that the authenticated user must have.
 * @returns A middleware function that handles authentication and rights verification.
 * 
 * @example
 * // Example usage in an Express route
 * app.get('/protected-route', auth('admin', 'editor'), (req, res) => {
 *   res.send('You have access to this route.');
 * });
 */
const auth =
  (...requiredRights: string[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
      return new Promise((resolve, reject) => {
        passport.authenticate(
          'jwt',
          { session: false },
          verifyCallback(req, resolve, reject, requiredRights)
        )(req, res, next);
      })
        .then(() => next())
        .catch((err) => next(err));
    };

export default auth;
