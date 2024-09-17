import { useState } from 'react';

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState('');


  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 
    const formData = new FormData(event.currentTarget); 
    const password = formData.get('password') as string;
    console.log("hello")
    const response = await fetch('/api/refresh-login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result.success) {
      window.location.href = '/'; 
    } else {
      setErrorMessage('Invalid password. Try again.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label htmlFor="password">Enter Password:</label>
      <input type="password" id="password" name="password" required />
      <button type="submit">Login</button>
      {errorMessage && <p>{errorMessage}</p>}
    </form>
  );
};

export default LoginForm;
