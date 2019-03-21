/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { createHtmlElement, Form } from './htmlConstructors.js'
import { userSpaceContainer } from './index.js'
import { validateInJS } from './validate.js'

function clearContainer(domElement) {
  while (domElement.firstChild) {
    domElement.removeChild(domElement.firstChild);
  }
}

function NotLoggedPanel(container) {
  const classNameForPanel = 'user-space__not-logged';

  if (!document.querySelector(`${classNameForPanel}`)) {

    const notLoggedContainer = createHtmlElement.HtmlElement('article', classNameForPanel, container);
    const signInForm = new Form('sign-in', 'post', '#signin', notLoggedContainer);
    const signUpQuestion = createHtmlElement.HtmlElement('p', 'sign-up-question', notLoggedContainer, "Don't have account? ");
    const signUpLink = createHtmlElement.HtmlElement('span', 'sign-up-question-link', signUpQuestion, 'Sign Up!');

    signInForm.addEventListener('submit', function (e) {
      e.preventDefault();
      signIn(this.userToSignIn, this);
    });

    signUpLink.addEventListener('click', () => {
      const classNameForRegisterContainer = 'registration';

      if (!document.querySelector(`.${classNameForRegisterContainer}`)) {
        const containerForRegForm = createHtmlElement.HtmlElement('article', classNameForRegisterContainer, notLoggedContainer);
        const registrationForm = new Form('sign-up', 'post', '#register.php', containerForRegForm);

        registrationForm.addEventListener('reset', () => {
          containerForRegForm.remove();
        });
        registrationForm.addEventListener('submit', function (e) {
          e.preventDefault();
          signUp(this.getUserToRegister(), this);
        });
      }
    });
  }
}

function signIn(userObject, form) {
  const validateResult = validateInJS(userObject);

  if (validateResult === 0) {
    let email;
    let password;

    if (typeof userObject.email != 'object') {
      email = userObject.email;
    } else {
      email = userObject.email.value;
    }
    if (typeof userObject.password != 'object') {
      password = userObject.password;
    } else {
      password = userObject.password.value;
    }
    const xhr = new XMLHttpRequest;
    xhr.open('GET', 'http://lukasztucholski.pl/booking/backend.json', true);
    xhr.send();
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const database = JSON.parse(xhr.responseText);
        let userExist;
        database.users.forEach(user => {
          if (user.email === email) {
            userExist = true;
            if (password === user.password) {
              new UserPanel(user, userSpaceContainer);
            } else {
              createHtmlElement.alertPopup('wrongPass', form)
            }
          }
        });
        if (userExist != true) {
          createHtmlElement.alertPopup('userDoesNotExist', form)
        }
      } else {
        createHtmlElement.alertPopup('serverError', form);
        console.log(`database: ajax error, status nr ${xhr.status}`);
      }
    });
  } else {
    createHtmlElement.alertPopup('jsValidateError', form);
  }
}

function signUp(userToRegister, form) {
  const validateResult = validateInJS(userToRegister);

  if (validateResult === 0) {
    const xhr = new XMLHttpRequest;
    xhr.open('GET', 'http://lukasztucholski.pl/booking/backend.json', true);
    xhr.send();
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const database = JSON.parse(xhr.responseText);
        if (database.users.some(user => { return user.email === userToRegister.email.value })) {
          createHtmlElement.alertPopup('userExist', form);
        } else {
          const xhr2 = new XMLHttpRequest;
          xhr2.open('POST', './register.php', true);
          xhr2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          xhr2.addEventListener('load', () => {
            if (xhr2.status === 200) {
              createHtmlElement.alertPopup('signUpSuccess', form.parentNode);
              form.remove();
            } else {
              createHtmlElement.alertPopup('serverError', form);
              console.log(`database: ajax error, status nr ${xhr2.status}`);
            }
          })

          const userToSend = {
            id: database.users.length + 1
          };
          for (let input in userToRegister) {
            if (input != 'rulesAccepted') {
              if (input === 'birth') {
                userToSend[input] = userToRegister[input].valueAsNumber;
              } else {
                userToSend[input] = userToRegister[input].value;
              }
            }
          }
          xhr2.send('userToSignUp=' + JSON.stringify(userToSend));
        }
      } else {
        createHtmlElement.alertPopup('serverError', form);
        console.log(`database: ajax error, status nr ${xhr.status}`);
      }
    });
  } else {
    createHtmlElement.alertPopup('jsValidateError', form);
  }
}

