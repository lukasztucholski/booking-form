import { signIn, NotLoggedPanel } from './userSpaceService.js'
import { checkAvailability } from './bookingService.js'

const bookingForm = document.querySelector('#booking-form');
const userSpaceContainer = document.querySelector('.user-space');

const cookiesFunctions = {

  getCookies: function () {
    let cookies;
    if (document.cookie) {
      cookies = document.cookie.split(/; */);
    } else {
      cookies = false;
    }
    return cookies
  },

  checkLogin: function () {
    const cookies = this.getCookies();
    let loginStatus;
    if (cookies) {
      cookies.forEach(c => {
        if (/status=/.test(c)) {
          const statusCookie = c.split(/=/);
          if (statusCookie.includes('login')) {
            loginStatus = true;
          }
        }
      })
    }
    return loginStatus
  },

  getUser: function () {
    const loginStatus = this.checkLogin();
    let user = {};
    if (loginStatus === true) {
      const cookies = this.getCookies();
      cookies.forEach(c => {
        if (/user=/.test(c)) {
          const userCookie = c.split(/=/);
          user.email = userCookie[1];
        }
        if (/pass=/.test(c)) {
          const passCookie = c.split(/=/);
          user.password = passCookie[1]
        }
      });
      return user
    }
  }
}

const loginStatus = cookiesFunctions.checkLogin();
if (loginStatus === true) {
  const userToSignIn = cookiesFunctions.getUser();
  signIn(userToSignIn)
} else {
  NotLoggedPanel(userSpaceContainer);
}

bookingForm.addEventListener('submit', e => {
  e.preventDefault();
  const checkInDate = document.querySelector('#checkin');
  const checkOutDate = document.querySelector('#checkout');
  const guests = document.querySelector('#guests');
  checkAvailability(checkInDate, checkOutDate, guests);
});

export { userSpaceContainer, cookiesFunctions }