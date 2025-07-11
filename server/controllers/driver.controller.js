import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Driver from '../models/driver.model.js'
export const registerDriver = async(req,res,next)=>{
    const {fullname,email,password,vehicle} = req.body

    const hashedPassword = await bcrypt.hashSync(password,10);
    const isDriverAlreadyExist = await Driver.findOne({email});

    if(isDriverAlreadyExist){
        return res.status(400).json({message:"Driver Already Exist"});
    }
    const {plate,capacity,vehicleType} = vehicle;
    const {firstname,lastname} = fullname
    const driver = new Driver({
        fullname:{
            firstname,
            lastname
        },
        email,
        password:hashedPassword,
        vehicle:{
            plate,
            capacity,
            vehicleType
        }
    });
    console.log(driver);
    await driver.save();
    const token = jwt.sign(
        {id:driver._id},
        process.env.JWT_SECRET,
        {expiresIn:'24h'}
    );
    res.status(200).json({message:"Driver Registered",token,driver})
}
