import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import paymentRoute from './payment.route'
import profileRoute from './profile.route';
import path from 'path';
// import config from '../../config/config';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute
    },
    {
        path: '/users',
        route: userRoute
    },
    {
        path: '/payment',
        route: paymentRoute
    },
    {
        path: '/profile',
        route: profileRoute
    }
];

// const devRoutes = [
//     // routes available only in development mode
//     {
//         path: '/docs',
//         route: docsRoute
//     }
// ];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

// if (config.env === 'development') {
//     devRoutes.forEach((route) => {
//         router.use(route.path, route.route);
//     });
// }

export default router;
