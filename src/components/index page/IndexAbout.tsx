import styles from './index.module.css'
import IndexHeading from "./IndexHeading.tsx";

const IndexAbout = () => {
    return (
        <div className="general-wrapper">
            <div className={styles.about}>
                <div className={styles.left}>
                    <IndexHeading>About us</IndexHeading>
                    <div className={styles.aboutContent}>
                        <h5>Who we are</h5>
                        <p>A group of 26 young leaders (aged 12-24) from the Ōrākei Local Board area who are determined to make a positive impact in our community. As a group we help provide a voice to the youth in our community. The youth council is supported by the Ōrākei Local Board.</p>
                    </div>
                    <div className={styles.aboutContent}>
                        <h5>What we do</h5>
                        <p>
                            The Youth of Ōrākei not only organises and supports events, but they equip and engage youth. But it is also our priority to give a voice to the youth in the community for the future of Ōrākei and wider Auckland by advising and submitting on council policies.
                        </p>
                    </div>
                </div>
                <div className={styles.right}>
                    <img className={styles.sideImage} src="/Past Events/Beach Clean-up.jpg"></img>
                </div>
            </div>

        </div>
    );
};

export default IndexAbout;
