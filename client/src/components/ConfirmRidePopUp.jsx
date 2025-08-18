import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';

const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const ConfirmRidePopUp = (props) => {
    const { ride, setConfirmRidePopupPanel } = props;
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCancel = () => {
        setConfirmRidePopupPanel(false);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!otp || otp.length < 4) {
            setError('Please enter a valid OTP.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/start-ride`, {
                params: { rideId: ride._id, otp: otp },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.status === 200) {
                setConfirmRidePopupPanel(false);
                navigate('/driver-riding', {
                    state: { ride: { ...ride, ...response.data } }
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto flex flex-col h-full">
            <div className="flex items-center justify-center relative mb-6">
                 <button onClick={handleCancel} className="absolute left-0 p-2 rounded-full hover:bg-gray-100">
                    <i className="ri-arrow-down-s-line text-2xl"></i>
                </button>
                <h3 className='text-xl font-bold text-gray-800'>Start Ride</h3>
            </div>

            <div className='flex-grow flex flex-col items-center text-center'>
                <div className="bg-gray-100 rounded-xl p-4 w-full mb-6">
                    <div className='flex items-center gap-4'>
                        <img 
                            className='h-14 w-14 rounded-full object-cover border-2 border-white'
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${ride?.user?.fullname?.firstname} ${ride?.user?.fullname?.lastname}`}
                            alt="User Avatar"
                        />
                        <div>
                            <h2 className='text-lg font-bold text-left'>{ride?.user?.fullname?.firstname} {ride?.user?.fullname?.lastname}</h2>
                            <p className="text-sm text-gray-500 text-left">Passenger</p>
                        </div>
                    </div>
                </div>

                <div className='w-full text-left bg-gray-50 rounded-xl p-4 space-y-3 mb-6'>
                    <div className='flex items-start gap-4'>
                        <i className="ri-record-circle-line text-blue-500 mt-1"></i>
                        <div>
                            <p className='font-semibold text-gray-500 text-sm'>Pickup</p>
                            <p className='font-medium text-gray-800'>{ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-start gap-4'>
                        <i className="ri-map-pin-2-line text-red-500 mt-1"></i>
                        <div>
                            <p className='font-semibold text-gray-500 text-sm'>Destination</p>
                            <p className='font-medium text-gray-800'>{ride?.destination}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submitHandler} className="w-full mt-auto">
                    <label htmlFor="otp" className="font-semibold text-gray-700 mb-2 block">Enter OTP to start the ride</label>
                    <input 
                        id="otp"
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        type="tel" 
                        maxLength="6"
                        className='bg-gray-100 px-6 py-4 font-mono text-2xl tracking-[1em] text-center rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black' 
                        placeholder='----'
                        autoComplete="one-time-code"
                    />

                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                    
                    <button 
                        type="submit"
                        disabled={loading}
                        className='w-full mt-6 text-lg bg-black text-white font-bold py-4 rounded-lg flex justify-center items-center h-14
                                   hover:bg-gray-800 active:scale-95 transition disabled:bg-gray-500'
                    >
                        {loading ? <Spinner /> : 'Confirm & Start Ride'}
                    </button>
                    <button 
                        type="button"
                        onClick={handleCancel} 
                        className='w-full mt-2 text-gray-600 font-semibold py-3 rounded-lg hover:bg-gray-100'
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConfirmRidePopUp;
