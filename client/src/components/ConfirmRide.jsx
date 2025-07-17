import React, { useState } from 'react';
import 'remixicon/fonts/remixicon.css';

const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const VehicleIcon = ({ type }) => {
    switch (type?.toLowerCase()) {
        case 'car':
            return <i className="ri-taxi-fill text-5xl text-yellow-500"></i>;
        case 'auto':
            return <i className="ri-e-bike-2-fill text-5xl text-green-500"></i>;
        case 'moto':
            return <i className="ri-motorbike-fill text-5xl text-blue-500"></i>;
        default:
            return <i className="ri-car-fill text-5xl text-gray-500"></i>;
    }
};

const ConfirmRide = (props) => {
    const {
        pickup,
        destination,
        vehicleType,
        fare,
        createRide,
        setConfirmRidePanel,
        setVehicleFound,
        setVehiclePanel
    } = props;

    const [isLoading, setIsLoading] = useState(false);

    const calculatedFare = fare?.fare?.[vehicleType] || 0;

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await createRide();
            setConfirmRidePanel(false);
            setVehicleFound(true);
        } catch (error) {
            console.error("Failed to create ride:", error);
            // Optionally show an error message to the user
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleBack = () => {
        setConfirmRidePanel(false);
        setVehiclePanel(true);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                 <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100">
                    <i className="ri-arrow-left-s-line text-2xl"></i>
                </button>
                <h3 className='text-xl font-bold text-gray-800'>Confirm Your Ride</h3>
                <div className="w-8"></div>
            </div>

            <div className='flex-grow flex flex-col items-center'>
                <div className="mb-6">
                    <VehicleIcon type={vehicleType} />
                </div>
                
                <div className='w-full bg-gray-50 rounded-xl p-4 space-y-3'>
                    <div className='flex items-start gap-4'>
                        <i className="ri-record-circle-line text-blue-500 mt-1"></i>
                        <div>
                            <p className='font-semibold text-gray-500 text-sm'>Pickup</p>
                            <p className='font-medium text-gray-800'>{pickup || 'Not specified'}</p>
                        </div>
                    </div>
                    <div className='flex items-start gap-4'>
                        <i className="ri-map-pin-2-line text-red-500 mt-1"></i>
                        <div>
                            <p className='font-semibold text-gray-500 text-sm'>Destination</p>
                            <p className='font-medium text-gray-800'>{destination || 'Not specified'}</p>
                        </div>
                    </div>
                     <div className='flex items-start gap-4'>
                        <i className="ri-wallet-3-line text-green-500 mt-1"></i>
                        <div>
                            <p className='font-semibold text-gray-500 text-sm'>Payment</p>
                            <p className='font-medium text-gray-800'>Cash</p>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-between items-center bg-gray-800 text-white p-4 rounded-xl mt-4">
                    <span className="font-semibold">Total Fare</span>
                    <span className="text-2xl font-bold">₹{calculatedFare}</span>
                </div>
            </div>

            <div className='mt-6'>
                <button
                    className='w-full bg-black text-white font-bold py-4 rounded-lg flex items-center justify-center h-14
                               hover:bg-gray-800 active:scale-95 transition disabled:bg-gray-500'
                    onClick={handleConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? <Spinner /> : 'Confirm & Find Driver'}
                </button>
            </div>
        </div>
    );
};

export default ConfirmRide;
