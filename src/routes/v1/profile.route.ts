import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { profileValidation } from '../../validations';
import { profileController } from '../../controllers';
const router = express.Router();
router
    .route('/:userId')
    .get(auth(), validate(profileValidation.getUserProfile), profileController.getProfile);

export default router;