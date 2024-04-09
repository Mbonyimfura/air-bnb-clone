import React, { useContext, useState } from 'react'
import { UserContext } from '../store/UserContext'
import { Navigate, Link, useParams } from 'react-router-dom'
import axios from 'axios'
import AccountNav from '../Components/AccountNav'
import PlacePage from './PlacePage'

function ProfilePage() {
  const {ready,user, setUser} = useContext(UserContext)
  const [redirect,setRedirect]= useState(null)
  let {subpage} = useParams()
  if (subpage === undefined) {
    subpage = 'profile';
  }

  const logout = async() => {
    await axios.post('/logout')
    setUser(null)
    setRedirect('/')
  }
  if(!ready) {
    return 'Loading...';  
  }
  if (ready && !user && !redirect) { 
    return <Navigate to={'/login'}/> 
  }
 
 if (redirect) {
  return <Navigate to={redirect}/>
 }
  return (
    <div> 
    <AccountNav/>
    {subpage === 'profile' && ( 
      <div className='text-center max-w-lg mx-auto'>
        Logged in as {user.name} ({user.email}) <br />
        <button onClick={logout} className='primary max-w-sm mt-2'>Logout</button>
      </div>
    )}
    { subpage ==='places' && (<PlacePage/>)}
    </div>
  )
}

export default ProfilePage