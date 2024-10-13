import React, { useState, useEffect, useRef } from 'react';
import '../../styles/refresh.css';

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
    <div className="refresh-section">
      <p className="logged-in-message">Logged in</p>
      <form id="change-password-form" onSubmit={handlePasswordChange} className="change-password-form">
        <label htmlFor="new-password" className="password-label">New Password: (Optional)</label>
        <input
          type="password"
          id="new-password"
          name="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, 'change-password-form')}
          required
          className="password-input"
        />
        <button type="submit" className="change-password-button">
          Change Password
        </button>
        {passwordChanged && (
          <span className="password-changed-message">Password changed!</span>
        )}
      </form>
      <button
        onClick={handleRefresh}
        className="refresh-button"
        disabled={isRefreshing}
      >
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>
      {logs.length > 0 && (
        <div className="logs-container">
          <h3 className="logs-title">Refresh Logs:</h3>
          <ul className="logs-list">
            {logs.map((log, index) => (
              <li key={index} className="log-message">
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
