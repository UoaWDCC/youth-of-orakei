import styles from './index.module.css'

const IndexHero = () => {
    return (
        <div className="general-wrapper">
            <div className={styles.heroText}>
                <p className={styles.heroSubheading}>Youth of Ōrākei</p>
                <h1 className={styles.heroHeading}>Empowering and engaging Ōrākei youth to promote their wellbeing</h1>
                <p className={styles.heroDesc}>We’re the Youth of Ōrākei, a group of 26 young leaders (aged 12-24) from the
                    asdsadsadŌrākei Local Board area who are determined to make a positive impact in our community.</p>
            </div>
        </div>
    );
};

export default IndexHero;
