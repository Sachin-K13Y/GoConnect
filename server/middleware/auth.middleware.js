import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import User from '../models/user.model.js';
import Driver from '../models/driver.model.js';

export const authUser = async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        req.user = user;
        console.log(user);
        return next();
    }
    catch(err){
        return res.status(401).json({message:'Unauthorized Access'});
    }
}
export const authDriver = async(req,res,next)=>{
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if(!token){
        return res.status(401).json({message:'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await Driver.findById(decoded.id);

        req.user = user;
        console.log(user);
        return next();
    }
    catch(err){
        return res.status(401).json({message:'Unauthorized Access'});
    }
}