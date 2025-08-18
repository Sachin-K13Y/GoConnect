import React from 'react';
import 'remixicon/fonts/remixicon.css';

const VehicleIcon = ({ type }) => {
    switch (type?.toLowerCase()) {
        case 'car':
            return <i className="ri-taxi-line text-2xl"></i>;
        case 'auto':
            return <i className="ri-e-bike-2-line text-2xl"></i>;
        case 'moto':
            return <i className="ri-motorbike-line text-2xl"></i>;
        default:
            return <i className="ri-car-line text-2xl"></i>;
    }
};

const WaitingForDriver = (props) => {
    const { ride, setWaitingForDriver } = props;

    const handleCancel = () => {
        // Add logic here to cancel the ride via an API call
        console.log("Ride cancellation requested.");
        setWaitingForDriver(false);
    };

    if (!ride) {
        return (
            <div className="flex flex-col h-full p-6 text-center items-center justify-center">
                <p className="text-gray-500">Waiting for ride details...</p>
            </div>
        );
    }

    const { driver, otp, pickup, destination } = ride;

    return (
        <div className="flex flex-col h-full p-6">
            <div className="text-center mb-6">
                <h3 className='text-2xl font-bold text-gray-800'>Your driver is on the way!</h3>
                <p className="text-gray-500">Please be ready at the pickup location.</p>
            </div>

            <div className='bg-gray-50 rounded-xl p-4 mb-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <img 
                            className='h-16 w-16 rounded-full object-cover border-2 border-white'
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${driver?.fullname?.firstname} ${driver?.fullname?.lastname}`}
                            alt="Driver Avatar"
                        />
                        <div>
                            <h4 className='font-bold text-lg text-gray-800'>{driver?.fullname?.firstname}</h4>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <i className="ri-star-fill text-yellow-400"></i>
                                <span>{driver?.rating?.toFixed(1) || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-lg tracking-wider">{driver?.vehicle?.plate}</p>
                        <p className="text-sm text-gray-500">{driver?.vehicle?.color} {driver?.vehicle?.vehicleType}</p>
                    </div>
                </div>
            </div>
            
            <div className="text-center bg-black text-white p-4 rounded-xl mb-6">
                <span className="font-semibold text-sm tracking-widest">YOUR OTP</span>
                <p className="text-5xl font-bold tracking-[0.2em] ml-2">{otp}</p>
            </div>

            <div className='w-full bg-gray-50 rounded-xl p-4 space-y-3 text-left mb-6'>
                <div className='flex items-start gap-4'>
                    <i className="ri-record-circle-line text-blue-500 mt-1"></i>
                    <div>
                        <p className='font-semibold text-gray-500 text-sm'>Pickup</p>
                        <p className='font-medium text-gray-800'>{pickup}</p>
                    </div>
                </div>
                <div className='flex items-start gap-4'>
                    <i className="ri-map-pin-2-line text-red-500 mt-1"></i>
                    <div>
                        <p className='font-semibold text-gray-500 text-sm'>Destination</p>
                        <p className='font-medium text-gray-800'>{destination}</p>
                    </div>
                </div>
            </div>

            <div className='mt-auto grid grid-cols-2 gap-4'>
                <button
                    onClick={handleCancel}
                    className='w-full bg-red-100 text-red-700 font-bold py-4 rounded-lg
                               hover:bg-red-200 active:scale-95 transition'
                >
                    Cancel
                </button>
                <button
                    className='w-full bg-gray-800 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2
                               hover:bg-black active:scale-95 transition'
                >
                    <i className="ri-phone-line"></i>
                    Contact
                </button>
            </div>
        </div>
    );
};

export default WaitingForDriver;
