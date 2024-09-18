import { useState } from 'react';
import "./loginForm.css"

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;

    const response = await fetch('/api/refresh-login', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result.success) {
      document.getElementById('refresh-section')!.style.display = 'block';
    } else {
      setErrorMessage('Invalid password. Try again.');
    }
  };

  const handleRefresh = async () => {
    if (!password) {
      setErrorMessage('Password is required to refresh.');
      return;
    }

    const response = await fetch('/api/refresh-login', {
      method: 'POST',
      body: JSON.stringify({ action: 'refresh', password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result.success) {
      window.location.href = '/';
    } else {
      setErrorMessage('Failed to refresh. Try again.');
    }
  };

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('/api/refresh-login', {
      method: 'POST',
      body: JSON.stringify({ action: 'change-password', newPassword }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result.success) {
      setErrorMessage('Password updated successfully.');
      setNewPassword('');
    } else {
      setErrorMessage('Failed to update password. Try again.');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, formId: string) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      // Trigger form submission based on focused input field
      const form = document.getElementById(formId) as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className='w-dvw h-dvh flex justify-center items-center bg-[#C8E4AE]'>
      <div className='flex flex-col'>
        <form id="login-form" onSubmit={handleLogin} className='mb-2'>
          <label htmlFor="password">Enter Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'login-form')} // Handle Enter key
            className='border rounded-lg mx-2 p-2'
          />
          <button type="submit" className='bg-[#294E03] px-3 py-1 rounded-full text-white font-semibold'>Login</button>
          {errorMessage && <p>{errorMessage}</p>}
        </form>

        <div id="refresh-section" style={{ display: 'none' }}>
          <form id="change-password-form" onSubmit={handlePasswordChange}>
            <label htmlFor="new-password">New Password:</label>
            <input
              type="password"
              id="new-password"
              name="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'change-password-form')} // Handle Enter key
              required
              className='border rounded-lg mx-2 p-2'
            />
            <button type="submit" className='bg-[#294E03] px-3 py-1 rounded-full text-white font-semibold'>Change Password</button>
          </form>
          <button onClick={handleRefresh} className='bg-[#294E03] px-3 py-1 rounded-full text-white font-semibold'>Refresh</button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
