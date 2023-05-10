//THIS PAGE WILL PROMPT IF THE USER WILL GO TO WRONG ROUTE.

import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../Functions/authContext'
import ErrorImg from '../Assets/webp-img/rtu-logo.webp'
export const Error = () => {
    const { currentUser } = useAuth()
   
  return (

    <div className="mx-auto max-w-7xl h-screen flex justify-center items-center ">
      
        <div className='text-center '>
       <img className='w-56 h-56  mx-auto' src={ErrorImg} alt='' />
     
        <p className='text-orange-600 font-bold'>404</p>
        <h1 className='font-black '>Uh oh! I think you're lost.</h1>
        <p className='font-medium mb-5'>It looks like the page you're looking for doesn't exist.</p>
        {currentUser && currentUser.admin ?  <Link to='/RTUApparel' className="rounded-md bg-black px-3.5 py-1.5 text-base font-medium leading-7 text-white shadow-sm hover:bg-orange-500 focus-visible:outline ">Go back home <span aria-hidden="true">→</span></Link> :
        <Link to='/' className="rounded-md bg-black px-3.5 py-1.5 text-base font-medium leading-7 text-white shadow-sm hover:bg-orange-500 focus-visible:outline ">Go back home <span aria-hidden="true">→</span></Link>}      
        </div>
        
    </div>
 
  )
}

export default Error