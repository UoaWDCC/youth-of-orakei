import styles from './index.module.css'


type IndexHeroProps = {
    content?: {
        heading: string;
        subheadings: string[];
        paragraphs: string[];
    };
};

const IndexHero = ({content} : IndexHeroProps) => {
    return (
        <div className="general-wrapper">
            <div className={styles.heroText}>
                <p className={styles.heroSubheading}>{content?.subheadings[0]}</p>
                <h1 className={styles.heroHeading}>{content?.subheadings[1]}</h1>
                <p className={styles.heroDesc}>{content?.paragraphs[1]}</p>
            </div>
        </div>
    );
};

export default IndexHero;
