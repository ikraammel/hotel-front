import moment from 'moment'
import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

const BookingSummary = ({ 
  booking, 
  payment, 
  isFormValid, 
  onConfirm,
  isLoading,
  onCancel 
}) => {
  const checkInDate = moment(booking.checkInDate)
  const checkOutDate = moment(booking.checkOutDate)
  const numberOfDays = checkOutDate.diff(checkInDate, 'days')
  const isDatesValid = numberOfDays > 0

  return (
    <div className='card card-body mt-5'>
      <h4 className="mb-4">Récapitulatif de Réservation</h4>
      
      <div className="mb-3">
        <h5>Informations Client</h5>
        <p><strong>Nom Complet:</strong> {booking.guestName}</p>
        <p><strong>Email:</strong> {booking.guestEmail}</p>
      </div>
      
      <div className="mb-3">
        <h5>Détails du Séjour</h5>
        <p><strong>Arrivée:</strong> {checkInDate.format('DD MMM YYYY')}</p>
        <p><strong>Départ:</strong> {checkOutDate.format('DD MMM YYYY')}</p>
        <p><strong>Durée:</strong> {numberOfDays} nuit{numberOfDays !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="mb-3">
        <h5>Nombre de Personnes</h5>
        <p><strong>Adulte{booking.numberOfAdults > 1 ? 's' : ''}:</strong> {booking.numberOfAdults}</p>
        <p><strong>Enfant{booking.numberOfChildren !== 1 ? 's' : ''}:</strong> {booking.numberOfChildren}</p>
      </div>
      
      {isDatesValid ? (
        <>
          <div className="mb-4">
            <h5>Paiement</h5>
            <p className="h4"><strong>Total:</strong> {payment.toFixed(2)} DH</p>
          </div>
          
          {isFormValid && (
            <div className="d-grid gap-2">
              <Button 
                variant="success" 
                size="lg"
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span 
                      className="spinner-border spinner-border-sm me-2" 
                      role="status" 
                      aria-hidden="true"
                    />
                    Traitement en cours...
                  </>
                ) : (
                  "Confirmer la Réservation et Payer"
                )}
              </Button>
              
              <Button 
                variant="outline-secondary" 
                onClick={onCancel}
                disabled={isLoading}
              >
                Retour aux Modifications
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="alert alert-danger">
          La date de départ doit être après la date d'arrivée
        </div>
      )}
    </div>
  )
}

export default BookingSummary