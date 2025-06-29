import React from 'react'
import { Col, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const RoomCard = ({ room }) => {
  return (
    <Col key={room.id} className='mb-4' xs={12}>
      <Card style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card.Body className='d-flex flex-wrap align-items-center'>
          <div className='flex-shrink-0 mr-3 mb-3 mb-md-0'>
            <Link to={`/book-room/${room.id}`} className='btn btn-hotel btn-sm'>
              {room.photo ? (
                <Card.Img
                  variant='top'
                  src={`data:image/jpeg;base64,${room.photo}`}
                  alt='Room Photo'
                  style={{ width: "180px", height: "120px", objectFit: 'cover' }}
                />
              ) : (
                <Card.Img
                  variant='top'
                  src="/default-room-image.jpg" 
                  alt='Default Room Photo'
                  style={{ width: "180px", height: "120px", objectFit: 'cover' }}
                />
              )}
            </Link>
          </div>
          <div className='flex-grow-1 ml-3 px-3 px-md-4' style={{ minWidth: '250px' }}>
            <Card.Title className='hotel-color' style={{ fontSize: '1.25rem' }}>{room.roomType}</Card.Title>
            <Card.Title className='room-price' style={{ fontSize: '1.1rem' }}>{room.roomPrice} DH / night</Card.Title>
            <Card.Text className='text-muted' style={{ fontSize: '0.9rem' }}>Some room info goes here...</Card.Text>
          </div>
          <div className='flex-shrink-0 mt-3'>
            <Link to={`/book-room/${room.id}`} className='btn btn-hotel btn-sm'>
              Book Now
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default RoomCard