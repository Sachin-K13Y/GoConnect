import express from 'express'
import { getProfile, loginDriver, registerDriver } from '../controllers/driver.controller.js';
import { authDriver } from '../middleware/auth.middleware.js';

const driverRoutes = express.Router();
driverRoutes.post('/register',registerDriver)
driverRoutes.post('/login',loginDriver)
driverRoutes.get('/profile',authDriver,getProfile)
export default driverRoutes;
