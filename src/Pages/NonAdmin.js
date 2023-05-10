import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import rtulogo from '../Assets/webp-img/rtu-logo.webp'
import { useAuth } from '../Functions/authContext'

const NonAdmin  = () => {

  const {logOut} = useAuth()
  const navigate = useNavigate()

  const handleLogOut = async () => {
    try{
      logOut()
      window.location.href = 'https://rtu-apparel.web.app/';
    }catch(error){
      console.log(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl h-screen flex justify-center items-center">
      
    <div className='text-center'>

    <div className='flex justify-center'>
    <img src={rtulogo} alt='' className='w-56' />
    </div>
 
    <p className='text-orange-600 font-bold'>404</p>
    <h1 className='font-black text-3xl mb-5 '>Uh oh! I think you're lost.</h1>
    <div className='font-medium text-center text-sm mx-5 mb-10'>
    <p >I'm sorry, but access to this page is restricted.</p>
    <p>For any inquiries, please feel free to email us at <span className='text-orange-500'>rtustore@gmail.com.</span></p>
    <p>To purchase RTU merchandise, please visit RTU Apparel's website.</p>
    </div>
    <button onClick={handleLogOut} className="rounded-md bg-black px-3.5 py-1.5 text-sm font-medium leading-7 font-fontMain tracking-widest text-white shadow-sm hover:opacity-80 focus-visible:outline uppercase ">RTU Apparel <span aria-hidden="true">→</span></button>

    {/* <Link to='https://rtu-apparel.web.app/' className="rounded-md bg-black px-3.5 py-1.5 text-sm font-medium leading-7 font-fontMain tracking-widest text-white shadow-sm hover:opacity-80 focus-visible:outline uppercase ">RTU Apparel <span aria-hidden="true">→</span></Link> */}
  
    </div>
</div>
  )
}

export default NonAdmin