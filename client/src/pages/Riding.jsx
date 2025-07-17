import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import { SocketContext } from '../context/socketContext';
import LiveTracking from './LiveTracking';

const Riding = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { socket } = useContext(SocketContext);
    const rideData = location.state?.ride;

    useEffect(() => {
        if (!socket) return;

        const handleRideEnded = () => {
            navigate('/home');
        };

        socket.on("ride-ended", handleRideEnded);

        return () => {
            socket.off("ride-ended", handleRideEnded);
        };
    }, [socket, navigate]);

    const getVehicleIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'car':
                return <i className="ri-taxi-line text-3xl"></i>;
            case 'auto':
                return <i className="ri-e-bike-2-line text-3xl"></i>;
            case 'moto':
                return <i className="ri-motorbike-line text-3xl"></i>;
            default:
                return <i className="ri-car-line text-3xl"></i>;
        }
    };

    if (!rideData) {
        return <Navigate to="/home" replace />;
    }

    return (
        <div className='h-screen flex flex-col bg-gray-100'>
            <div className='h-1/2 w-full'>
                <LiveTracking />
            </div>

            <div className='h-1/2 p-6 bg-white rounded-t-3xl shadow-inner-top flex flex-col justify-between'>
                <div>
                    <div className='text-center mb-4'>
                        <h2 className='text-2xl font-bold text-gray-800'>Enjoy your ride!</h2>
                        <p className='text-gray-500'>You are on your way to the destination.</p>
                    </div>

                    <div className='bg-gray-50 rounded-xl p-4 mb-4'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                <img 
                                    className='h-14 w-14 rounded-full object-cover border-2 border-gray-200'
                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${rideData.driver?.fullname?.firstname} ${rideData.driver?.fullname?.lastname}`}
                                    alt="Driver Avatar"
                                />
                                <div>
                                    <h3 className='font-bold text-gray-800'>{rideData.driver?.fullname?.firstname}</h3>
                                    <p className='text-sm text-gray-500'>{rideData.driver?.vehicle?.plate}</p>
                                </div>
                            </div>
                            <div className='text-yellow-500 bg-gray-800 p-3 rounded-lg'>
                                {getVehicleIcon(rideData.driver?.vehicle?.vehicleType)}
                            </div>
                        </div>
                    </div>

                    <div className='space-y-3 text-sm'>
                        <div className='flex items-start gap-4 p-3'>
                            <i className="ri-record-circle-line text-blue-500 mt-1"></i>
                            <div>
                                <p className='font-semibold text-gray-500'>Pickup</p>
                                <p className='font-medium text-gray-800'>{rideData.pickup}</p>
                            </div>
                        </div>
                        <div className='flex items-start gap-4 p-3'>
                            <i className="ri-map-pin-2-line text-red-500 mt-1"></i>
                            <div>
                                <p className='font-semibold text-gray-500'>Destination</p>
                                <p className='font-medium text-gray-800'>{rideData.destination}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='text-center border-t pt-4'>
                    <p className='text-sm text-gray-400'>Ride ID: {rideData._id}</p>
                </div>
            </div>
        </div>
    );
};

export default Riding;
