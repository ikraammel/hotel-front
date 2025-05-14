import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../common/Header'

const BookingSuccess = () => {
    const location = useLocation()
    const confirmationCode = location.state?.confirmationCode
    const bookingDetails = location.state?.bookingDetails
    const payment = location.state?.payment

  return (
    <div className='container'>
      <Header title="Booking Success"/>
      <div className='mt-5'>
        {confirmationCode ? (
            <div>
                <h3 className='text-success'>Réservation réussie !</h3>
                <p className='text-success'>Code de confirmation: <strong>{confirmationCode}</strong></p>
                <p>Client: {bookingDetails?.guestName} ({bookingDetails?.guestEmail})</p> <br />
                Montant total : <strong>{payment} MAD</strong>
            </div>
        ):(
            <div>
                <h3 className='text-danger'>Error lors de la réservation. Veuillez réessayer.</h3>
                <p className='text-danger'>Aucun code de confirmation reçu.</p>
            </div>
        )}
      </div>
    </div>
  )
}

export default BookingSuccess
