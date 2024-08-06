import styles from './nav.module.css'
import React from "react";
import {Simulate} from "react-dom/test-utils";
import toggle = Simulate.toggle;

/*
New navbar (see header.astro in components folder for previous version)
 */

const Navbar = () => {
    const [silly, setSilly] = React.useState(false);

    const sillyHandler = () => {
        if(!silly){
            if(confirm("You've found the silly animation mode toggle! \nActivating this mode causes rapid, possibly flashing motion. You can turn it off any time by clicking the same button. \n\nWould you like to continue?")){
                setSilly(true);
            }
        }
        else{
            setSilly(false);
        }
    }

    /* Adds the silly rotation animation to selected elements. The code is kinda scrappy for it lol */
    React.useEffect(() => {
        console.log(`set silly animation mode to ${silly}`);

        /* Select elements to apply animation class to.
        * Select only from the <main> area to exclude navbar (so that you can toggle it back off without that also animating lol) */
        let mainArea = document.querySelector('main') || document.body;
        let change = mainArea.querySelectorAll('main h1, h2, h3, h4, h5, h6, img, p, a, .goalCard');
        let toggleButton = document.getElementById("silly-toggle");

        if(silly){
            for(const i of change){
                i.classList.add("silly-anim");
            }
            if(toggleButton){
                toggleButton.style.opacity = "1";
                toggleButton.style.color = "red";
                toggleButton.style.fontWeight = "700";
            }
        }

        return() => {
            for(const i of change){
                i.classList.remove("silly-anim");
            }
            if(toggleButton){
                toggleButton.style.opacity = "0.5";
                toggleButton.style.color = "rebeccapurple";
                toggleButton.style.fontWeight = "inherit";
            }
        }
    }, [silly])

    return (
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
    );
};

export default Navbar;
