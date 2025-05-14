import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import moment from 'moment';
import { getRoomById, bookRoom } from '../utils/ApiFunctions';
import BookingSummary from './BookingSummary';

const BookingForm = () => {
  const [isValidated, setIsValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [roomPrice, setRoomPrice] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [booking, setBooking] = useState({
    guestName: "",
    guestEmail: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfAdults: 1,
    numberOfChildren: 0
  });

  const location = useLocation();
  const {roomId} = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
    setErrorMessage("");
  };

  const getRoomPriceById = async (roomId) => {
    try {
      const response = await getRoomById(roomId);
      setRoomPrice(response.roomPrice);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    if (roomId) {
      getRoomPriceById(roomId);
    }
  }, [roomId]);

  const calculatePayment = () => {
    if (!booking.checkInDate || !booking.checkOutDate) return 0;

    const checkIn = moment(booking.checkInDate);
    const checkOut = moment(booking.checkOutDate);

    if (!checkOut.isAfter(checkIn, 'day')) return 0;

    const nights = checkOut.diff(checkIn, 'days');
    return (roomPrice * nights);
  };

  const isGuestCountValid = () => {
    const adultCount = parseInt(booking.numberOfAdults);
    const childrenCount = parseInt(booking.numberOfChildren);
    const totalCount = adultCount + childrenCount;
    return totalCount >= 1 && adultCount >= 1;
  };

  const isCheckOutDateValid = () => {
    if (!booking.checkInDate || !booking.checkOutDate) return false;

    const checkInDate = moment(booking.checkInDate);
    const checkOutDate = moment(booking.checkOutDate);

    if (!checkOutDate.isSameOrAfter(checkInDate)) {
      setErrorMessage("La date de check-out doit être après la date de check-in!");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage("")

    if(!isGuestCountValid() || !isCheckOutDateValid()){
      setIsValidated(true)
      return ;
    }
    setIsSubmitted(true)
  }

  // Gère la réservation (confirmation et appel à la page de succès)
  const handleBooking = async () => {
    if (!roomId) {
    setErrorMessage("Aucune chambre sélectionnée");
    return;
    }
    if (!isGuestCountValid() || !isCheckOutDateValid()) {
      setErrorMessage("Vérifiez vos dates et le nombre de personnes.");
      return;
    }

    setIsLoading(true);

    try {
      // Effectuer la réservation
      const confirmationCode = await bookRoom(roomId, booking);
      setSuccessMessage(`Réservation confirmée! Code: ${confirmationCode}`);

      // Naviguer vers la page de succès après 3 secondes
      setTimeout(() => {
        navigate("/booking-success", {
          state: {
            confirmationCode,
            bookingDetails: booking,
            payment: calculatePayment(),
          },
        });
      }, 3000);
    } catch (error) {
      setErrorMessage(`Erreur de réservation: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Calcul du nombre de nuits réservées
  const numberOfNights = booking.checkInDate && booking.checkOutDate
    ? moment(booking.checkOutDate).diff(moment(booking.checkInDate), 'days')
    : 0;

  return (
    <div className='container mb-5'>
      <div className='row'>
        <div className='col-md-6'>
          <div className='card card-body mt-5'>
            <h4 className='card-title'>Réserver une chambre</h4>

            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}

            {errorMessage && (
              <div className="alert alert-danger">{errorMessage}</div>
            )}

            <Form noValidate validated={isValidated}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor='guestName'>Nom complet:</Form.Label>
                <Form.Control
                  required
                  type='text'
                  id='guestName'
                  name='guestName'
                  value={booking.guestName}
                  placeholder='Votre nom complet...'
                  onChange={handleInputChange}
                />
                <Form.Control.Feedback type='invalid'>
                  Veuillez entrer votre nom
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor='guestEmail'>Email:</Form.Label>
                <Form.Control
                  required
                  type='email'
                  id='guestEmail'
                  name='guestEmail'
                  value={booking.guestEmail}
                  placeholder='Votre email...'
                  onChange={handleInputChange}
                />
                <Form.Control.Feedback type='invalid'>
                  Veuillez entrer un email valide
                </Form.Control.Feedback>
              </Form.Group>

              <fieldset className="mb-3" style={{ border: "1px solid #dee2e6", padding: "15px", borderRadius: "5px" }}>
                <legend>Période de séjour</legend>
                <div className='row'>
                  <div className='col-6'>
                    <Form.Label htmlFor='checkInDate'>Arrivée:</Form.Label>
                    <Form.Control
                      required
                      type='date'
                      id='checkInDate'
                      name='checkInDate'
                      value={booking.checkInDate}
                      min={moment().format("YYYY-MM-DD")}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type='invalid'>
                      Sélectionnez une date d'arrivée
                    </Form.Control.Feedback>
                  </div>

                  <div className='col-6'>
                    <Form.Label htmlFor='checkOutDate'>Départ:</Form.Label>
                    <Form.Control
                      required
                      type='date'
                      id='checkOutDate'
                      name='checkOutDate'
                      value={booking.checkOutDate}
                      min={booking.checkInDate || moment().format("YYYY-MM-DD")}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type='invalid'>
                      Sélectionnez une date de départ
                    </Form.Control.Feedback>
                  </div>
                </div>
              </fieldset>

              <fieldset className="mb-3" style={{ border: "1px solid #dee2e6", padding: "15px", borderRadius: "5px" }}>
                <legend>Nombre de personnes</legend>
                <div className='row'>
                  <div className='col-6'>
                    <Form.Label htmlFor='numberOfAdults'>Adultes:</Form.Label>
                    <Form.Control
                      required
                      type='number'
                      id='numberOfAdults'
                      name='numberOfAdults'
                      min={1}
                      value={booking.numberOfAdults}
                      onChange={handleInputChange}
                    />
                    <Form.Control.Feedback type='invalid'>
                      Minimum 1 adulte
                    </Form.Control.Feedback>
                  </div>

                  <div className='col-6'>
                    <Form.Label htmlFor='numberOfChildren'>Enfants:</Form.Label>
                    <Form.Control
                      type='number'
                      id='numberOfChildren'
                      name='numberOfChildren'
                      min={0}
                      value={booking.numberOfChildren}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </fieldset>

              <div className='form-group mt-4 mb-2'>
                <button type="button" className="btn btn-primary w-100" onClick={isSubmitted ? handleBooking : handleSubmit}>
                  Confirmer la réservation
                </button>
              </div>
            </Form>
          </div>
        </div>

        <div className='col-md-6'>
          {isSubmitted && (
            <BookingSummary
              booking={booking}
              payment={calculatePayment()}
              onConfirm={handleBooking}
              onCancel={() => setIsSubmitted(false)}
              isFormValid={true}
              isLoading={isLoading}
              numberOfNights={numberOfNights}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
