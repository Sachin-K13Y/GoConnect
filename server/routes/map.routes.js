import express from 'express';
import { getLocationCoordinate } from '../services/map.services.js';
import { authUser } from '../middleware/auth.middleware.js';
import { getCoordinates, getDistanceTime, getSuggestion } from '../controllers/map.controller.js';
const mapRoutes = express.Router();

mapRoutes.get('/get-coordinates',authUser,getCoordinates);
mapRoutes.get('/get-distance-time',authUser,getDistanceTime);
mapRoutes.get('/get-suggestion',authUser,getSuggestion);

export default mapRoutes;