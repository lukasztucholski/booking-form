/* eslint-disable no-unused-vars */
/* eslint-disable no-case-declarations */
import { createHtmlElement } from './htmlConstructors.js'

function errorMessages(name, typeOfForm) {
  let errorTxt;
  switch (name) {
    case `${typeOfForm}__email`:
      errorTxt = 'Example: login@domain.com';
      break;
    case `${typeOfForm}__password`:
      errorTxt = 'Minimum password length is 2!';
      break;
    case `${typeOfForm}__rules`:
      errorTxt = 'Please, accepted rules';
      break;
    case `${typeOfForm}__name`:
      errorTxt = 'Only letters from polish alphabet';
      break;
    case `${typeOfForm}__surname`:
      errorTxt = 'Only letters from polish alphabet';
      break;
    case `${typeOfForm}__pesel`:
      errorTxt = 'Only positive numbers. Max length is 11';
      break;
    case `${typeOfForm}__phone`:
      errorTxt = 'Only positive numbers with country code and plus sign before';
      break;
    case `${typeOfForm}__birth`:
      errorTxt = 'DD.MM.YYYY';
      break;
    case `${typeOfForm}__street`:
      errorTxt = 'Only letters from polish alphabet, positive numbers and dash sign';
      break;
    case `${typeOfForm}__building`:
      errorTxt = 'Only positive numbers';
      break;
    case `${typeOfForm}__flat`:
      errorTxt = 'Only positive numbers';
      break;
    case `${typeOfForm}__postalcode`:
      errorTxt = 'Only positive numbers and dash sign beetwen. Exmaple: 00-00';
      break;
    case `${typeOfForm}__city`:
      errorTxt = 'Only letters from polish alphabet and dash sign';
      break;
    case `${typeOfForm}__state`:
      errorTxt = 'Only letters from polish alphabet and dash sign';
      break;
    case `${typeOfForm}__country`:
      errorTxt = 'Only letters from polish alphabet and dash sign';
      break;
  }
  return errorTxt
}

function regExpValidate(property, value) {
  let regExpResponse;
  switch (property) {
    case 'email':
      const emailReg = /^[0-9a-zA-Z_.-]+@[0-9a-zA-Z.-]+\.[a-zA-Z]{2,3}$/;
      regExpResponse = emailReg.test(value);
      break;
    case 'password':
      if (value.length > 2) {
        regExpResponse = true;
      } else { regExpResponse = false }
      break;
    case 'rulesAccepted':
      regExpResponse = value;
      break;
    case 'name':
      const nameReg = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]{2,}$/;
      regExpResponse = nameReg.test(value);
      break;
    case 'surname':
      const surnameReg = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ-]{2,}$/;
      regExpResponse = surnameReg.test(value);
      break;
    case 'pesel':
      const peselReg = /^[0-9]{11}$/;
      regExpResponse = peselReg.test(value);
      break;
    case 'phone':
      const phoneReg = /^\+[0-9]{11,}$/;
      regExpResponse = phoneReg.test(value);
      break;
    case 'birth':
      regExpResponse = true;
      break;
    case 'street':
      const streetReg = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9-\s]{2,}$/;
      regExpResponse = streetReg.test(value);
      break;
    case 'building':
      regExpResponse = true;
      break;
    case 'flat':
      regExpResponse = true;
      break;
    case 'postalcode':
      const postalcodeReg = /^[0-9]{2}-[0-9]{3}$/;
      regExpResponse = postalcodeReg.test(value);
      break;
    case 'city':
      const cityReg = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ-\s]{2,}$/;
      regExpResponse = cityReg.test(value);
      break;
    case 'state':
      const stateReg = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ-\s]{2,}$/;
      regExpResponse = stateReg.test(value);
      break;
    case 'country':
      const countryReg = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ-\s]{2,}$/;
      regExpResponse = countryReg.test(value);
      break;
    default:
      regExpResponse = true;
  }
  return regExpResponse
}

function validateInJS(formObject) {
  let countOfWrongContent = 0;

  for (let formFieldName in formObject) {
    let formField = formObject[formFieldName];
    let enteredValue;

    if (typeof formField != 'object') {
      let fieldValue = formField;
      formField = document.createElement('input');
      formField.value = fieldValue;
    }

    if (formField.type === 'checkbox') {
      enteredValue = formField.checked
    } else {
      enteredValue = formField.value;
    }

    let regExpResponse = regExpValidate(formFieldName, enteredValue);
    if (regExpResponse) {
      if (Array.prototype.some.call(formField.classList, classOfField => { return classOfField === 'error' })) {
        formField.classList.remove('error');
        formField.addEventListener('mouseover', (e) => { validateInJS_error(formField, e) }, false);
        formField.addEventListener('mouseout', (e) => { validateInJS_errorRemove(formField, e) }, false);
      }
    } else {
      formField.classList.add('error');
      formField.addEventListener('mouseover', (e) => { validateInJS_error(formField, e) }, false);
      formField.addEventListener('mouseout', (e) => { validateInJS_errorRemove(formField, e) }, false);
      countOfWrongContent++;
    }
  }
  return countOfWrongContent
}

function validateInJS_error(element, event) {
  const div = document.createElement('div');
  div.className = 'error-tip';
  element.parentNode.insertBefore(div, element);
  div.style.left = event.layerX + 3 + 'px';
  div.style.top = event.layerY + 3 + 'px';
  const exclamationMark = createHtmlElement.HtmlElement('p', 'error-tip__exclamation-mark', div, '❗️');
  const errorText = createHtmlElement.HtmlElement('p', 'error-tip__error-text', div, errorMessages(element.name, element.form.typeOfForm))
}

function validateInJS_errorRemove(element) {
  element.previousSibling.remove()
}

function validateInJS_BookingRequest(checkin, checkout, guests) {
  const todayDate = new Date().getTime() - 86400000;
  let status = true;
  if (checkin.valueAsNumber <= todayDate) {
    createHtmlElement.alertPopup('pastCheckInDate', checkin.parentNode);
    status = false;
  } else if (checkout.valueAsNumber <= todayDate) {
    createHtmlElement.alertPopup('pastCheckOutDate', checkin.parentNode);
    status = false;
  } else if (guests.value < 1) {
    createHtmlElement.alertPopup('noteEnoughGuests', checkin.parentNode);
    status = false;
  } else if (guests.value > 10) {
    createHtmlElement.alertPopup('tooMuchGuests', checkin.parentNode);
    status = false;
  }
  return status
}

export { validateInJS_BookingRequest, validateInJS }