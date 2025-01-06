import { useState, useEffect } from "react";
import "../../styles/refresh.css";
import RefreshSection from "./RefreshSection";

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check for stored login state on mount
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedPassword = localStorage.getItem("password");

    if (storedIsLoggedIn === "true" && storedPassword) {
      setLoggedIn(true);
      setPassword(storedPassword);
    }
  }, []);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const enteredPassword = formData.get("password") as string;

    const response = await fetch("/api/refresh-login", {
      method: "POST",
      body: JSON.stringify({ action: "login", password: enteredPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (result.success) {
      setPassword(enteredPassword); // Store the password after login
      setLoggedIn(true); // Hide login form and show "Logged in"
    } else {
      setErrorMessage("Invalid password. Try again.");
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    formId: string
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const form = document.getElementById(formId) as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <div className="login-container">
      <a href="/" className="home-button">
        Back to Home
      </a>
      {!loggedIn ? (
        <form
          id="login-form"
          onSubmit={handleLogin}
          className="login-form-wrapper"
        >
          <label htmlFor="password" className="password-label">
            Enter Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "login-form")}
            className="password-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default LoginForm;
