import { useState } from 'react';

interface RefreshSectionProps {
  newPassword: string;
  setNewPassword: (value: string) => void;
  setErrorMessage: (message: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, formId: string) => void;
  password: string; // Receive the password from LoginForm
}

const RefreshSection = ({
  newPassword,
  setNewPassword,
  setErrorMessage,
  handleKeyDown,
  password, // Use the passed password
}: RefreshSectionProps) => {
  const [passwordChanged, setPasswordChanged] = useState(false); // State for password changed message

  const handleRefresh = async () => {
    const response = await fetch('/api/refresh-login', {
      method: 'POST',
      body: JSON.stringify({ action: 'refresh', password }), // Send stored password
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
      body: JSON.stringify({ action: 'change-password', password, newPassword }), // Send both the stored password and the new password
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result.success) {
      setErrorMessage('Password updated successfully.');
      setNewPassword('');
      setPasswordChanged(true); // Set password changed state to true
      setTimeout(() => setPasswordChanged(false), 3000); // Reset message after 3 seconds
    } else {
      setErrorMessage('Failed to update password. Try again.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-bold mb-2">Logged in</p>
      <form id="change-password-form" onSubmit={handlePasswordChange} className="flex items-center mb-2">
        <label htmlFor="new-password" className="mr-2 font-semibold">New Password:</label>
        <input
          type="password"
          id="new-password"
          name="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'change-password-form')}
          required
          className="border rounded-lg mx-2 p-2 flex-grow"
        />
        <button type="submit" className="bg-[#294E03] px-3 py-1 rounded-full text-white font-semibold">
          Change Password
        </button>
        {passwordChanged && (
          <span className="text-green-600 mx-2 font-bold">Password changed!</span>
        )}
      </form>
      <button onClick={handleRefresh} className="bg-[#294E03] px-3 py-1 rounded-full text-white font-semibold">
        Refresh
      </button>
    </div>
  );
};

export default RefreshSection;
