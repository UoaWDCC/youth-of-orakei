import styles from './index.module.css'
import IndexHeading from "./IndexHeading.tsx";
import IndexGoalCard from "./IndexGoalCard.tsx";

const IndexGoals = () => {
    return (
        <div className="general-wrapper">
            <div className={styles.goals}>
                <IndexHeading>Our goals</IndexHeading>
                <div className={styles.goalsList}>
                    <IndexGoalCard styleColor="blue">Support</IndexGoalCard>
                    <IndexGoalCard styleColor="green">Connect</IndexGoalCard>
                    <IndexGoalCard styleColor="red">Empower</IndexGoalCard>
                </div>

            </div>
        </div>
    );
};

export default IndexGoals;
