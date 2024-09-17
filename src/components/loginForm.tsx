import { useState } from 'react';

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;
    console.log("hello");

    const response = await fetch('/api/refresh-login', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result.success) {
      // Show refresh and change password UI
      document.getElementById('refresh-section')!.style.display = 'block';
    } else {
      setErrorMessage('Invalid password. Try again.');
    }
  };

  const handleRefresh = async () => {
    const response = await fetch('/api/refresh-login', {
      method: 'POST',
      body: JSON.stringify({ action: 'refresh' }),
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

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label htmlFor="password">Enter Password:</label>
        <input type="password" id="password" name="password" required />
        <button type="submit">Login</button>
        {errorMessage && <p>{errorMessage}</p>}
      </form>

      <div id="refresh-section" style={{ display: 'none' }}>
        <button onClick={handleRefresh}>Refresh</button>
        <form onSubmit={handlePasswordChange}>
          <label htmlFor="new-password">New Password:</label>
          <input
            type="password"
            id="new-password"
            name="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
