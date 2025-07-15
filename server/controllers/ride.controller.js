import Ride from "../models/ride.model.js";
import { getDriversInTheRadius, getLocationCoordinate } from "../services/map.services.js";
import { createRide, getFare } from "../services/ride.service.js";
import { sendMessageToSocketId } from "../socket.js";

export const createRideController = async(req,res)=>{
    
    const {pickup,destination,vehicleType} = req.body;
    try {
        // Create the ride
        console.log("Creating ride with user ID:", req.user._id);
        const ride = await createRide(req.user._id,pickup,destination,vehicleType);
        console.log("Created ride:", ride);
        
        // Get pickup coordinates
        const pickupCoordinates = await getLocationCoordinate(pickup);
        console.log("Pickup coordinates:", pickupCoordinates);
        
        // Find nearby drivers
        const driversInRadius = await getDriversInTheRadius(pickupCoordinates.ltd,pickupCoordinates.lng,2);
        console.log("Drivers in radius:", driversInRadius);
        
        // Get ride with populated user data
        const rideWithUser = await Ride.findById(ride._id)
            .populate('user', '-password') // Exclude password field
            .lean(); // Convert to plain JavaScript object
            
        if (!rideWithUser) {
            console.error("Failed to populate ride data");
            return res.status(500).json({ message: "Failed to process ride request" });
        }
        
        console.log("Ride with user data:", rideWithUser);
        
        // Notify drivers
        await Promise.all(driversInRadius.map(driver => {
            if (driver.socketId) {
                console.log(`Notifying driver ${driver._id} at socket ${driver.socketId}`);
                return sendMessageToSocketId(driver.socketId, 'new-ride', {
                    ride: rideWithUser
                });
            }
        }));
        
        // Send response after processing is complete
        res.status(201).json(ride);
        
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