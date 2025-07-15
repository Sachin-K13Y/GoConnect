import Ride from "../models/ride.model.js";
import { getDriversInTheRadius, getLocationCoordinate } from "../services/map.services.js";
import { createRide, getFare } from "../services/ride.service.js";
import { sendMessageToSocketId } from "../socket.js";

export const createRideController = async(req,res)=>{
    
    const {pickup,destination,vehicleType} = req.body;
    try {
        const ride = await createRide(req.user._id,pickup,destination,vehicleType);
        res.status(201).json(ride);
        
        
        const pickupCoordinates = await getLocationCoordinate(pickup)
        console.log(pickupCoordinates);
        
        const driversInRadius = await getDriversInTheRadius(pickupCoordinates.ltd,pickupCoordinates.lng,2)
        console.log(driversInRadius);
        ride.otp = "";
        const rideWithUser = await Ride.findById(ride._id).populate('user');
    
        driversInRadius.map(async (driver)=>{
            
            sendMessageToSocketId(driver.socketId,{
                
                event:'new-ride',
                data: rideWithUser
            })
        })
        
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
export const getFareController = async(req,res)=>{
    const {pickup,destination} = req.query;
    try {
        const fare = await getFare(pickup,destination);
        return res.status(200).json(fare);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:error.message})
    }
}