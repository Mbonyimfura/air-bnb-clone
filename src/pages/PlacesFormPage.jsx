import React, {useEffect, useState} from 'react'
import Perks from '../Components/Perks'
import PhotoUploader from '../Components/PhotoUploader'
import AccountNav from '../Components/AccountNav'
import { Navigate, useParams } from 'react-router-dom'
import axios from 'axios'
function PlacesFormPage() {
  const {id} = useParams();
    const [title, setTitle]= useState('')
    const [address, setAddress] = useState('')
    const [addedPhotos,setAddedPhotos] = useState([])
    const [description, setDescription] = useState('')
    const [perks, setPerks] = useState([])
    const [extraInfo, setExtraInfo] = useState('')
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [maxGuests, setMaxGuests] = useState('')
    const [price, setPrice] = useState(100)
    const [redirect, setRedirect] =  useState (null)

    useEffect(() => {
      if (!id) {
        return;
      }
      axios.get('/places/'+id).then(response => {
        const {data} = response;
        setTitle(data.title);
        setAddress(data.address)
        setAddedPhotos(data.addedPhotos)
        setDescription(data.description)
        setPerks(data.perks)
        setExtraInfo(data.extraInfo)
        setCheckIn(data.checkIn)
        setCheckOut(data.checkOut)
        setMaxGuests(data.maxGuests)
      })
    },[id])

    function inputHeader(text) {
        return(
          <h2 className='text-2xl mt-4'>{text}</h2>
        )
      }
  function inputDescription(text) {
    return(
      <p className='text-gray-500 text-sm'>{text}</p>
    )
  }
  function preInput (header, description){
    return(
      <>
      {inputHeader(header)}
      {inputDescription(description)}
      </>
    )
  }
  async function savePlace (e) {
    e.preventDefault();
 const placeData = {
    title,address,addedPhotos,
      description,perks,extraInfo,
      checkIn,checkOut,maxGuests,price
 }

    if ( id) {
 await axios.patch('/places', {
      id, ...placeData
    })
      setRedirect(true)
    }else {
 await axios.post('/places', placeData )
  setRedirect(true)
    }
  
  }
  if (redirect){
   return <Navigate to={'/account/places'}/>
  }

  return (
    <div>
        <AccountNav/>
    <form  onSubmit={savePlace}>
   {preInput('Title', 'Title must small and catchy for advertisement')}
       <p className='text-gray-500 text-sm'></p>
     <input type="text" placeholder='title, for example my lovely apartment' value={title} onChange={e => setTitle(e.target.value)}/>  
     {preInput('Adress', 'Adrdress to this place ')}
  <input type="text" placeholder='address' value={address} onChange={e => setAddress(e.target.value)}/>
  {preInput('Photos', 'more = better')}
  <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
  {preInput('Description', 'Description of the place')}
  <textarea value={description} onChange={e => setDescription(e.target.value)}/>
  {preInput('Perks', 'Select all perks of your choice')}
  <div className='grid mt-2 grid-cols-2 md:grid-cols-3 gap-2 lg:grid-cols-6'>
 <Perks selected={perks} onChange={setPerks}/>
  </div>
  {preInput('Extra info', ' house rules, etc')}
  <textarea value={extraInfo} onChange={e => setExtraInfo(e.target.value)}/>
  {preInput('Check in&out times', 'Add checkin and out times and remember to have sometime window for cleaning the room between  guests')}
  <div className='grid gap-2 grid-cols-2 md:grid-cols-4'>
  <div>
 <h3 className='mt-2 -mb-1'>Check in time</h3>
    <input type="text" placeholder='14' value={checkIn} onChange={e => setCheckIn(e.target.value)}/>
    </div>
  <div> 
   <h3 className='mt-2 -mb-1'>Check out times</h3>
   <input type="text" placeholder='11' value={checkOut} onChange={e => setCheckOut(e.target.value)}/></div>
  <div>
   <h3 className='mt-2 -mb-1'>
     Max number of guests 
     </h3> 
     <input type="number" value={maxGuests} onChange={e => setMaxGuests(e.target.value)}/></div>
     <div>
 <h3 className='mt-2 -mb-1'>Price per night</h3>
    <input type="text" placeholder='100' value={price} onChange={e => setPrice(e.target.value)}/>
    </div>
  </div>
 
  <button className='primary my-4'>Save</button>
   </form>
  </div>
  )
}

export default PlacesFormPage