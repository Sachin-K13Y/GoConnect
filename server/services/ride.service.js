import Ride from "../models/ride.model.js";
import crypto from "crypto"
import { getDistanceTimeFromAPI} from "../services/map.services.js";
import e from "cors";

export const getFare = async (pickup, destination) => {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await getDistanceTimeFromAPI(pickup, destination);

    const distanceInKm = parseFloat(distanceTime.distance.replace(" km", "").trim());
    const durationInMin = parseInt(distanceTime.duration.replace(" mins", "").trim());


    const rates = {
        bike: 10,  
        auto: 15, 
        car: 20 
    };

    const fares = {
        bike: Math.max(30, distanceInKm * rates.bike),
        auto: Math.max(40, distanceInKm * rates.auto),
        car: Math.max(50, distanceInKm * rates.car) 
    };

    return {

        fare: {
            bike: Math.round(fares.bike),
            auto: Math.round(fares.auto),
            car: Math.round(fares.car)
        }
    };
};

export const createRide =async(user,pickup,destination,vehicleType)=>{
    if(!user||!pickup || !destination || !vehicleType){
        throw new Error('User, pickup, destination and fare are required');
    }
    const fare = await getFare(pickup,destination);
    console.log(fare);
    const ride = new Ride({
        user,
        pickup,
        destination,
        fare:fare.fare[vehicleType],
        otp:getOtp(6)

    })
    await ride.save();
    return ride;
}

export const getOtp = (num)=>{
    const otp = crypto.randomInt(Math.pow(10,num-1),Math.pow(10,num)).toString();
    return otp;
}

export const confirmRide = async(rideId,driver)=>{
    if(!rideId){
        throw new Error('Ride ID is required');
    }
    await Ride.findByIdAndUpdate(rideId, { status: 'accepted',
        driver:driver._id,
    }, { new: true });
    const ride = await Ride.findOne({
        _id:rideId
    }).populate('user').populate('driver').select('+otp');

    if(!ride){
        throw new Error('Ride not found');
    }

    return ride;
}