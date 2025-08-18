
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const registerUser = async (req, res, next) => {
    try {
        const { fullname, email, password } = req.body;

        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        
        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = new User({
            fullname,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async(req,res,next)=>{

    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(!user){
        return res.status(401).json({message:'Invalid Email or Password'});
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({message:'Invalid email or password'});
    }
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.cookie('token',token);
    res.status(200).json({"message":"User Login Successfully",token,user});
    
}

export const getUserProfile = async(req,res,next)=>{
    res.status(200).json(req.user);
}

export const logoutUser = async(req,res,next)=>{
    res.clearCookie('token');
    res.status(200).json({message:"Logged Out"});
}

export const replyAwake = async(req,res)=>{
    res.status(200).json({message:"Hello, Response from GoConnect"});
}