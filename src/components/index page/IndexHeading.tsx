import styles from './index.module.css'

const IndexHeading = ({children}: {children: string}) => {
    return (
        <h2 className={styles.heading}>
            {children}
        </h2>
    );
};

export default IndexHeading;
