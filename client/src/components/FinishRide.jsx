import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';

const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const FinishRide = ({ rideData, setFinishRidePanel }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const endRide = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/ride/end-ride`, {
                rideId: rideData._id
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 200) {
                navigate('/driver-home');
            }
        } catch (err) {
            setError('Failed to end ride. Please try again.');
            console.error("End ride error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-center relative mb-6">
                <button 
                    onClick={() => setFinishRidePanel(false)} 
                    className="absolute left-0 p-2 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                >
                    <i className="ri-arrow-down-s-line text-2xl"></i>
                </button>
                <h3 className='text-xl font-bold text-gray-800'>Complete Ride</h3>
            </div>

            <div className='flex-grow flex flex-col items-center text-center'>
                <img
                    className='h-20 w-20 rounded-full object-cover border-4 border-white shadow-lg mb-4'
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${rideData?.user?.fullname?.firstname} ${rideData?.user?.fullname?.lastname}`}
                    alt="Passenger Avatar"
                />
                <h2 className='text-lg font-bold'>{rideData?.user?.fullname?.firstname} {rideData?.user?.fullname?.lastname}</h2>
                <p className="text-sm text-gray-500 mb-6">Trip Completed</p>

                <div className='w-full bg-gray-50 rounded-xl p-4 space-y-3 text-left mb-6'>
                     <div className='flex items-start gap-4'>
                        <i className="ri-record-circle-line text-blue-500 mt-1"></i>
                        <div>
                            <p className='font-semibold text-gray-500 text-sm'>From</p>
                            <p className='font-medium text-gray-800'>{rideData?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-start gap-4'>
                        <i className="ri-map-pin-2-line text-red-500 mt-1"></i>
                        <div>
                            <p className='font-semibold text-gray-500 text-sm'>To</p>
                            <p className='font-medium text-gray-800'>{rideData?.destination}</p>
                        </div>
                    </div>
                </div>

                <div className="w-full text-center bg-green-100 text-green-800 p-4 rounded-xl">
                    <span className="font-semibold text-sm">COLLECT CASH</span>
                    <p className="text-4xl font-bold">₹{rideData?.fare?.toFixed(2)}</p>
                </div>
            </div>

            <div className='mt-6'>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <button
                    onClick={endRide}
                    disabled={loading}
                    className='w-full bg-black text-white font-bold py-4 rounded-lg flex items-center justify-center h-14
                               hover:bg-gray-800 active:scale-95 transition disabled:bg-gray-500'
                >
                    {loading ? <Spinner /> : 'Finish & Go Online'}
                </button>
            </div>
        </div>
    );
};

export default FinishRide;
