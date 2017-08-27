'use strict';

class MyForm {

  constructor(_form) {
    this.form = _form;
  }

  validate() {

    let formData = this.getData(),
        validate = {
          isValid : true,
          errorFields : []
        };

    if(!(formData.fio.split(' ').length === 3)) {
      validate.isValid = false;
      validate.errorFields.push('fio');
    }

    if(!/^[0-9a-z-\.]+\@(?:ya\.ru|yandex\.ru|yandex\.ua|yandex\.by|yandex\.kz|yandex\.com)$/i.test(formData.email)) {
      validate.isValid = false;
      validate.errorFields.push('email');
    }

    if(!/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/i.test(formData.phone)) {
      validate.isValid = false;
      validate.errorFields.push('phone');
    } else {
      let sumPhone = formData.phone.match(/[0-9]/g).reduce((sum, current) => {
        return +sum + +current;
      });
      if(sumPhone > 30) {
        validate.isValid = false;
        validate.errorFields.push('phone');
      }
    }

    return validate;
  }

  getData() {

    let inputList = this.form.querySelectorAll('input'),
        returnData = {};

    for(let i = 0; i < inputList.length; i++) {
      returnData[inputList[i].name] = inputList[i].value;
    }

    return returnData;
  }

  setData(inputData) {
    let fio = this.form.querySelector('input[name="fio"]'),
        email = this.form.querySelector('input[name="email"]'),
        phone = this.form.querySelector('input[name="phone"]');

    fio.value = inputData.fio;
    email.value = inputData.email;
    phone.value = inputData.phone;
  }

  submit() {

    let validate = this.validate(),
        inputList = this.form.querySelectorAll('input');


    [].forEach.call(inputList, function(elem) {
      elem.classList.remove('error');
    });

    if (!validate.isValid) {

      validate.errorFields.forEach((item) => {
        this.form.querySelector('input[name="' + item + '"]').classList.add('error');
      });

    } else {

      let url = this.form.getAttribute('action');

      let send = function sendRequst(_url) {
        fetch(_url)
          .then((response) => {

            if (response.status === 200) {
              return response.json();
            }

            throw new Error(response.statusText);

          }).then((data) => {
            let resultContainer = document.getElementById('resultContainer');
            switch (data.status) {
              case 'success':
                resultContainer.classList.add('success');
                resultContainer.innerHTML = 'Success';
                break;
              case 'error':
                resultContainer.classList.add('error');
                resultContainer.innerHTML = data.reason;
                break;
              case 'progress':
                resultContainer.classList.add('progress');
                setTimeout(() => {
                  sendRequst(_url);
                }, data.timeout);
                break;
              default:
                console.log('Неизвестный ответ');
            }
          }).catch((error) => {
            console.log(error);
          });
      }

      send(url);

    }

  }

}

document.addEventListener('DOMContentLoaded', () => {

  let myForm = new MyForm(document.getElementById('myForm')),
      submitButton = document.getElementById('submitButton');

      submitButton.addEventListener('click', (event) => {

        event.preventDefault();

        myForm.submit();

      });
});
