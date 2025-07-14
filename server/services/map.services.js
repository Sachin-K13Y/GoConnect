import axios from "axios";
import Driver from "../models/driver.model.js";

export const getLocationCoordinate = async (address) => {
    const apikey = process.env.GOOGLE_MAP_API;
    
    let url = "";
    if (address.lat && address.lng) {
        url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${address.lat},${address.lng}&key=${apikey}`;
    } else if (address.address) {
        url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address.address)}&key=${apikey}`;
    } else {
        throw new Error("Invalid address object. Must contain either {lat, lng} or {address}");
    }

    try {
        const response = await axios.get(url);
        if (response.data.status === "OK") {
            const location = response.data.results[0].geometry.location;
            return {
                lat: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error(response.data.error_message || "Google Maps API error");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getDistanceTimeFromAPI = async(origin,destination)=>{
    if(!origin || !destination){
        throw new Error('Origin and destination are required');   
    }
    const apikey = process.env.GOOGLE_MAP_API;
    const url= `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apikey}`;
    try {
        const response = await axios.get(url);
        if(response.data.status === "OK"){
            const element = response.data.rows[0].elements[0];
            if(element.status === "OK"){
                return {
                    distance: element.distance.text,
                    duration: element.duration.text
                };
            } else {
                throw new Error(element.status);
            }
        } else {
            throw new Error(response.data.error_message || "Google Maps API error");
        }
    } catch (error) {
        throw new Error(error.message);
    }   
}
export const getSuggestionFromAPI = async (address) => {
    const apikey = process.env.GOOGLE_MAP_API;

    if (!address) {
        throw new Error("Address input is required for suggestions");
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(address)}&key=${apikey}`;

    try {
        const response = await axios.get(url);

        if (response.data.status === "OK") {
            return response.data.predictions.map(prediction => ({
                description: prediction.description,
                place_id: prediction.place_id
            }));
        } else {
            throw new Error(response.data.error_message || "Google Places API error");
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getDriversInTheRadius = async(ltd,lng,radius)=>{
    const drivers = await Driver.fid({
        location:{
            $geoWithin:{
                $centreSphere:[[ltd,lng],radius/3963.2]
            }
        }
    })
    return drivers;
}