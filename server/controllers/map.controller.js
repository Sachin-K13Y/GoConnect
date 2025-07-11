import { getDistanceTimeFromAPI, getLocationCoordinate, getSuggestionFromAPI } from "../services/map.services.js";

export const getCoordinates = async(req,res,next)=>{
    const {address} = req.query;

    try {
        const coordinates = await getLocationCoordinate({address});
        res.status(200).json(coordinates);
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'Internal Server error'});
    }
}
export const getDistanceTime = async (req, res, next) => {
    try {
        const { origin, destination } = req.query;

        if (!origin || !destination) {
            return res.status(400).json({ message: "Origin and destination are required." });
        }

        const distanceTime = await getDistanceTimeFromAPI(origin, destination);

        res.status(200).json(distanceTime);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const getSuggestion = async(req,res,next)=>{
    const {input} = req.query;
    const suggestions = await getSuggestionFromAPI(input);
    res.status(200).json(suggestions);
}