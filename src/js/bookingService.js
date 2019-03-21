/* eslint-disable no-console */
import { validateInJS_BookingRequest } from './validate.js'
import { createHtmlElement } from './htmlConstructors.js'
import { cookiesFunctions } from './index.js'

function checkAvailability(checkin, checkout, guests) {
  const validateResponse = validateInJS_BookingRequest(checkin, checkout, guests);
  if (validateResponse === true) {
    const checkInDate = checkin.valueAsNumber;
    const checkOutDate = checkout.valueAsNumber;
    const guestsCount = guests.value;
    const whereToPopup = checkin.parentNode

    const xhr = new XMLHttpRequest;
    xhr.open('GET', 'http://lukasztucholski.pl/booking/backend.json', true);
    xhr.send();
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        let checkAvailabilityResposne = 0;
        const database = JSON.parse(xhr.responseText);
        database.reservedDates.forEach(obj => {
          if ((checkInDate >= obj.checkIn && checkInDate <= obj.checkOut && guestsCount == obj.guests) || (checkOutDate >= obj.checkIn && checkOutDate <= obj.checkOut && guestsCount == obj.guests)) {
            checkAvailabilityResposne++;
          }
        });
        if (checkAvailabilityResposne === 0) {
          const alert = createHtmlElement.alertPopup('bookingQuestion', whereToPopup);
          const acceptedBtn = createHtmlElement.Button('button', 'alert__accept-booking', alert, 'Yes!')

          acceptedBtn.addEventListener('click', () => addNewReservation(checkInDate, checkOutDate, guestsCount, whereToPopup, database.reservedDates.length))
        } else if (checkAvailabilityResposne > 0) {
          createHtmlElement.alertPopup('bookingCollision', whereToPopup)
        }
      } else {
        console.log(`database: ajax error, status nr ${xhr.status}`);
      }
    });
  } else {
    console.log('chack availability form validate js error')
  }
}

function addNewReservation(checkInDate, checkOutDate, guestsCount, whereToPopup, reservationLength) {
  const loginStatus = cookiesFunctions.checkLogin();

  if (loginStatus === true) {
    const user = cookiesFunctions.getUser();

    const xhr = new XMLHttpRequest;
    xhr.open('POST', './reservation.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        createHtmlElement.alertPopup('reservationSuccess', whereToPopup);
      } else {
        createHtmlElement.alertPopup('serverError', whereToPopup);
      }
    });

    const newReservation = {
      id: reservationLength + 1,
      user: user.email,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestsCount
    };

    xhr.send('reservation=' + JSON.stringify(newReservation));
  } else {
    createHtmlElement.alertPopup('userNotLogged', whereToPopup);
  }
}

export { checkAvailability }