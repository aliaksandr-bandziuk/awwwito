'use strict';

// получам модальное окно
const modalAdd = document.querySelector('.modal__add'),
   addAd = document.querySelector('.add__ad'),
   //получаем кнопку "отправить"
   modalBtnSubmit = document.querySelector('.modal__btn-submit'),
   //получаем форму
   modalSubmit = document.querySelector('.modal__submit');

   // открываем модальное окно
   addAd.addEventListener('click', () => {
      modalAdd.classList.remove('hide');
      //тут же блокируем кнопку "отправить"
      modalBtnSubmit.disabled = true;
   });

   modalAdd.addEventListener('click', event => {
      const target = event.target;

      // закрываем попап при клике на крестик
      // или при клике мимо попапа
      if (target.closest('.modal__close') ||
      target === modalAdd) {
         // для закрытия добавляем класс hide для скрытия
         modalAdd.classList.add('hide');
         //очищаем форму после закрытия
         modalSubmit.reset();
      }
   });