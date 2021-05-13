const addContactBtn = document.querySelector('.add-contact');
const addForm = document.querySelector('.add-form_container');
const closeFormBtn = document.querySelector('.close-add-contact');
const submitFormBtn = document.querySelector('.submit-add-contact');
const addFieldBtn = document.querySelector('.add-field');
const successAdded = document.querySelector('.added-success_message');
const failedAdded = document.querySelector('.failed-success_message');
const id = localStorage.getItem('id');
const editForm = document.querySelector('.contact-edit__container');
let removedFields = {};
const sortingElem = document.querySelector('.sorting');
const contactList = document.querySelector('.contacts-list');

// add contact
addContactBtn.addEventListener('click', (e) => {
  e.preventDefault();

  successAdded.classList.add('hidden');
  failedAdded.classList.add('hidden');

  addForm.classList.remove('hidden');
});

closeFormBtn.addEventListener('click', async () => {
  const addedFields = document.querySelector('.added-fields');
  addForm.classList.add('hidden');

  const inputs = document.querySelectorAll('.add-form input');
  inputs.forEach((el) => (el.value = ''));
  addedFields.innerHTML = '';

  updateList();
});

submitFormBtn.addEventListener('click', async () => {
  try {
    const data = {};
    const inputsOld = document.querySelectorAll('.primary-fields .input-value');
    const inputsNew = document.querySelectorAll('.added-fields .input-value');

    inputsOld.forEach((el) => {
      data[el.children[0].getAttribute('for')] = el.children[1].value;
    });

    inputsNew.forEach((el) => {
      data[el.children[0].value] = el.children[1].value;
    });
    const answer = await fetch(`${id}/add-contact`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    if (answer.status === 200) {
      successAdded.classList.remove('hidden');
    } else {
      failedAdded.classList.remove('hidden');
    }
  } catch (error) {
    console.log(error);
  }
});

addFieldBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const html =
    '<div class="input-value"> <input type="text" class="added-field"> <input type="text" class="added-field"> </div>';
  const element = document.querySelector('.added-fields');

  element.insertAdjacentHTML('beforeend', html);
});

