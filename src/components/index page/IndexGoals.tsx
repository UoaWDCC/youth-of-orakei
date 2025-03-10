import styles from './index.module.css'
import IndexHeading from "./IndexHeading.tsx";
import IndexGoalCard from "./IndexGoalCard.tsx";

type IndexAboutProps = {
    content?: {
        heading: string;
        subheadings: string[];
        paragraphs: string[];
    };
};

const colorScheme = ["blue", "green", "red"];

const IndexGoals = ({content} : IndexAboutProps) => {
    if (!content) {
        return <div>No goals available</div>;
    }
    return (
        <div className="general-wrapper">
            <div className={styles.goals}>
                <IndexHeading>Our goals</IndexHeading>
                <div className={styles.goalsList}>
                    {content.paragraphs.map((goal, index) => (
                        <IndexGoalCard key={index} title={content.subheadings[index]} styleColor={colorScheme[index % colorScheme.length]}>{goal}</IndexGoalCard>
                    ))}
                    {/* <IndexGoalCard title="Support" styleColor="blue">We support Ōrākei youth with networks, friends, and community-building events that help both our members and the wider Ōrākei community. We represent the voice of Ōrākei youth in scenarios that involve leaders from all across Auckland.</IndexGoalCard>
                    <IndexGoalCard title="Connect" styleColor="green">We have a mission to connect young people from around the region with each other to promote learning and community. Our teams work on group activities and engagements that build positive relationships across all of Ōrākei.</IndexGoalCard>
                    <IndexGoalCard title="Empower" styleColor="red">We help empower Ōrākei youth to do amazing things, with events, activities, and meetups designed to foster positive engagement and wellbeing.</IndexGoalCard> */}
                </div>

            </div>
        </div>
    );
};

export default IndexGoals;
