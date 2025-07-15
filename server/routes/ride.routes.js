import express from 'express'
import { createRideController, getFareController, confirmRideController } from '../controllers/ride.controller.js';
import { authDriver, authUser } from '../middleware/auth.middleware.js';

const rideRoutes = express.Router();
rideRoutes.get('/get-fare',authUser,getFareController);
rideRoutes.post('/create',authUser,createRideController);

rideRoutes.post('/confirm',authDriver,confirmRideController)
export default rideRoutes;