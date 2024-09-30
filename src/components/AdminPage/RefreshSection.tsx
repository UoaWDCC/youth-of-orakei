import { useState } from 'react';

interface RefreshSectionProps {
 
  setErrorMessage: (message: string) => void;
  password: string; // Receive the password from LoginForm
}

const RefreshSection = ({
  setErrorMessage,
  password, // Use the passed password
}: RefreshSectionProps) => {
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

 

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-bold mb-2">Logged in</p>
      <button onClick={handleRefresh} className="bg-[#294E03] px-3 py-1 rounded-full text-white font-semibold">
        Refresh
      </button>
    </div>
  );
};

export default RefreshSection;
