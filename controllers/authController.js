const bcrypt = require('bcrypt');

module.exports.registerController = async (req, res) => {
  const { login, password } = req.body;
  const db = req.app.locals.db;
  const collection = db.collection('users');

  const userFound = await collection.findOne({ login });

  if (userFound) {
    return res.status(400).json({ message: 'Failed' });
  }

  const cryptedPassword = await bcrypt.hash(password, 10);
  const user = {
    login,
    password: cryptedPassword,
    created_ad: new Date(),
  };

  await collection.insertOne(user);

  res.status(200).json({ message: 'Success' });
};

module.exports.loginController = async (req, res) => {
  const { login, password } = req.body;
  const db = req.app.locals.db;
  const collection = db.collection('users');
  const user = await collection.findOne({ login });

  if (!user) {
    return res.status(400).json({ message: `No user with name '${login}' found` });
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (err) {
      return res.status(500).json({ message: 'Server error!' });
    }

    if (!result) {
      return res.status(400).json({ message: 'Wrong password!' });
    }

    res.json({ username: user.login, id: user._id });
  });
};
