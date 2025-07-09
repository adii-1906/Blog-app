import express from 'express';
import { addBlog } from '../controllers/blogController.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';

const blogRouter = express.Router();

blogRouter.post("/add", auth, upload.single('image'), addBlog);

export default blogRouter;