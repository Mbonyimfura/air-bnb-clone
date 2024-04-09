import axios from 'axios'
import React, { useState } from 'react'
import { Form, Link } from 'react-router-dom'
function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleNameInput = (e) =>{
        setName(e.target.value);
    }
    const handleEmailInput = (e) =>{
        setEmail(e.target.value)
    }
    const handlePasswordInput = (e) => {
        setPassword(e.target.value)
    }
    const handleRegisterUser = async(e) =>{
        e.preventDefault();

      try {
      await axios.post('/register',{
            name,
            email,
            password
           })
      alert('Registration successful. Now you can log in')
           setName('')
           setEmail('')
           setPassword('')
      } catch (error) {
       alert('Registration failed. Please try again later');
      }

    }
  return (
    <div className='mt-4 grow flex items-center justify-around'>
    <div className='mb-64'>
    <h1 className='text-4xl text-center  mb-4'>Register</h1>
     <form className='max-w-md mx-auto' onSubmit={handleRegisterUser}>
        <input type="text" placeholder='John Doe' value={name} onChange={handleNameInput}/>
         <input type="email" placeholder='your@gmail.com' value={email} onChange={handleEmailInput}/>
         <input type="password"  placeholder='password' value={password} onChange={handlePasswordInput}/>
    <button className='primary'>Register</button>
    <div className='text-center py-2 text-gray-500'>Already have an account? <Link className='underline text-black' to={'/login'}>Login now</Link></div>
     </form>
    </div>
 </div>
  ) 
}

export default Register