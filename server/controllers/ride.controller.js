import { createRide, getFare } from "../services/ride.service.js";

export const createRideController = async(req,res)=>{
    
    const {pickup,destination,vehicleType} = req.body;
    try {
        const ride = await createRide(req.user._id,pickup,destination,vehicleType);

        
        return res.status(201).json(ride);
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