// card view
const dotsView = () => {
  const dots = document.querySelectorAll('.contact-card__options');
  const removeBtns = document.querySelectorAll('.remove');
  const contactInfoBtns = document.querySelectorAll('.contact-card__name');
  const fields = document.querySelector('.contact-info__container .fields');
  const closeInfo = document.querySelector('.close-info');
  const contactBlock = document.querySelector('.contact-info__container');
  const editBtns = document.querySelectorAll('.edit');
  const closeEditForm = document.querySelector('.close-edit');
  const submitEditForm = document.querySelector('.submit-edit-contact');
  const editSuccessMessage = document.querySelector('.edit-success_message');
  const editFailedMessage = document.querySelector('.edit-failed_message');

  dots.forEach((el) => {
    el.addEventListener('mouseenter', (e) => {
      e.target.children[1].classList.add('hidden');
      e.target.children[0].classList.remove('hidden-prop');
      e.target.children[2].classList.remove('hidden-prop');
    });

    el.addEventListener('mouseleave', (e) => {
      e.target.children[1].classList.remove('hidden');
      e.target.children[0].classList.add('hidden-prop');
      e.target.children[2].classList.add('hidden-prop');
    });
  });

  // remove contact
  removeBtns.forEach((el) => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      const answer = await fetch(`${id}/remove-contact/${e.target.parentNode.parentNode.id}`, {
        method: 'DELETE',
      });
      if (answer.status === 200) {
        updateList();
      }
    });
  });

  // contact info
  contactInfoBtns.forEach((el) => {
    el.addEventListener('click', async (e) => {
      const nameElem = document.querySelector('.contact-info__name');
      nameElem.innerHTML = e.target.innerHTML;
      contactBlock.children[0].id = e.target.parentNode.id;
      contactBlock.classList.remove('hidden');

      const response = await fetch(`/home/${id}/get-contact/${e.target.parentNode.id}`);
      const contactData = (await response.json()).contact;

      for (const [key, value] of Object.entries(contactData)) {
        if (key !== 'Имя') {
          const html = `<tr class="field"> <td class="key">${key}</td> <td class="value">${value}</td> </tr>`;
          fields.insertAdjacentHTML('beforeend', html);
        }
      }
    });
  });

  closeInfo.addEventListener('click', (e) => {
    contactBlock.classList.add('hidden');

    fields.innerHTML = '';
    contactBlock.id = '';

    const inputs = document.querySelectorAll('.add-form input');
    inputs.forEach((el) => (el.value = ''));
  });

  // edit contact
  editBtns.forEach((el) => {
    el.addEventListener('click', async (e) => {
      e.preventDefault();
      const editFormInner = document.querySelector('.contact-edit');
      const fieldsEdit = document.querySelector('.contact-edit__container .fields-edit');

      console.log('clicked OPEN EDIT');
      editForm.classList.remove('hidden');
      editFormInner.id = e.target.parentNode.parentNode.id;

      const response = await fetch(`/home/${id}/get-contact/${e.target.parentNode.parentNode.id}`);
      const contactData = (await response.json()).contact;

      for (const [key, value] of Object.entries(contactData)) {
        let html = '';
        if (key === 'Имя' || key === 'Телефон') {
          html = `<div class="field"> <input type="text" class="edit-key" value="${key}"> <input type="text" class="edit-value" value="${value}"> </div>`;
        } else {
          html = `<div class="field"> <input type="text" class="edit-key" value="${key}"> <input type="text" class="edit-value" value="${value}"> <span class="material-icons remove-edit-field">delete_outline</span> </div>`;
        }
        fieldsEdit.insertAdjacentHTML('beforeend', html);
      }

      const removeEditFieldBtns = document.querySelectorAll('.remove-edit-field');

      removeEditFieldBtns.forEach((el) => {
        el.addEventListener('click', (e) => {
          removedFields[e.target.parentNode.children[0].value] = '';

          e.target.parentNode.remove();
        });
      });
    });
  });

  closeEditForm.addEventListener('click', () => {
    editForm.classList.add('hidden');
    editForm.children[0].children[4].innerHTML = '';
    console.log('clicked CLOSE EDIT');
    updateList();
  });

  submitEditForm.addEventListener('click', async (e) => {
    const dataFields = document.querySelectorAll('.fields-edit .field');
    let data = {};

    dataFields.forEach((el) => {
      data[el.children[0].value] = el.children[1].value;
    });

    const response = await fetch(`/home/${id}/edit-contact/${e.target.parentNode.id}`, {
      method: 'PUT',
      body: JSON.stringify({ data, removedFields }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      editSuccessMessage.classList.remove('hidden');
    } else {
      editFailedMessage.classList.add('hidden');
    }

    removedFields = {};
  });
};

dotsView();

sortingElem.addEventListener('change', async (e) => {
  updateList();
});

const updateList = async (e) => {
  console.log('Ccalling GET ALL CONTACTS');
  const response = await fetch(`/home/${id}/get-contacts-with-field/${sortingElem.value}`);

  if (response.status === 200) {
    const data = await response.json();

    if (data.length > 0) {
      contactList.classList.remove('contact-list_empty');
    }

    contactList.innerHTML = '';

    data.dataMain.forEach((el) => {
      const html = `<div class="contact-card" id=${el._id}>
  <div class="contact-card__name">${el.Имя}</div>
  <div class="contact-card__options">
    <a href="" class="edit hidden-prop">Редактировать</a>
    <span class="material-icons dots">more_horiz</span>
    <a href="" class="remove hidden-prop">Удалить</a>
  </div>
</div>`;

      contactList.insertAdjacentHTML('beforeend', html);
    });

    renderContacts();
    updateFieldsList(data.fields);
  }
};

const renderContacts = () => {
  const contactBlock = document.querySelector('.contact-info__container');

  contactBlock.innerHTML = '';
  const contactHtml = `<div class="contact-info">
  <span class="material-icons close-info">highlight_off</span>
  <h3 class="contact-info__name">Имя пользователя</h3>
  <table class="fields">

  </table>
  <div class="contact-card__info">
    <a href="/" class="edit edit-info">Редактировать</a>
    <a href="/" class="remove remove-info">Удалить</a>
  </div>
</div>`;
  contactBlock.insertAdjacentHTML('beforeend', contactHtml);
  contactBlock.classList.add('hidden');

  editForm.innerHTML = '';
  const editHtml = `<div class="contact-edit">
  <span class="material-icons close-edit">highlight_off</span>
  <span class="material-icons submit-edit-contact">add_circle_outline</span>
  <p class="edit-success_message hidden">Контакт успешно обновлен!</p>
  <p class="edit-failed_message hidden">Не удалось обновить контакт!</p>
  <div class="fields-edit">
  </div>
</div>`;
  editForm.insertAdjacentHTML('beforeend', editHtml);

  dotsView();
};

const updateFieldsList = (fields) => {
  const lastValue = sortingElem.value;
  let isLastValue = sortingElem.value === 'Имя' ? true : false;

  sortingElem.innerHTML = '';

  if (lastValue === 'Имя') {
    sortingElem.insertAdjacentHTML('beforeend', '<option value="Имя" selected >Имя</option>');
  } else {
    sortingElem.insertAdjacentHTML('beforeend', '<option value="Имя" >Имя</option>');
  }

  fields.forEach((el) => {
    if (lastValue === el) {
      sortingElem.insertAdjacentHTML('beforeend', `<option value="${el}" selected >${el}</option>`);
      isLastValue = true;
    } else {
      sortingElem.insertAdjacentHTML('beforeend', `<option value="${el}">${el}</option>`);
    }
  });

  if (!isLastValue) {
    updateList();
  }
};
