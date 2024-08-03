import styles from './index.module.css'

const IndexImage = ({source}: {source: string}) => {
    return (
        <div className={styles.imageWrapper}>
            <img className={styles.image} src={source}>

            </img>
        </div>
    );
};

export default IndexImage;
