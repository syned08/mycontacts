const button = document.querySelector('.signin');
const passwordField = document.querySelector('.password');
const nameField = document.querySelector('.username');

const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/; // Как минимум 1 маленькая, 1 большая и 1 цифра. Длина от 6
const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{3,20}$/; // 2-20 символов, которыми могут быть буквы и цифры, первый символ обязательно буква

passwordField.addEventListener('input', () => {
  passwordField.classList.remove('wrong');
});

nameField.addEventListener('input', () => {
  nameField.classList.remove('wrong');
});

button.addEventListener('click', async (e) => {
  e.preventDefault();

  const nameField = document.querySelector('.username');
  const passwordField = document.querySelector('.password');
  const successMessage = document.querySelector('.login-card__success');
  const failedMessage = document.querySelector('.login-card__failed');

  successMessage.classList.add('hidden');
  failedMessage.classList.add('hidden');

  if (!regName.test(nameField.value)) {
    return nameField.classList.add('wrong');
  }

  if (!regPassword.test(passwordField.value)) {
    return passwordField.classList.add('wrong');
  }

  const data = {
    login: nameField.value,
    password: passwordField.value,
  };

  try {
    const answer = await fetch('/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    if (answer.status === 200) {
      successMessage.classList.remove('hidden');
    } else if (answer.status === 400) {
      failedMessage.classList.remove('hidden');
    }
  } catch (error) {
    console.log(error);
  }
});
