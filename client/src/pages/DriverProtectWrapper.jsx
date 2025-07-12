import React, { useContext, useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { DriverDataContext } from '../context/DriverContext'

const DriverProtectWrapper = ({
    children
}) => {

    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { driver, setDriver } = useContext(DriverDataContext)
    const [ isLoading, setIsLoading ] = useState(true)




    useEffect(() => {
        if (!token) {
            navigate('/driver-login')
        }
        console.log(token);
        axios.get(`${import.meta.env.VITE_BASE_URL}/drivers/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 201) {
                console.log(response.data);
                setDriver(response.data.driver)
                setIsLoading(false)
            }
        })
            .catch(err => {
                setIsLoading(false)
                localStorage.removeItem('token')
                navigate('/driver-login')
            })
    }, [ token ])

    

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }



    return (
        <>
            {children}
        </>
    )
}

export default DriverProtectWrapper