const { ObjectId } = require('mongodb');

module.exports.renderHome = async (req, res) => {
  const db = req.app.locals.db;
  const collection = db.collection('contacts');
  const id = req.params.id;

  const contacts = await collection.find({ userId: new ObjectId(id) }).toArray();

  const fields = [];
  contacts.forEach((el) => {
    Object.keys(el).forEach((value) => {
      if (fields.indexOf(value) === -1 && value !== 'Имя' && value !== '_id' && value !== 'userId') {
        fields.push(value);
      }
    });
  });
  res.render('home', { contacts, fields });
};

module.exports.addContact = async (req, res) => {
  const db = req.app.locals.db;
  const collection = db.collection('contacts');
  const id = req.params.id;
  const data = req.body;
  data.userId = new ObjectId(id);

  collection.insertOne(data, (err, resp) => {
    if (err) {
      return res.json(400, { message: err });
    }

    return res.json({ message: 'success' });
  });
};

module.exports.getContactsWithField = async (req, res) => {
  const db = req.app.locals.db;
  const collection = db.collection('contacts');
  const { id, fieldName } = req.params;
  const dataMain = await collection.find({ userId: new ObjectId(id), [fieldName]: { $exists: true } }).toArray();
  const contacts = await collection.find({ userId: new ObjectId(id) }).toArray();
  const fields = [];

  contacts.forEach((el) => {
    Object.keys(el).forEach((value) => {
      if (fields.indexOf(value) === -1 && value !== 'Имя' && value !== '_id' && value !== 'userId') {
        fields.push(value);
      }
    });
  });

  res.json({ dataMain, fields });
};

module.exports.removeContact = async (req, res) => {
  const db = req.app.locals.db;
  const collection = db.collection('contacts');
  const { id, contactId } = req.params;
  collection.deleteOne({ _id: new ObjectId(contactId), userId: new ObjectId(id) }, (err, resp) => {
    if (err) {
      return res.json(400, { message: err });
    }
    return res.json({ message: 'success' });
  });
};

module.exports.getContact = async (req, res) => {
  const db = req.app.locals.db;
  const collection = db.collection('contacts');
  const { id, contactId } = req.params;
  const contact = await collection.findOne(
    { userId: new ObjectId(id), _id: new ObjectId(contactId) },
    {
      projection: {
        _id: false,
        userId: false,
      },
    },
  );

  res.json({ contact });
};

module.exports.editContact = async (req, res) => {
  const db = req.app.locals.db;
  const collection = db.collection('contacts');
  const { id, contactId } = req.params;
  const { data, removedFields } = req.body;
  let contact;

  if (Object.keys(removedFields).length === 0) {
    contact = await collection.update({ userId: new ObjectId(id), _id: new ObjectId(contactId) }, { $set: data });
  } else {
    contact = await collection.update(
      { userId: new ObjectId(id), _id: new ObjectId(contactId) },
      { $set: data, $unset: removedFields },
    );
  }

  if (contact) {
    res.json({ message: 'success' });
  } else {
    res.status(400).json({ message: 'failed' });
  }
};

module.exports.getAllContacts = async (req, res) => {
  const db = req.app.locals.db;
  const collection = db.collection('contacts');
  const { id } = req.params;

  const contacts = await collection.find({ userId: new ObjectId(id) }).toArray();

  if (contacts) {
    res.json(contacts);
  } else {
    res.status(400).json({ message: 'failed' });
  }
};
