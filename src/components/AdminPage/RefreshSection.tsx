import React, { useState, useEffect, useRef } from 'react';

interface RefreshSectionProps {
  newPassword: string;
  setNewPassword: (value: string) => void;
  setErrorMessage: (message: string) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, formId: string) => void;
  password: string;
}

interface LogMessage {
  message: string;
  timestamp: number;
}

const RefreshSection: React.FC<RefreshSectionProps> = ({
  newPassword,
  setNewPassword,
  setErrorMessage,
  handleKeyDown,
  password,
}) => {
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLogs([]);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/refresh-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'refresh', password }),
        signal: abortControllerRef.current.signal,
      });

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const messages = chunk.split('\n\n');
        messages.forEach((message) => {
          if (message.startsWith('data: ')) {
            try {
              const logMessage = JSON.parse(message.slice(6));
              setLogs((prevLogs) => [...prevLogs, logMessage]);
            } catch (error) {
              console.error('Error parsing log message:', error);
            }
          }
        });
      }

      setIsRefreshing(false);
      window.location.href = '/';
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Error during refresh:', error);
        setErrorMessage('Failed to refresh. Try again.');
      }
      setIsRefreshing(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('/api/refresh-login', {
      method: 'POST',
      body: JSON.stringify({ action: 'change-password', password, newPassword }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();
    if (result.success) {
      setErrorMessage('Password updated successfully.');
      setNewPassword('');
      setPasswordChanged(true);
      setTimeout(() => setPasswordChanged(false), 3000);
    } else {
      setErrorMessage('Failed to update password. Try again.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-xl font-bold mb-2">Logged in</p>
      <form id="change-password-form" onSubmit={handlePasswordChange} className="flex items-center mb-2">
        <label htmlFor="new-password" className="mr-2 font-semibold">New Password: (Optional)</label>
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
      <button
        onClick={handleRefresh}
        className="bg-[#294E03] px-3 py-1 rounded-full text-white font-semibold"
        disabled={isRefreshing}
      >
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
      {logs.length > 0 && (
        <div className="mt-4 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-2">Refresh Logs:</h3>
          <ul className="list-disc pl-5 space-y-1 max-h-40 overflow-y-auto bg-gray-100 p-2 rounded">
            {logs.map((log, index) => (
              <li key={index} className="text-sm">
                {new Date(log.timestamp).toLocaleTimeString()}: {log.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RefreshSection;