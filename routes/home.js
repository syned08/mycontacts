const express = require('express');
const {
  renderHome,
  addContact,
  removeContact,
  getContact,
  editContact,
  getContactsWithField,
  getAllContacts,
} = require('../controllers/mainController');

const router = express.Router();

router.get('/:id', (req, res) => {
  try {
    renderHome(req, res);
  } catch (error) {
    console.log(error);
  }
});

router.post('/:id/add-contact', (req, res) => {
  try {
    addContact(req, res);
  } catch (error) {
    console.log(error);
  }
});

router.delete('/:id/remove-contact/:contactId', (req, res) => {
  try {
    removeContact(req, res);
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id/get-contact/:contactId', (req, res) => {
  try {
    getContact(req, res);
  } catch (error) {
    console.log(error);
  }
});

router.put('/:id/edit-contact/:contactId', (req, res) => {
  try {
    editContact(req, res);
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id/get-contacts-with-field/:fieldName/', (req, res) => {
  try {
    getContactsWithField(req, res);
  } catch (error) {
    console.log(error);
  }
});

router.get('/:id/get-all-contacts/', (req, res) => {
  try {
    getAllContacts(req, res);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
