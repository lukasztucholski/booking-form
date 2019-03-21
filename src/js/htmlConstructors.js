/* eslint-disable no-unused-vars */
const createHtmlElement = {

  Input: function (type, name, nodeToAppendChild, placeholder) {
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.id = name;
    input.className = `input ${name}`;
    if (nodeToAppendChild) {
      nodeToAppendChild.appendChild(input);
    }
    if (type === 'number') {
      input.classList.add('num-input');
    }
    if (placeholder) {
      input.placeholder = placeholder;
    }
    return input
  },

  Button: function (type, name, nodeToAppendChild, textContent) {
    const btn = document.createElement('button');
    btn.type = type;
    btn.id = name;
    btn.className = `btn ${name}`;
    nodeToAppendChild.appendChild(btn);
    if (textContent) {
      btn.textContent = textContent;
    }
    return btn
  },

  InputLabel: function (input, nodeToAppendChild, textContent) {
    const label = document.createElement('label');
    label.setAttribute('for', input.id);
    nodeToAppendChild.appendChild(label);
    if (textContent) {
      label.textContent = textContent;
    }
    return label
  },

  Title: function (selector, className, nodeToAppendChild, textContent) {
    const title = document.createElement(`${selector}`);
    title.className = `${selector} ${className}`;
    nodeToAppendChild.appendChild(title);
    if (textContent) {
      title.textContent = textContent;
    }
    return title
  },

  HtmlElement: function (selector, className, nodeToAppendChild, textContent) {
    const htmlElement = document.createElement(`${selector}`)
    htmlElement.className = className;
    if (nodeToAppendChild) {
      nodeToAppendChild.appendChild(htmlElement);
    }
    if (textContent) {
      htmlElement.textContent = textContent;
    }
    return htmlElement
  },

  alertPopup: function (text, container) {
    let mark = '❗️';
    switch (text) {
      case 'wrongPass':
        text = 'Wrong password!'
        break;
      case 'userDoesNotExist':
        text = 'There is no user with this email address.';
        break;
      case 'serverError':
        text = 'Server error.';
        break;
      case 'jsValidateError':
        text = 'Entered data is incorrect or all required fields have not been filled out.';
        break;
      case 'userExist':
        text = 'There is already a user with this email address.';
        break;
      case 'signUpSuccess':
        text = 'Registration was successful. You can now sign in to your account.';
        mark = '✔️';
        break;
      case 'editUserSuccess':
        text = 'Editing your personal data has been successful.';
        mark = '✔️';
        break;
      case 'noReservations':
        text = "You don't have any reservations!";
        break;
      case 'pastCheckInDate':
        text = 'The check-in date must be a future date.';
        break;
      case 'pastCheckOutDate':
        text = 'The check-out date must be a future date.';
        break;
      case 'noteEnoughGuests':
        text = 'The number of guests must be greater or equal 1.';
        break;
      case 'tooMuchGuests':
        text = 'The maximum number of guests is 10.';
        break;
      case 'bookingCollision':
        text = 'Sorry, choosed date is in collision with another reservation.';
        break;
      case 'bookingQuestion':
        text = 'Are your sure to booking this choosen date?';
        mark = '❓';
        break;
      case 'reservationSuccess':
        text = 'Reservation succesful!';
        mark = '✔️';
        break;
      case 'userNotLogged':
        text = 'Please, Sigin in to your account to make reservation.';
        break;
      default:
        text = 'Unidentified Error.';
    }
    if (document.querySelector('.alert-section')) { document.querySelector('.alert-section').remove() }
    const alertSection = createHtmlElement.HtmlElement('section', 'alert-section', container)
    alertSection.style.top = container.offsetTop + container.clientHeight / 2 + 'px';
    const alertArticle = createHtmlElement.HtmlElement('article', 'alert', alertSection)
    const alertCloseIcon = createHtmlElement.HtmlElement('div', 'alert__close-icon', alertArticle)
    const alertCloseBar = createHtmlElement.HtmlElement('div', 'alert__close-icon-bar1', alertCloseIcon)
    const alertCloseBar2 = createHtmlElement.HtmlElement('div', 'alert__close-icon-bar2', alertCloseIcon)
    const alertMark = createHtmlElement.HtmlElement('p', 'alert__exclamation-mark', alertArticle, mark);
    const alertText = createHtmlElement.HtmlElement('p', 'alert__text', alertArticle, text)
    alertCloseIcon.addEventListener('click', () => alertSection.remove())
    return alertArticle
  }

};

