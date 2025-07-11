import express from 'express'
import { registerDriver } from '../controllers/driver.controller.js';

const driverRoutes = express.Router();
driverRoutes.post('/register',registerDriver)
export default driverRoutes;
