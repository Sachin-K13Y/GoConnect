import express from 'express'
import { createRideController } from '../controllers/ride.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const rideRoutes = express.Router();

rideRoutes.post('/create',authUser,createRideController);
export default rideRoutes;