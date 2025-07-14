import express from 'express'
import { createRideController, getFareController } from '../controllers/ride.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const rideRoutes = express.Router();
rideRoutes.get('/get-fare',authUser,getFareController);
rideRoutes.post('/create',authUser,createRideController);
export default rideRoutes;