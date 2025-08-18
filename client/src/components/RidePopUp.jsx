import React, { useState, useEffect } from 'react';
import 'remixicon/fonts/remixicon.css';

const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const RidePopUp = (props) => {
    const { ride, confirmRide, setRidePopupPanel } = props;
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30); // 30-second countdown

    useEffect(() => {
        if (!ride) return;

        setTimer(30); // Reset timer for new ride requests
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setRidePopupPanel(false); // Auto-ignore if time runs out
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [ride, setRidePopupPanel]);

    const handleAccept = async () => {
        setLoading(true);
        try {
            await confirmRide();
            // The parent component will handle closing this panel and opening the next one
        } catch (error) {
            console.error("Failed to accept ride:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleIgnore = () => {
        setRidePopupPanel(false);
    };

    if (!ride) return null;

    return (
        <div className="flex flex-col h-full p-6">
            <div className="text-center mb-4">
                <h3 className='text-2xl font-bold text-gray-800'>New Ride Request</h3>
                <p className="text-gray-500">Accept within {timer} seconds</p>
            </div>
            
            <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                    <circle 
                        className="text-black" 
                        strokeWidth="8" 
                        strokeDasharray="283" 
                        strokeDashoffset={283 - (timer / 30) * 283}
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="45" 
                        cx="50" 
                        cy="50"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <img
                    className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full object-cover border-4 border-white'
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${ride.user?.fullname?.firstname} ${ride.user?.fullname?.lastname}`}
                    alt="Passenger Avatar"
                />
            </div>
            
            <div className="text-center mb-6">
                 <h2 className='text-xl font-bold'>{ride.user?.fullname?.firstname} {ride.user?.fullname?.lastname}</h2>
                 <p className="text-sm text-gray-500">Passenger</p>
            </div>

            <div className='w-full bg-gray-50 rounded-xl p-4 space-y-3 text-left mb-6'>
                <div className='flex items-start gap-4'>
                    <i className="ri-record-circle-line text-blue-500 mt-1"></i>
                    <div>
                        <p className='font-semibold text-gray-500 text-sm'>Pickup</p>
                        <p className='font-medium text-gray-800 truncate'>{ride.pickup}</p>
                    </div>
                </div>
                <div className='flex items-start gap-4'>
                    <i className="ri-map-pin-2-line text-red-500 mt-1"></i>
                    <div>
                        <p className='font-semibold text-gray-500 text-sm'>Destination</p>
                        <p className='font-medium text-gray-800 truncate'>{ride.destination}</p>
                    </div>
                </div>
            </div>
            
            <div className="w-full text-center bg-green-100 text-green-800 p-4 rounded-xl mb-6">
                <span className="font-semibold text-sm">TRIP EARNING</span>
                <p className="text-4xl font-bold">₹{ride.fare?.toFixed(2)}</p>
            </div>

            <div className='mt-auto grid grid-cols-2 gap-4'>
                <button
                    onClick={handleIgnore}
                    className='w-full bg-gray-200 text-gray-800 font-bold py-4 rounded-lg
                               hover:bg-gray-300 active:scale-95 transition'
                >
                    Ignore
                </button>
                <button
                    onClick={handleAccept}
                    disabled={loading}
                    className='w-full bg-black text-white font-bold py-4 rounded-lg flex items-center justify-center
                               hover:bg-gray-800 active:scale-95 transition disabled:bg-gray-500'
                >
                    {loading ? <Spinner /> : 'Accept'}
                </button>
            </div>
        </div>
    );
};

export default RidePopUp;
