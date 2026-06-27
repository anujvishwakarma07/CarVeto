import express from 'express';
import { checkVin } from '../controllers/vinController.js';

const router = express.Router();

router.get('/decode/:vin', checkVin);

export default router;