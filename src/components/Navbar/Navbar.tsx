import styles from "./nav.module.css";
import SillyMode from "../SillyMode/SillyMode.tsx";
import React from "react";
import { Simulate } from "react-dom/test-utils";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/20/solid";
import toggle = Simulate.toggle;

const Navbar = () => {
  const [silly, setSilly] = React.useState(false);
  const [typedText, setTypedText] = React.useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const sillyHandler = () => {
    if (!silly) {
      // Legacy confirmation dialog
      // if (confirm("You've found the silly animation mode toggle! \nActivating this mode causes rapid, possibly flashing motion. You can turn it off any time by clicking the same button. \n\nWould you like to continue?")) {
      //     setSilly(true);
      // }
      setSilly(true);
    } else {
      setSilly(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Toggle the mobile menu
  };

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setTypedText((prev) => {
        const newTypedText = (prev + event.key).slice(-5);
        // If silly has been typed, toggle silly mode if it's not already on
        if (newTypedText.toLowerCase() === "silly") {
          sillyHandler();
          return "";
        }
        return newTypedText;
      });
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [silly]);

  return (
    <>
      <header className={styles.nav}>
        <a href="/" className={styles.logo}>
          <img
            className={styles.logoImg}
            src="/YOO_Logo_Transparent_Background.png"
            alt="Youth of Orakei"
          />
          <span className={styles.logoText}>Youth of Ōrākei</span>
        </a>

        {/*Hamburger menu for mobile view */}

        <button className={styles.hamburger} onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-black" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-black" />
          )}
        </button>

        {/* Mobile menu */}

        <button className={styles.hamburger} onClick={toggleMobileMenu}>
          <div className={styles.hamburgerIcon}></div>
          <div className={styles.hamburgerIcon}></div>
          <div className={styles.hamburgerIcon}></div>
        </button>

        {/* Mobile menu */}
        <nav
          className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ""}`}
        >
          <a href="/" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </a>
          <a href="/projects" onClick={() => setIsMobileMenuOpen(false)}>
            Projects
          </a>
          <a href="/members" onClick={() => setIsMobileMenuOpen(false)}>
            Members
          </a>
          <a href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </a>
        </nav>

        <nav className={styles.links}>
          <a href="/">Home</a>
          <a href="/projects">Projects</a>
          <a href="/members">Members</a>
          <a href="/contact">Contact Us</a>
          <a href="/archive">History</a>
        </nav>
        {silly ? (
          <button
            id="silly-toggle"
            className={styles.sillyButtonActive}
            onClick={sillyHandler}
          >
            disable silly mode
          </button>
        ) : (
          <button
            id="silly-toggle"
            className={styles.sillyButtonInactive}
            onClick={sillyHandler}
          >
            enable silly mode
          </button>
        )}
      </header>
      {silly && <SillyMode setSilly={setSilly} />}
    </>
  );
};

export default Navbar;
