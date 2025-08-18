import express from 'express';
import { replyAwake } from '../controllers/user.controller.js';

const misRoutes = express.Router();

misRoutes.get('/awake',replyAwake);


export default misRoutes;