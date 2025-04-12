import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import paymentRoutes from './routes/v1/payment.route';
import helmet from 'helmet';
import xss from "./middlewares/xss";
import compression from 'compression';
import cors from 'cors';
import config from './config/config';
import morgan from './config/morgan';
import passport from 'passport';
import { jwtStrategy } from './config/passport';
import { authLimiter } from './middlewares/rateLimiter';
import ApiError from './utils/ApiError';
import httpStatus from 'http-status'
import routes from './routes/v1';

const app = express();

//middleware responsible for logging info and errors on the console
if (config.env !== 'test') {
    app.use(morgan.successHandler);
    app.use(morgan.errorHandler);
}

const httpServer = createServer(app);

const io = new Server(
    httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
}
);

app.use(helmet()); //set security HTTP headers
app.use(express.json()); //parse JSON bodies
app.use(express.urlencoded({ extended: true })); //parse urlencoded request body
app.use(xss()); // sanitize request data
app.use(compression()); //gzip compression for improving response speed
app.use(cors()); //enable cross origins
// app.options('*', cors())
app.use(passport.initialize()); // jwt authentication
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
    app.use('/v1/auth', authLimiter);
}

//expose io instance globally through app.locals
app.locals.io = io;


// Handle socket connections
io.on('connection', (socket) => {
    console.log(`🔥 New socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
    });
});

//attach routes
app.use('/api/payment', paymentRoutes);
app.use('/v1', routes)

app.get('/', (req, res) => {
    res.send('Hello TypeScript with Express!');
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

const PORT = config.port;
httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