function UserPanel(user, containerForPanel) {
  document.cookie = 'status=login; max-age=600';
  document.cookie = `user=${user.email}; max-age=600`;
  document.cookie = `pass=${user.password}; max-age=600`;
  clearContainer(containerForPanel);

  if (!user.name) { user.name = '' }
  if (!user.surname) { user.surname = '' }

  const userPanel = createHtmlElement.HtmlElement('article', 'user-panel', containerForPanel);
  const containterForChosenMenuOption = createHtmlElement.HtmlElement('article', 'user-panel__option');
  const title = createHtmlElement.Title('h3', 'user-panel-title', userPanel, `Hello ${user.name} ${user.surname}!`);
  const userPanelMenu = createHtmlElement.HtmlElement('article', 'user-panel__menu', userPanel);
  const showReservationLink = createHtmlElement.HtmlElement('li', 'user-panel__menu-link', userPanelMenu, 'Show your reservations');
  const manageAccountLink = createHtmlElement.HtmlElement('li', 'user-panel__menu-link', userPanelMenu, 'Manage your account');
  const logoutLink = createHtmlElement.HtmlElement('li', 'user-panel__menu-link', userPanelMenu, 'Logout');

  showReservationLink.addEventListener('click', () => showReservation(user, containterForChosenMenuOption, userPanel));
  manageAccountLink.addEventListener('click', () => createManageAccount(user, containterForChosenMenuOption, userPanel));
  logoutLink.addEventListener('click', () => logout(containerForPanel));
}

function showReservation(user, containerForOption, containerForPanel) {
  const xhr = new XMLHttpRequest;
  xhr.open('GET', 'http://lukasztucholski.pl/booking/backend.json', true);
  xhr.send();
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      const database = JSON.parse(xhr.responseText);
      const userReservations = [];
      database.reservedDates.forEach(obj => {
        if (obj.user === user.email) {
          userReservations.push(obj);
        }
      });
      if (userReservations.length > 0) {
        new ResevationList(userReservations, containerForOption, containerForPanel);
      } else {
        createHtmlElement.alertPopup('noReservations', containerForPanel);
      }
    } else {
      createHtmlElement.alertPopup('serverError', containerForPanel);
      console.log(`database: ajax error, status nr ${xhr.status}`);
    }
  })
}

function createManageAccount(user, containerForOption, containerForPanel) {
  containerForPanel.appendChild(containerForOption);
  clearContainer(containerForOption);
  const manageAccountDiv = createHtmlElement.HtmlElement('div', 'manage-account', containerForOption);
  const personalDataDiv = createHtmlElement.HtmlElement('div', 'test', manageAccountDiv);
  const title = createHtmlElement.Title('h3', 'personal-data-title', personalDataDiv, 'Your personal data:');
  const list = createHtmlElement.HtmlElement('ul', 'user-panel__option-personal-data-list', personalDataDiv);
  for (let property in user) {
    if ((property != 'password') && (property != 'id')) {
      let propertyToUpperCase = property.charAt(0).toUpperCase() + property.slice(1);
      let element = createHtmlElement.HtmlElement('li', 'personal-data-item', list);
      if (property === 'birth') {
        element.textContent = `${propertyToUpperCase}: ${new Date(user[property]).toLocaleDateString()}`;
      } else {
        element.textContent = `${propertyToUpperCase}: ${user[property]}`;
      }
    }
  }
  const changeSettingsDiv = createHtmlElement.HtmlElement('div', 'change-settings-div', manageAccountDiv);
  const editTitle = createHtmlElement.Title('h3', 'change-settings-title', changeSettingsDiv, 'Change account settings:');
  const settingsList = createHtmlElement.HtmlElement('ul', 'user-panel__option-settings-list', changeSettingsDiv);
  const changePasswordLink = createHtmlElement.HtmlElement('li', 'change-password-link', settingsList, 'Change password');
  const editPersonalDataLink = createHtmlElement.HtmlElement('li', 'edit-personal-data-link', settingsList, 'Edit personal data');
  const closeBtn = createHtmlElement.Button('button', 'close-btn', containerForOption, 'Close');

  closeBtn.addEventListener('click', () => { containerForOption.remove() });
  changePasswordLink.addEventListener('click', e => { changePassword(user, containerForOption, e) })
  editPersonalDataLink.addEventListener('click', e => { editPersonalData(user, containerForOption, e) })
}

