import styles from './index.module.css'

const IndexGoalCard = ({styleColor, children}: { styleColor:string, children:string }) => {

    let variant = {}

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
            <h4>
                {children}
            </h4>

        </div>
    );
};

export default IndexGoalCard;
