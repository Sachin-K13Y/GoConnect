import express from 'express'
import { getUserProfile, loginUser, logoutUser, registerUser } from '../controllers/user.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const userRoute = express.Router();

userRoute.post('/register',registerUser)
userRoute.post('/login',loginUser)
userRoute.get('/profile',authUser,getUserProfile)
userRoute.get('/logout',authUser,logoutUser)
export default userRoute;