function ResevationList(array, containerForOption, containerForPanel) {
  containerForPanel.appendChild(containerForOption);
  clearContainer(containerForOption);
  const title = createHtmlElement.Title('h3', 'reservations-list-title', containerForOption, 'Your reservations');
  const list = createHtmlElement.HtmlElement('ul', 'reserations-list', containerForOption);

  array.forEach(date => {
    let item = createHtmlElement.HtmlElement('li', 'reserations-item', list);
    let guestCount;
    if (date.guests > 1) {
      guestCount = 'guests';
    } else {
      guestCount = 'guest';
    }
    item.textContent = new Date(date.checkIn).toLocaleDateString() + ' - ' + new Date(date.checkOut).toLocaleDateString() + ' for ' + date.guests + ' ' + guestCount;
  });

  const closeBtn = createHtmlElement.Button('button', 'close-btn', containerForOption, 'Close');
  closeBtn.addEventListener('click', () => { containerForOption.remove() });
}

function editPersonalData(user, container, event) {
  if (!document.querySelector('.editing__form')) {
    const editPersonalDataForm = new Form('editing', 'post', '#edited', container, user);
    editPersonalDataForm.style.left = event.clientX + 'px';
    editPersonalDataForm.style.top = event.clientY + 'px';

    editPersonalDataForm.addEventListener('submit', function (e) {
      e.preventDefault();
      sendNewPersonalData(this.userToEdit, editPersonalDataForm)
    });
    editPersonalDataForm.addEventListener('reset', function () { this.remove(); })
  }
}

function sendNewPersonalData(userToEdit, form) {
  const validateResult = validateInJS(userToEdit);

  if (validateResult === 0) {
    const xhr2 = new XMLHttpRequest;
    xhr2.open('POST', './edit.php', true);
    xhr2.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr2.addEventListener('load', () => {
      if (xhr2.status === 200) {
        createHtmlElement.alertPopup('editUserSuccess', form);
      } else {
        createHtmlElement.alertPopup('serverError', form);
        console.log(`database: ajax error, status nr ${xhr2.status}`);
      }
    })
    const userToSend = {
      id: userToEdit.id,
      email: userToEdit.email,
      password: userToEdit.password
    };

    for (let input in userToEdit) {
      if (input != 'rulesAccepted') {
        userToSend[input] = userToEdit[input].valueAsNumber || userToEdit[input].value || userToEdit[input];
      }
    }
    xhr2.send('userToEdit=' + JSON.stringify(userToSend));
  } else {
    createHtmlElement.alertPopup('jsValidateError', form);
  }
}

function changePassword(user, container, event) {
  console.log('change password');
}

function logout(containerForPanel) {
  document.cookie = 'status=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  document.cookie = 'pass=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  clearContainer(containerForPanel);
  NotLoggedPanel(containerForPanel);
}

export { signIn, signUp, NotLoggedPanel }