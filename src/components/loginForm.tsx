import { useState } from 'react';

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [password, setPassword] = useState(''); // Add state for password

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
      // Show refresh and change password UI
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
      body: JSON.stringify({ action: 'refresh', password }), // Include password in request
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
        <input
          type="password"
          id="password"
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)} // Update state on change
        />
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
