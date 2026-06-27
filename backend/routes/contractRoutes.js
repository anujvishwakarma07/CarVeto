import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { uploadContent } from '../controllers/contractController.js';

const router = express.Router();
router.post('/upload', upload.single('contract'), uploadContent);

export default router;
