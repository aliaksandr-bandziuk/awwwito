'use strict';

// в этом массиве будем сохранять все объявления
const dataBase = [];

// получам модальное окно
const modalAdd = document.querySelector('.modal__add'),
   // получаем кнопку "подать объявление"
   addAd = document.querySelector('.add__ad'),
   //получаем кнопку "отправить"
   modalBtnSubmit = document.querySelector('.modal__btn-submit'),
   //получаем форму
   modalSubmit = document.querySelector('.modal__submit'),
   // получаем список <ul></ul> c товарами
   catalog = document.querySelector('.catalog'),
   // получаем модальное окно товаров
   modalItem = document.querySelector('.modal__item'),
   // получаем надпись "заполните все поля"
   modalBtnWarning = document.querySelector('.modal__btn-warning');

// получаем элементы формы "Подать объявление"
// добавляем spread (...)
// перебираем массив через filter
// elem - это каждый элемент массива
// возвращаем все элементы попапа, кроме кнопки
const elementsModalSubmit = [...modalSubmit.elements]
   .filter(elem => elem.tagName !== 'BUTTON');

   const closeModal = function(event) {
      const target = event.target;
      // закрываем попапы при клике на крестик
      // или при клике мимо попапа
      // this - это объект, который вызвал событие
      // this в нашем случае - это modalAdd или modalItem
      if (target.closest('.modal__close') || target === this) {
         // для закрытия добавляем класс hide
         // равно как modalAdd.classList.add('hide')
         // и modalItem.classList.add('hide');
         this.classList.add('hide');
         
         if (this === modalAdd) {
            //очищаем форму после закрытия
         modalSubmit.reset();
         }
      }
   };

   // закрытие попапа по клику на Esc
   const closeModalEsc = event => {
      if (event.code === 'Escape') {
         modalAdd.classList.add('hide');
         modalItem.classList.add('hide');
         modalSubmit.reset();
         document.removeEventListener('keydown', closeModalEsc);
      }
   };

   // на форму навешиваем событие
   // разблокируем кнопку
   // удаляем надпись "заполните все поля"
   modalSubmit.addEventListener('input', () => {
      // every проверяет все элементы в массиве
      // если какое-то условие возвращает false, то вернет false
      // если значение пустое, то будет false
      // если заполнено, то будет true
      const validForm = elementsModalSubmit.every(elem => elem.value);
      // разблокируем кнопку, когда все поля заполнены
      modalBtnSubmit.disabled = !validForm;
      // убираем надпись "заполните все поля" при заполнении
      if (validForm) {
         modalBtnWarning.style.display = 'none';
      } else {
         modalBtnWarning.style.display = '';
      }
      
      // убираем надпись "заполните все поля" - короче
      // modalBtnWarning.style.display = validForm ? 'none' : '';

   });

   // запрещаем перезагрузку при клике на "отправить"
   modalSubmit.addEventListener('submit', event => {
      event.preventDefault();
      // в этот объект добавляем свойства и значения из name/value
      const itemObj = {};
      // перебираем каждый элемент в форме Подать объявление"
      for (const elem of elementsModalSubmit) {
         
         itemObj[elem.name] = elem.value;
         // это для проверки
         // console.log(elem.name);
         // console.log(elem.value);
         // console.log(itemObj);
         
         // полученные элементы сохраняем в массив dataBase
         dataBase.push(itemObj);
         // и очищаем форму
         modalSubmit.reset();
         console.log(dataBase);
         
      }
   });

   // открываем модальное окно
   addAd.addEventListener('click', () => {
      modalAdd.classList.remove('hide');
      //тут же блокируем кнопку "отправить"
      modalBtnSubmit.disabled = true;
      // закрываем попап по клику на Esc
      document.addEventListener('keydown', closeModalEsc);
   });

   // закрываем модальное окно первое
   modalAdd.addEventListener('click', closeModal);
   // закрываем модальное окно второе
   modalItem.addEventListener('click', closeModal);

   catalog.addEventListener('click', event =>{
      // устанавливаем цель клика в каталоге
      //картинка, заголовок, цена...
      const target = event.target;

      // если при клике добираемся до 'card'...
      if (target.closest('.card')) {
         // ...то убираем у модального окна класс 'hide'
         modalItem.classList.remove('hide');
         document.addEventListener('keydown', closeModalEsc);
      }
   });

   // закрываем модальное окно товаров
   // этот вариант мы засунули в this
   // modalItem.addEventListener('click', event => {
   //    const target = event.target;

   //    if (target.closest('.modal__close') ||
   //    target === modalItem) {
   //       modalItem.classList.add('hide');
   //    }
   // });

