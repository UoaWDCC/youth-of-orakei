import { useState } from 'react';
import './loginForm.css';
import RefreshSection from './RefreshSection';

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const enteredPassword = formData.get('password') as string;

    const response = await fetch('/api/refresh-login', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', password: enteredPassword }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result.success) {
      setPassword(enteredPassword); // Store the password after login
      setLoggedIn(true); // Hide login form and show "Logged in"
    } else {
      setErrorMessage('Invalid password. Try again.');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, formId: string) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const form = document.getElementById(formId) as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="w-dvw h-dvh flex justify-center items-center bg-[#C8E4AE]">
      <div className="flex flex-col">
        {!loggedIn ? (
          <form id="login-form" onSubmit={handleLogin} className="mb-2">
            <label htmlFor="password">Enter Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'login-form')}
              className="border rounded-lg mx-2 p-2"
            />
            <button type="submit" className="bg-[#294E03] px-3 py-1 rounded-full text-white font-semibold">
              Login
            </button>
            {errorMessage && <p>{errorMessage}</p>}
          </form>
        ) : (
          <RefreshSection
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            setErrorMessage={setErrorMessage}
            handleKeyDown={handleKeyDown}
            password={password}
          />
        )}
      </div>
    </div>
  );
};

export default LoginForm;
