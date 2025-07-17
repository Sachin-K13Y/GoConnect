import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';

const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const UserSignup = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        const newUser = {
            fullname: {
                firstname: formData.firstName,
                lastname: formData.lastName
            },
            email: formData.email,
            password: formData.password
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
            if (response.status === 201) {
                setSuccess('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='h-screen bg-gray-50 flex flex-col justify-center items-center p-4'>
            <div className='w-full max-w-md'>
                <div className='text-center mb-8'>
                    <i className="ri-user-add-fill text-5xl text-black"></i>
                    <h1 className='text-3xl font-bold text-gray-800 mt-2'>Create Your Account</h1>
                    <p className='text-gray-500'>Join goConnect to start riding.</p>
                </div>

                <div className='bg-white p-8 rounded-2xl shadow-md'>
                    <form onSubmit={submitHandler}>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                            <input name="firstName" value={formData.firstName} onChange={handleChange} required className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition' type="text" placeholder='First Name' />
                            <input name="lastName" value={formData.lastName} onChange={handleChange} required className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition' type="text" placeholder='Last Name' />
                        </div>

                        <div className='mb-4'>
                            <input name="email" value={formData.email} onChange={handleChange} required className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition' type="email" placeholder='Email Address' />
                        </div>

                        <div className='mb-6'>
                            <input name="password" value={formData.password} onChange={handleChange} required className='bg-gray-100 rounded-lg px-4 py-3 border-2 border-transparent w-full focus:outline-none focus:border-black transition' type="password" placeholder='Password' />
                        </div>
                        
                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}

                        <button
                            type='submit'
                            disabled={loading || success}
                            className='bg-black text-white font-semibold rounded-lg w-full h-12 flex items-center justify-center
                                       hover:bg-gray-800 active:scale-95 transition disabled:bg-gray-400 disabled:cursor-not-allowed'
                        >
                            {loading ? <Spinner /> : 'Create Account'}
                        </button>
                    </form>

                    <p className='text-center text-sm text-gray-600 mt-6'>
                        Already have an account? <Link to='/login' className='font-medium text-black hover:underline'>Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserSignup;
