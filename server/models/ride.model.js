import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    driver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Driver'
    },
    pickup:{
        type:String,
        required:true,
    },
    destination:{
        type:String,
        required:true,
    },
    fare:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        enum:['pending','accepted','completed','cancelled','ongoing'],
        default:'pending'
    },
    distance:{
        type:Number,
    },
    paymentId:{
        type:String,
    },
    orderId:{
        type:String,
    },
    signature:{
        type:String
    },
    duration:{
        type:Number
    },
    otp:{
        type:String,
        select:false
    }
})

const Ride = mongoose.model('Ride',rideSchema);
export default Ride;