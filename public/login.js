document.getElementById('login').addEventListener('click', async (e) => {
  e.preventDefault();
  let user = document.getElementById('user');
  let password = document.getElementById('password');

  try {
    await fetch(
      `${window.location.protocol}/token?user=${user.value}&password=${password.value}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    window.location.href = '/';
  } catch (error) {
    console.error(error);
  }
});
