import React, { useState } from 'react';
import 'remixicon/fonts/remixicon.css';

const VehicleCard = ({ type, name, description, capacity, fare, image, selected, onSelect }) => {
    const isSelected = selected === type;
    return (
        <div 
            onClick={() => onSelect(type)}
            className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all
                        border-2 ${isSelected ? 'border-black bg-gray-100' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
        >
            <div className="flex items-center gap-4">
                <img className='h-16 w-16 object-contain' src={image} alt={name} />
                <div>
                    <h4 className='font-bold text-lg text-gray-800'>{name}</h4>
                    <p className='text-sm text-gray-500'>
                        {description} · <i className="ri-user-fill text-xs"></i> {capacity}
                    </p>
                </div>
            </div>
            <h2 className='text-lg font-bold text-gray-800'>₹{fare ?? '...'}</h2>
        </div>
    );
};

const VehiclePanel = (props) => {
    const { fare, selectVehicle, setConfirmRidePanel, setVehiclePanel } = props;
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const fareData = fare?.fare || {};

    const vehicleOptions = [
        {
            type: 'car',
            name: 'goConnect Car',
            description: 'Comfy, private ride',
            capacity: 4,
            image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png'
        },
        {
            type: 'auto',
            name: 'goConnect Auto',
            description: 'Affordable auto ride',
            capacity: 3,
            image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png'
        },
        {
            type: 'moto',
            name: 'goConnect Moto',
            description: 'Quick bike ride',
            capacity: 1,
            image: 'https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png'
        }
    ];

    const handleConfirm = () => {
        if (selectedVehicle) {
            selectVehicle(selectedVehicle);
            setVehiclePanel(false);
            setConfirmRidePanel(true);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-center relative mb-6">
                 <button 
                    onClick={() => setVehiclePanel(false)} 
                    className="absolute left-0 p-2 rounded-full hover:bg-gray-100"
                    aria-label="Close"
                >
                    <i className="ri-arrow-down-s-line text-2xl"></i>
                </button>
                <h3 className='text-xl font-bold text-gray-800'>Choose a Ride</h3>
            </div>
            
            <div className="flex-grow space-y-3">
                {vehicleOptions.map(vehicle => (
                    <VehicleCard
                        key={vehicle.type}
                        type={vehicle.type}
                        name={vehicle.name}
                        description={vehicle.description}
                        capacity={vehicle.capacity}
                        fare={fareData[vehicle.type]}
                        image={vehicle.image}
                        selected={selectedVehicle}
                        onSelect={setSelectedVehicle}
                    />
                ))}
            </div>

            <div className='mt-6'>
                <button
                    onClick={handleConfirm}
                    disabled={!selectedVehicle}
                    className='w-full bg-black text-white font-bold py-4 rounded-lg
                               hover:bg-gray-800 active:scale-95 transition disabled:bg-gray-400 disabled:cursor-not-allowed'
                >
                    Confirm {selectedVehicle ? `goConnect ${selectedVehicle.charAt(0).toUpperCase() + selectedVehicle.slice(1)}` : ''}
                </button>
            </div>
        </div>
    );
};

export default VehiclePanel;
