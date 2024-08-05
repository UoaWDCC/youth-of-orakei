import styles from './nav.module.css'

/*
New navbar (see header.astro in components folder for previous version)
 */

const Navbar = () => {
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
        </header>
    );
};

export default Navbar;
