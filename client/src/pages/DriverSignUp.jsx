import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DriverDataContext } from '../context/DriverContext';
import 'remixicon/fonts/remixicon.css';

const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const DriverSignUp = () => {
    const navigate = useNavigate();
    const { setDriver } = useContext(DriverDataContext);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        vehicleColor: '',
        vehiclePlate: '',
        vehicleCapacity: '',
        vehicleType: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const driverData = {
            fullname: {
                firstname: formData.firstName,
                lastname: formData.lastName
            },
            email: formData.email,
            password: formData.password,
            vehicle: {
                color: formData.vehicleColor,
                plate: formData.vehiclePlate,
                capacity: formData.vehicleCapacity,
                vehicleType: formData.vehicleType
            }
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/drivers/register`, driverData);
            if (response.status === 200) {
                const { driver, token } = response.data;
                setDriver(driver);
                localStorage.setItem('token', token);
                navigate('/driver-home');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4'>
            <div className='w-full max-w-2xl'>
                <div className='text-center mb-8'>
                    <i className="ri-steering-2-fill text-5xl text-black"></i>
                    <h1 className='text-3xl font-bold text-gray-800 mt-2'>Become a goConnect Driver</h1>
                    <p className='text-gray-500'>Complete the form below to get started.</p>
                </div>

                <div className='bg-white p-8 rounded-2xl shadow-md'>
                    <form onSubmit={submitHandler}>
                        <fieldset className='mb-8'>
                            <legend className='text-lg font-semibold text-gray-800 border-b border-gray-200 w-full pb-2 mb-4'>
                                Personal Information
                            </legend>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <input name="firstName" value={formData.firstName} onChange={handleChange} required className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition' type="text" placeholder='First Name' />
                                <input name="lastName" value={formData.lastName} onChange={handleChange} required className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition' type="text" placeholder='Last Name' />
                            </div>
                            <div className='mt-4'>
                                <input name="email" value={formData.email} onChange={handleChange} required className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition' type="email" placeholder='Email Address' />
                            </div>
                            <div className='mt-4'>
                                <input name="password" value={formData.password} onChange={handleChange} required className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition' type="password" placeholder='Password' />
                            </div>
                        </fieldset>

                        <fieldset>
                            <legend className='text-lg font-semibold text-gray-800 border-b border-gray-200 w-full pb-2 mb-4'>
                                Vehicle Details
                            </legend>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <input name="vehicleColor" value={formData.vehicleColor} onChange={handleChange} required className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition' type="text" placeholder='Vehicle Color (e.g., Blue)' />
                                <input name="vehiclePlate" value={formData.vehiclePlate} onChange={handleChange} required className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition' type="text" placeholder='License Plate (e.g., ABC-123)' />
                                <input name="vehicleCapacity" value={formData.vehicleCapacity} onChange={handleChange} required className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition' type="number" placeholder='Capacity (e.g., 4)' />
                                <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} required className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition text-gray-500'>
                                    <option value="" disabled>Select Vehicle Type</option>
                                    <option value="car" className="text-black">Car</option>
                                    <option value="auto" className="text-black">Auto</option>
                                    <option value="moto" className="text-black">Moto</option>
                                </select>
                            </div>
                        </fieldset>

                        {error && (
                            <p className="text-red-500 text-sm text-center mt-6">{error}</p>
                        )}

                        <button type='submit' disabled={loading} className='bg-black text-white font-semibold rounded-lg w-full h-12 flex items-center justify-center mt-8 hover:bg-gray-800 active:scale-95 transition disabled:bg-gray-400 disabled:cursor-not-allowed'>
                            {loading ? <Spinner /> : 'Create Account'}
                        </button>
                    </form>

                    <p className='text-center text-sm text-gray-600 mt-6'>
                        Already have an account? <Link to='/driver-login' className='font-medium text-black hover:underline'>Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DriverSignUp;