function Form(typeOfForm, method, action, nodeToAppendChild, user) {

  const typesOfForms = {
    login: 'sign-in',
    registration: 'sign-up',
    editPersonalData: 'editing',
    changePassword: 'pass-change'
  }

  const form = document.createElement('form');
  form.action = action;
  form.method = method;
  form.id = `${typeOfForm}__form`;
  form.className = `${typeOfForm}__form`;
  form.name = `${typeOfForm}__form`;
  form.typeOfForm = typeOfForm;
  form.noValidate = true; // off default browser tooltips & validating

  if (typeOfForm === typesOfForms.registration) {
    form.titleForm = createHtmlElement.Title('h1', `${typeOfForm}__title`, form, 'REGISTER NEW ACCOUNT');
  }

  if ((typeOfForm === typesOfForms.login) || (typeOfForm === typesOfForms.registration)) {
    form.inputEmail = createHtmlElement.Input('email', `${typeOfForm}__email`, form, 'Your Email');
    form.inputPassword = createHtmlElement.Input('password', `${typeOfForm}__password`, form, 'Your Passsword');
  }

  if (typeOfForm === typesOfForms.login) {
    form.userToSignIn = new User(form.inputEmail, form.inputPassword)
    form.buttonSignIn = createHtmlElement.Button('submit', `${typeOfForm}__btn`, form, 'Sign In!')
  }

  if (typeOfForm === typesOfForms.registration) {
    form.divForInputOptionalData = createHtmlElement.HtmlElement('div', `${typeOfForm}__show-opt-data-div`, form);
    form.inputShowOptionalData = createHtmlElement.Input('checkbox', `${typeOfForm}__show-opt-data-input`, form.divForInputOptionalData);
    form.inputShowOptionalDataLabel = createHtmlElement.InputLabel(form.inputShowOptionalData, form.divForInputOptionalData, 'Show optional data');
    form.divForOptionalData = createHtmlElement.HtmlElement('div', `${typeOfForm}__optional-data`, form);
    form.divForOptionalData.classList.add('hide');
    form.inputShowOptionalData.addEventListener('click', function () {
      if (this.checked === true) {
        form.divForOptionalData.classList.remove('hide');
      } else if (this.checked === false) {
        form.divForOptionalData.classList.add('hide');
      }
    })
  }

  if ((typeOfForm === typesOfForms.registration) || (typeOfForm === typesOfForms.editPersonalData)) {
    let containerToAppendChild;

    if (typeOfForm === typesOfForms.registration) {
      containerToAppendChild = form.divForOptionalData;
    } else if (typeOfForm === typesOfForms.editPersonalData) {
      containerToAppendChild = form;
    }

    form.titleOfOptionalDataDiv = createHtmlElement.Title('h3', `${typeOfForm}__personal-title`, containerToAppendChild, 'Personal data:');
    form.inputName = createHtmlElement.Input('text', `${typeOfForm}__name`, containerToAppendChild, 'Your Name');
    form.inputSurname = createHtmlElement.Input('text', `${typeOfForm}__surname`, containerToAppendChild, 'Your Surname');
    form.inputPesel = createHtmlElement.Input('text', `${typeOfForm}__pesel`, containerToAppendChild, 'Your PESEL number');
    form.inputPhone = createHtmlElement.Input('text', `${typeOfForm}__phone`, containerToAppendChild, 'Your phone number');
    form.inputBirth = createHtmlElement.Input('date', `${typeOfForm}__birth`, containerToAppendChild, 'Your birth date');
    form.inputBirthLabel = createHtmlElement.InputLabel(form.inputBirth, containerToAppendChild, 'Your birth date')
    form.titleAdress = createHtmlElement.Title('h3', `${typeOfForm}__adress-title`, containerToAppendChild, 'Your adress:');
    form.inputStreet = createHtmlElement.Input('text', `${typeOfForm}__street`, containerToAppendChild, 'Street');
    form.divForBuilding = createHtmlElement.HtmlElement('div', `${typeOfForm}__building-div`, containerToAppendChild);
    form.inputBuilding = createHtmlElement.Input('number', `${typeOfForm}__building`, form.divForBuilding, '0');
    form.inputBuildingLabel = createHtmlElement.InputLabel(form.inputBuilding, form.divForBuilding, 'Building');
    form.divForFlat = createHtmlElement.HtmlElement('div', `${typeOfForm}__flat-div`, containerToAppendChild);
    form.inputFlat = createHtmlElement.Input('number', `${typeOfForm}__flat`, form.divForFlat, '0');
    form.inputFlatLabel = createHtmlElement.InputLabel(form.inputFlat, form.divForFlat, 'Flat');
    form.inputCity = createHtmlElement.Input('text', `${typeOfForm}__city`, containerToAppendChild, 'City');
    form.inputPostalCode = createHtmlElement.Input('text', `${typeOfForm}__postalcode`, containerToAppendChild, 'Postal/Zip Code');
    form.inputState = createHtmlElement.Input('text', `${typeOfForm}__state`, containerToAppendChild, 'State/Province');
    form.inputCountry = createHtmlElement.Input('text', `${typeOfForm}__country`, containerToAppendChild, 'Country');
  }

  if (typeOfForm === typesOfForms.registration) {
    form.divForRules = createHtmlElement.HtmlElement('div', `${typeOfForm}__rules-div`, form);
    form.inputRules = createHtmlElement.Input('checkbox', `${typeOfForm}__rules`, form.divForRules);
    form.inputRulesLabel = createHtmlElement.InputLabel(form.inputRules, form.divForRules, 'Accepted Rules');
    form.getUserToRegister = function () {
      if (form.inputShowOptionalData.checked === true) {
        form.userToRegister = {
          email: form.inputEmail,
          password: form.inputPassword,
          rulesAccepted: form.inputRules,
          name: form.inputName,
          surname: form.inputSurname,
          pesel: form.inputPesel,
          phone: form.inputPhone,
          birth: form.inputBirth,
          street: form.inputStreet,
          building: form.inputBuilding,
          flat: form.inputFlat,
          postalcode: form.inputPostalCode,
          city: form.inputCity,
          state: form.inputState,
          country: form.inputCountry
        }
      } else {
        form.userToRegister = {
          email: form.inputEmail,
          password: form.inputPassword,
          rulesAccepted: form.inputRules,
        }
      }
      return form.userToRegister
    }
  }

  if (typeOfForm === typesOfForms.editPersonalData) {
    form.inputName.value = user.name || '';
    form.inputSurname.value = user.surname || '';
    form.inputPesel.value = user.pesel || '';
    form.inputPhone.value = user.phone || '';
    form.inputBirth.valueAsNumber = user.birth;
    form.inputStreet.value = user.street || '';
    form.inputBuilding.value = user.building || '';
    form.inputFlat.value = user.flat || '';
    form.inputCity.value = user.city || '';
    form.inputPostalCode.value = user.postalcode || '';
    form.inputState.value = user.state || '';
    form.inputCountry.value = user.country || '';
    form.userToEdit = {
      id: user.id,
      email: user.email,
      password: user.password,
      name: form.inputName,
      surname: form.inputSurname,
      pesel: form.inputPesel,
      phone: form.inputPhone,
      birth: form.inputBirth,
      street: form.inputStreet,
      building: form.inputBuilding,
      flat: form.inputFlat,
      postalcode: form.inputPostalCode,
      city: form.inputCity,
      state: form.inputState,
      country: form.inputCountry
    }
  }

  if ((typeOfForm === typesOfForms.registration) || (typeOfForm === typesOfForms.editPersonalData)) {
    let txtContent;
    if (typeOfForm === typesOfForms.registration) { txtContent = 'Sign Up!' } else { txtContent = 'Send' }
    form.buttonSend = createHtmlElement.Button('submit', `${typeOfForm}__send-btn`, form, txtContent)
    form.buttonCancel = createHtmlElement.Button('reset', `${typeOfForm}__cancel-btn`, form, 'Cancel');
  }
  if (nodeToAppendChild) {
    nodeToAppendChild.appendChild(form);
  }
  return form
}

function User(email, password, rules, name, surname, pesel, phone, birth, street, building, flat, postalCode, city, state, country) {
  const user = {};
  if (email) {
    user.email = email;
  }
  if (password) {
    user.password = password;
  }
  if (rules) {
    user.rulesAccepted = rules;
  }
  if (name) {
    user.name = name;
  }
  if (surname) {
    user.surname = surname;
  }
  if (pesel) {
    user.pesel = pesel;
  }
  if (phone) {
    user.phone = phone;
  }
  if (birth) {
    user.birth = birth;
  }
  if (street) {
    user.street = street;
  }
  if (building) {
    user.building = building;
  }
  if (flat) {
    user.flat = flat;
  }
  if (postalCode) {
    user.postalcode = postalCode;
  }
  if (city) {
    user.city = city;
  }
  if (state) {
    user.state = state;
  }
  if (country) {
    user.country = country;
  }
  return user
}

export { createHtmlElement, Form }