import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    fullname:{
        fistname:{
            type:String,
            requried:true,
        },
        lastname:{
            type:String,
        }
    },
    email:{
        type:String,
        requried:true,
        unique:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
    },
    socketId:{
        type:String,
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },
    vehicle:{
        plate:{
            type:String,
            required:true,
        },
        capacity:{
            type:Number,
            requried:true,
            
        },
        vehicleType:{
            type:String,
            required:true,
            enum:['car','rickshaw','bike'],
        }
    },
    location:{
        lat:{
            type:Number,

        },
        lng:{
            type:Number
        }
    }

})

const Driver = mongoose.model('Driver',driverSchema);
export default Driver;