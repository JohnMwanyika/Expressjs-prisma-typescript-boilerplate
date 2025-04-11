import { Router } from "express";

const router = Router();

router.get('/', (req, res) => {
    const name = req.query.name;
    res.send(`Payment route is working! name is ${name}`);
});

router.post('/', (req, res) => {
    const io = req.app.locals.io; //access io from app context
    const { phone, amount } = req.body;

    //emmit to frontend
    io.emit('payment-confirmed', { phone, amount });

    res.status(201).json({
        message: 'Payment processed successfully!',
        data: { phone, amount }
    });
});
export default router;