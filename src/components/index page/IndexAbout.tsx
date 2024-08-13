import styles from './index.module.css'
import IndexHeading from "./IndexHeading.tsx";

type IndexAboutProps = {
    content?: {
        heading: string;
        subheadings: string[];
        paragraphs: string[];
    };
};

const IndexAbout = ({ content }: IndexAboutProps) => {
    if (!content) {
        return <div>No content available</div>;
    }

    return (
        <div className="general-wrapper">
            <div className={styles.about}>
                <div className={styles.left}>
                    <IndexHeading>{content.heading}</IndexHeading>
                    {content.subheadings.map((subheading, index) => (
                        <div key={index} className={styles.aboutContent}>
                            <h5>{subheading}</h5>
                            <p>{content.paragraphs[index] || ''}</p>
                        </div>
                    ))}
                </div>
                <div className={styles.right}>
                    <img className={styles.sideImage} src="/Past Events/Beach Clean-up.jpg" alt="Beach Clean-up" />
                </div>
            </div>
        </div>
    );
};

export default IndexAbout;
