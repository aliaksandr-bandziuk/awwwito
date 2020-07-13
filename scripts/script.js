'use strict';

// в этом массиве будем сохранять все объявления
// возвращаем массив после сеттера и JSON.stringify
// используем геттер
// распарсили то есть
//  написали|"| []" - если получим null, запишем пустой массив
const dataBase = JSON.parse(localStorage.getItem('awwito')) || [];

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
   modalBtnWarning = document.querySelector('.modal__btn-warning'),
   modalFileInput = document.querySelector('.modal__file-input'),
   modalFileBtn = document.querySelector('.modal__file-btn'),
   modalImageAdd = document.querySelector('.modal__image-add');

const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;
   

// получаем элементы формы "Подать объявление"
// добавляем spread (...)
// перебираем массив через filter
// elem - это каждый элемент массива
// возвращаем все элементы попапа, кроме кнопки
const elementsModalSubmit = [...modalSubmit.elements]
   .filter(elem => elem.tagName !== 'BUTTON');

// здесь будем хранить загруженные фото
const infoPhoto = {};

// создаем localStorage для хранения введенных данных
// (потому что сервака нет)
// потом будем вызывать при кнопке "отправить"
// используем сеттер
// переводим в строку через JSON, потому что браузер не видит данные
// без JSON было бы [Object object]
const saveDB = () => localStorage.setItem('awwito', JSON.stringify(dataBase));



// перебираем формы и проверяет, что они заполнены
const checkForm = () => {
      // every проверяет все элементы в массиве
      // если какое-то условие возвращает false, то вернет false
      // если значение пустое, то будет false
      // если заполнено, то будет true
      const validForm = elementsModalSubmit.every(elem => elem.value);
      // разблокируем кнопку, когда все поля заполнены
      modalBtnSubmit.disabled = !validForm;
      // убираем надпись "заполните все поля"
      modalBtnWarning.style.display = validForm ? 'none' : '';
};

// функция закрывает окна попап
const closeModal = event => {
   const target = event.target;

   // определяем, что кликнули на крестик
   if (target.closest('.modal__close') ||
      target.classList.contains('modal') ||
      event.code === 'Escape') {
         // закрываем любое из окон попап
         modalAdd.classList.add('hide');
         modalItem.classList.add('hide');
         // удаляем обработчик события клика на Esc
         // если не удалить, он будет срабатывать после закрытия окна
         document.removeEventListener('keydown', closeModal);
         modalSubmit.reset();
         // после закрытия очищаем фото
         modalImageAdd.src = srcModalImage;
         modalFileBtn.textContent = textFileBtn;
         checkForm();
      }
};

// так добавляем товары на страницу
// функция берет нашу базу данных, перебирает ее и формирует верстку
const renderCard = () => {
   catalog.textContent = '';

   dataBase.forEach((item, i) => {
      catalog.insertAdjacentHTML('beforeend', `
         <li class="card" data-id="${i}">
            <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
            <div class="card__description">
               <h3 class="card__header">${item.nameItem}</h3>
               <div class="card__price">${item.costItem} ₽</div>
            </div>
         </li>
      `);
   });
};

// сохраняем фото
modalFileInput.addEventListener('change', event => {
   
   const target = event.target;

   // эта функция при вызове возвращает объект
   // reader - асинхронно сможем прочитать файл
   // не как джпег, а считать как текст
   const reader = new FileReader();

   const file = target.files[0];

   infoPhoto.filename = file.name;
   infoPhoto.size = file.size;

   reader.readAsBinaryString(file);

   // после загрузки текст на кнопке добавления меняется
   reader.addEventListener('load', event => {

      if (infoPhoto.size < 200000) {
      modalFileBtn.textContent = infoPhoto.filename;
      // конвертируем кортинку в строку
      infoPhoto.base64 = btoa(event.target.result);
      // фото меняется при добавлении в объявлении
      modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
      } else {
         modalFileBtn.textContent = 'Залейте фото меньше 200 килобайт';
         modalFileInput.value = '';
         checkForm();
      }

      
   });
});


// на форму навешиваем событие
// разблокируем кнопку
// удаляем надпись "заполните все поля"
modalSubmit.addEventListener('input', checkForm);

// запрещаем перезагрузку при клике на "отправить"
modalSubmit.addEventListener('submit', event => {
   event.preventDefault();
   // в этот объект добавляем свойства и значения из name/value
   const itemObj = {};
   // перебираем каждый элемент в форме Подать объявление"
   for (const elem of elementsModalSubmit) {
         
      itemObj[elem.name] = elem.value;
   }
      // это для проверки
      // console.log(elem.name);
      // console.log(elem.value);
      // console.log(itemObj);
      
      itemObj.image = infoPhoto.base64;

      // полученные элементы сохраняем в массив dataBase
      dataBase.push(itemObj);
      // закрывается модальное окно после нажатия на "отправить"
      closeModal({target: modalAdd});
      // и очищаем форму
      // modalSubmit.reset();
      console.log(dataBase);
      // сохряняем введенные данные при клике на "отправить"
      saveDB();
      renderCard();
});

// открываем модальное окно
addAd.addEventListener('click', () => {
   modalAdd.classList.remove('hide');
   //тут же блокируем кнопку "отправить"
   modalBtnSubmit.disabled = true;
   // закрываем попап по клику на Esc
   document.addEventListener('keydown', closeModal);
});

catalog.addEventListener('click', event => {
   // устанавливаем цель клика в каталоге
   //картинка, заголовок, цена...
   const target = event.target;

   // если при клике добираемся до 'card'...
   if (target.closest('.card')) {
      // ...то убираем у модального окна класс 'hide'
      modalItem.classList.remove('hide');
      document.addEventListener('keydown', closeModal);
   }
});

// закрываем модальное окно первое
modalAdd.addEventListener('click', closeModal);
// закрываем модальное окно второе
modalItem.addEventListener('click', closeModal);

renderCard();