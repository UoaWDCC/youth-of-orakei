import React, { useState, useEffect, useRef } from "react";

interface RefreshSectionProps {
  newPassword: string;
  setNewPassword: (value: string) => void;
  setErrorMessage: (message: string) => void;
  handleKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>,
    formId: string
  ) => void;
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

  const handleRefresh = async (endpoint: string) => {
    setIsRefreshing(true);
    setLogs([]);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to get response reader");

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          setIsRefreshing(false);
          break;
        }

        const chunk = new TextDecoder().decode(value);
        const messages = chunk.split("\n\n");

        for (const message of messages) {
          if (message.startsWith("data: ")) {
            try {
              const logMessage = JSON.parse(message.slice(6));
              setLogs((prevLogs) => [...prevLogs, logMessage]);
            } catch (error) {
              console.error("Error parsing log message:", error);
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Error during refresh:", error);
      setErrorMessage("Failed to refresh. Try again.");
      setIsRefreshing(false);
    } finally {
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
      }
      setIsRefreshing(false);
    }
  };

  const handlePasswordChange = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/refresh-login", {
        method: "POST",
        body: JSON.stringify({
          action: "change-password",
          password,
          newPassword,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.success) {
        setErrorMessage("Password updated successfully.");
        setNewPassword("");
        setPasswordChanged(true);
        window.location.reload();
      } else {
        setErrorMessage("Failed to update password. Try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to update password. Try again.");
    }
  };

  return (
    <div className="refresh-section">
      <p className="logged-in-message">Logged in</p>
      <div className="refresh-buttons">
        <button
          onClick={() => handleRefresh("refresh-members")}
          disabled={isRefreshing}
          className="refresh-button"
        >
          Refresh Members
        </button>
        <button
          onClick={() => handleRefresh("refresh-projects")}
          disabled={isRefreshing}
          className="refresh-button"
        >
          Refresh Projects
        </button>
        <button
          onClick={() => handleRefresh("refresh-homepage")}
          disabled={isRefreshing}
          className="refresh-button"
        >
          Refresh Homepage
        </button>
        <button
          onClick={() => handleRefresh("refresh-teams")}
          disabled={isRefreshing}
          className="refresh-button"
        >
          Refresh Teams
        </button>
      </div>
      <form
        id="change-password-form"
        onSubmit={handlePasswordChange}
        className="change-password-form"
      >
        <label htmlFor="new-password" className="password-label">
          New Password: (Optional)
        </label>
        <input
          type="password"
          id="new-password"
          name="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "change-password-form")}
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
