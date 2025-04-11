import { NextFunction, Request, Response } from 'express';
import { inHTMLData } from 'xss-filters';

/**
 * Sanitizes input data to prevent XSS attacks. 
 * Handles primitives, arrays, and objects with proper error handling.
 * 
 * @param {any} data - The value to sanitize
 * @return {any} The sanitized value
 */
export const clean = <T>(data: T): T => {
    // Return as is if null or undefined
    if (data === null || data === undefined) {
        return data;
    }

    // Handle strings directly
    if (typeof data === 'string') {
        return inHTMLData(data).trim() as unknown as T;
    }

    // Handle numbers, booleans as is
    if (typeof data === 'number' || typeof data === 'boolean') {
        return data;
    }

    // Handle arrays recursively
    if (Array.isArray(data)) {
        return data.map(item => clean(item)) as unknown as T;
    }

    // Handle objects recursively
    if (typeof data === 'object') {
        const cleanedObject: Record<string, any> = {};

        for (const [key, value] of Object.entries(data as Record<string, any>)) {
            // Clean both keys and values
            const cleanKey = inHTMLData(key).trim();
            cleanedObject[cleanKey] = clean(value);
        }

        return cleanedObject as T;
    }

    // Default fallback for any other data types
    return data;
};

/**
 * Creates an Express middleware that adds sanitized versions of request data.
 * This approach doesn't modify the original properties but adds sanitized copies.
 */
const xssProtectionMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Add sanitized versions of request data
            if (req.body) {
                (req as any).sanitizedBody = clean(req.body);
            }

            if (req.query) {
                (req as any).sanitizedQuery = clean(req.query);
            }

            if (req.params) {
                (req as any).sanitizedParams = clean(req.params);
            }

            // Add utility methods to access sanitized data
            (req as any).getClean = {
                body: () => (req as any).sanitizedBody || {},
                query: () => (req as any).sanitizedQuery || {},
                params: () => (req as any).sanitizedParams || {}
            };

            next();
        } catch (error) {
            console.error('XSS Protection Middleware Error:', error);
            next(error);
        }
    };
};

export default xssProtectionMiddleware;