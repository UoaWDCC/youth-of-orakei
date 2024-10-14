import styles from './nav.module.css'
import SillyMode from "../SillyMode/SillyMode.tsx";
import React from "react";
import { Simulate } from "react-dom/test-utils";
import toggle = Simulate.toggle;

/*
New navbar (see header.astro in components folder for previous version)
 */

const Navbar = () => {
    const [silly, setSilly] = React.useState(false);
    const [typedText, setTypedText] = React.useState('');

    const sillyHandler = () => {
        if (!silly) {
            // Legacy confirmation dialog
            // if (confirm("You've found the silly animation mode toggle! \nActivating this mode causes rapid, possibly flashing motion. You can turn it off any time by clicking the same button. \n\nWould you like to continue?")) {
            //     setSilly(true);
            // }
            setSilly(true)
        }
        else {
            setSilly(false);
        }
    }

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            setTypedText((prev) => {
                const newTypedText = (prev + event.key).slice(-5);
                // If silly has been typed, toggle silly mode if it's not already on
                if (newTypedText.toLowerCase() === 'silly') {
                    sillyHandler();
                    return '';
                }
                return newTypedText;
            });
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
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
                <nav className={styles.links}>
                    <a href="/">Home</a>
                    <a href="/projects">Projects</a>
                    <a href="/members">Members</a>
                    <a href="/contact">Contact</a>
                </nav>
                <button id="silly-toggle" className={styles.sillyButton} onClick={sillyHandler}>
                    {silly ? "disable silly mode" : "enable silly mode"}
                </button>
            </header>
            {silly && <SillyMode setSilly={setSilly}/>}
        </>
    );
};

export default Navbar;
