import styles from './silly.module.css'
import "./sillymodes.css"
import React from "react";

/*
SILLY MODE
Various fun animations and whimsical touches for the website.
All controlled via the Silly Menu, which can be brought up via typing 'silly' or the navbar button.

This code is kinda scuffed so pls don't judge lol.
For questions ask Andrew.
 */

type SillyModeProps = {
    setSilly: (a: boolean) => void;
}

const SillyMode = ({setSilly} : SillyModeProps) => {

    const[sillyMode, setSillyMode] = React.useState("")

    React.useEffect(() => {
        console.log(`set silly animation mode to ${sillyMode}`);

        /* Select elements to apply animation class to.
        * Select only from the <main> area to exclude navbar (so that you can toggle it back off without that also animating lol) */
        let mainArea = document.querySelector('main') || document.body;
        let change = mainArea.querySelectorAll('main');
        let toggleButton = document.getElementById("silly-toggle");

        let mode = "";

        if (sillyMode !== "") {

            // Choose which class (from sillymodes.css) to add to enable the animations.
            switch(sillyMode){
                case "The Great Rotation":
                    mode = "great-rotate"
                    break
                case "Zoom Warp":
                    mode = "zoom-warp"
                    break
                case "Letter Vanisher":
                    mode = "letter-vanisher"
                    break
                case "Colourer":
                    mode = "colourer"
                    break
                case "Wiggly Wiggly":
                    mode = "wigglywiggly"
                    break
                case "Wiggle Pauser":
                    mode = "wigglepauser"
                    break
                case "Space":
                    mode = "space"
                    break
                default:
                    alert("Silly Mode Error: if you see this something has gone wrong! Refresh the page.")
            }

            // Update elements to change depending on animation type
            if(mode === "letter-vanisher"){
                change = mainArea.querySelectorAll('main h1, h2, h3, h4, h5, h6, p, a, span');

                for(const i of change){
                    let values = i.innerText.split("");
                    let newElem = "";
                    for(const k of values){
                        newElem += `<span id="LetterVanisher">${k}</span>`
                    }
                    i.innerHTML = newElem;
                }

                change = document.querySelectorAll("#LetterVanisher")
                for (const i of change) {
                    i.classList.add(mode);
                }
            }
            else if(mode === "colourer"){
                change = mainArea.querySelectorAll('main h1, h2, h3, h4, h5, h6, p, a, span');

                for(const i of change){
                    let values = i.innerText.split("");
                    let newElem = "";
                    for(const k of values){
                        newElem += `<span id="Colourer">${k}</span>`
                    }
                    i.innerHTML = newElem;
                }

                change = document.querySelectorAll("#Colourer")
                for (const i of change) {
                    let randomColor = Math.floor(Math.random()*16777215).toString(16);
                    i.style.color = `#${randomColor}`;
                    i.classList.add(mode);
                }


            }

            else{
                change = mainArea.querySelectorAll('main h1, h2, h3, h4, h5, h6, img, p, a, .goalCard');
                for (const i of change) {
                    i.classList.add(mode);
                }
            }

            // Update "disable/enable silly mode" navbar button style
            if (toggleButton) {
                toggleButton.style.opacity = "1";
                toggleButton.style.color = "red";
                toggleButton.style.fontWeight = "700";
            }
        }

        return () => {
            console.log(mode);
            for (const i of change) {
                i.classList.remove(mode ? mode : "placeholder-class-for-empty-returns");
            }
            if (toggleButton) {
                toggleButton.style.opacity = "0.5";
                toggleButton.style.color = "rebeccapurple";
                toggleButton.style.fontWeight = "inherit";
            }
        }
    }, [sillyMode])

    // JSX largely for the popup dialogue for Silly Mode.
    return (
        <>
            {sillyMode === "" &&
                <div className={styles.bg} onClick={() => setSilly(false)}>
                    <div className={styles.wrapper}>
                        <p className={styles.heading}>You've discovered Silly Mode!</p>
                        <p className={styles.desc}>
                            Activating this mode causes rapid, possibly flashing motion.
                            You can turn it off any time by clicking the same button.
                            Would you like to continue?</p>

                        <div className={styles.buttonsWrapper}>
                            <button className={styles.buttons} onClick={() => setSillyMode("The Great Rotation")}>The
                                Great Rotation
                            </button>
                            <button className={styles.buttons} onClick={() => setSillyMode("Zoom Warp")}>Zoom Warp
                            </button>
                            <button className={styles.buttons} onClick={() => setSillyMode("Letter Vanisher")}>Letter
                                Vanisher
                            </button>
                            <button className={styles.buttons} onClick={() => setSillyMode("Colourer")}>Colourer
                            </button>
                            <button className={styles.buttons} onClick={() => setSillyMode("Wiggly Wiggly")}>Wiggly
                                Wiggly
                            </button>
                            <button className={styles.buttons} onClick={() => setSillyMode("Wiggle Pauser")}>Wiggle Pauser
                            </button>
                            <button className={styles.buttons} onClick={() => setSillyMode("Space")}>Space</button>
                        </div>

                        <p className={styles.warning}>
                            Silly Mode is the product of whimsical web developers being quirky :) It might be glitchy or cause possible bugs. Refresh the site if you think something is wrong!
                        </p>
                    </div>
                </div>
            }
            {sillyMode !== "" &&
                <div className={styles.statusWrapper}>
                    <p className={styles.status}>
                        Silly Mode active! Mode: {`${sillyMode}`}
                    </p>
                </div>
            }
        </>
    );
};

export default SillyMode;
