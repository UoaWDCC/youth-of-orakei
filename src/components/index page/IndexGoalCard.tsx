import styles from './index.module.css'

type props = {
    styleColor: string,
    children: string,
    title: string
}

const IndexGoalCard = ({styleColor, children, title}: props) => {

    let variant = {};

    switch(styleColor) {
        case "blue":
            variant = {
                backgroundColor: "var(--YOO-Blue-Light)",
                color: "var(--YOO-Blue-Darkest)",
            };
            break;
        case "green":
            variant = {
                backgroundColor: "var(--YOO-Green-Lightest)",
                color: "var(--YOO-Green-Dark)",
            }
            break;
        case "red":
            variant = {
                backgroundColor: "var(--YOO-Red-Light)",
                color: "var(--YOO-Red-Dark)",
            }
    }

    return (
        <div className={styles.goal} style={{...variant}}>
            <img className={styles.goalBg} alt="abstract background goal shapes" src="/assets/YOO_index-goals-bg.svg"/>
            <h4>
                {title}
            </h4>
            <p className={styles.goalText}>
                {children}
            </p>
        </div>
    );
};

export default IndexGoalCard;
