import React from 'react'
import Main from '../layout/Main'
import HotelService from '../common/HotelService'
import Parallax from '../common/Parallax'
import RoomCarousel from '../common/RoomCarousel'

const Home = () => {
  return (
    <section>
      <Main/>
      <section className='container'>
        <RoomCarousel/>
        <Parallax/>
        <RoomCarousel/>
        <HotelService/>
        <Parallax/>
        <RoomCarousel/>
      </section>
    </section>
  )
}

export default Home
