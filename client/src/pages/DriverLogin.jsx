import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DriverDataContext } from '../context/DriverContext';
import 'remixicon/fonts/remixicon.css';

const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const DriverLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { setDriver } = useContext(DriverDataContext);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/drivers/login`, { email, password });

            if (response.status === 200) {
                const { user, token } = response.data;
                setDriver(user);
                localStorage.setItem('token', token);
                navigate('/driver-home');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='h-screen bg-gray-50 flex flex-col justify-center items-center p-4'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-8'>
                    <i className="ri-steering-2-fill text-5xl text-black"></i>
                    <h1 className='text-3xl font-bold text-gray-800 mt-2'>goConnect Driver</h1>
                    <p className='text-gray-500'>Welcome back! Please log in.</p>
                </div>

                <div className='bg-white p-8 rounded-2xl shadow-md'>
                    <form onSubmit={submitHandler}>
                        <div className='mb-5'>
                            <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor='email'>
                                Email Address
                            </label>
                            <input
                                id='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition'
                                type="email"
                                placeholder='email@example.com'
                            />
                        </div>

                        <div className='mb-6'>
                            <label className='block text-sm font-medium text-gray-700 mb-1' htmlFor='password'>
                                Password
                            </label>
                            <input
                                id='password'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition'
                                type="password"
                                placeholder='••••••••'
                            />
                        </div>
                        
                        {error && (
                            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
                        )}

                        <button
                            type='submit'
                            disabled={loading}
                            className='bg-black text-white font-semibold rounded-lg w-full h-12 flex items-center justify-center
                                       hover:bg-gray-800 active:scale-95 transition disabled:bg-gray-400 disabled:cursor-not-allowed'
                        >
                            {loading ? <Spinner /> : 'Login'}
                        </button>
                    </form>

                    <p className='text-center text-sm text-gray-600 mt-6'>
                        Don't have an account? <Link to='/driver-signup' className='font-medium text-black hover:underline'>Register here</Link>
                    </p>
                </div>
                
                <div className='mt-8 text-center'>
                     <Link
                        to='/login'
                        className='text-sm text-gray-500 hover:text-black hover:underline transition'
                    >
                        Are you a passenger? Sign in here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DriverLogin;