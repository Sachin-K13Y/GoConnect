import React from 'react';
import 'remixicon/fonts/remixicon.css';

const VehicleIcon = ({ type }) => {
    switch (type?.toLowerCase()) {
        case 'car':
            return <i className="ri-taxi-fill text-5xl text-white"></i>;
        case 'auto':
            return <i className="ri-e-bike-2-fill text-5xl text-white"></i>;
        case 'moto':
            return <i className="ri-motorbike-fill text-5xl text-white"></i>;
        default:
            return <i className="ri-car-fill text-5xl text-white"></i>;
    }
};

const LookingForDriver = (props) => {
    const { pickup, destination, vehicleType, setVehicleFound, fare } = props;
    const calculatedFare = fare?.fare?.[vehicleType] || 0;

    const handleCancel = () => {
        // Here you would also add logic to cancel the ride request on the backend
        setVehicleFound(false);
    };

    return (
        <div className="flex flex-col h-full p-6 text-center">
            <h3 className='text-2xl font-bold text-gray-800 mb-4'>Connecting you to a driver...</h3>
            <p className="text-gray-500 mb-8">This should only take a moment. Thanks for your patience.</p>

            <div className='flex-grow flex items-center justify-center'>
                <div className="relative w-48 h-48">
                    {/* Radar Animation */}
                    <div className="absolute inset-0 bg-gray-200 rounded-full animate-ping"></div>
                    <div className="absolute inset-0 bg-gray-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    
                    {/* Central Icon */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black rounded-full shadow-lg">
                        <VehicleIcon type={vehicleType} />
                    </div>
                </div>
            </div>

            <div className='w-full bg-gray-50 rounded-xl p-4 space-y-3 my-8 text-left'>
                <div className='flex items-start gap-4'>
                    <i className="ri-record-circle-line text-blue-500 mt-1"></i>
                    <div>
                        <p className='font-semibold text-gray-500 text-sm'>From</p>
                        <p className='font-medium text-gray-800'>{pickup}</p>
                    </div>
                </div>
                <div className='flex items-start gap-4'>
                    <i className="ri-map-pin-2-line text-red-500 mt-1"></i>
                    <div>
                        <p className='font-semibold text-gray-500 text-sm'>To</p>
                        <p className='font-medium text-gray-800'>{destination}</p>
                    </div>
                </div>
            </div>

            <div className='mt-auto'>
                <button
                    onClick={handleCancel}
                    className='w-full bg-red-500 text-white font-bold py-4 rounded-lg
                               hover:bg-red-600 active:scale-95 transition'
                >
                    Cancel Ride
                </button>
            </div>
        </div>
    );
};

export default LookingForDriver;
