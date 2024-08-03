import styles from './index.module.css'

type props = {
    source: string,
    desc: string;
}

const IndexImage = ({source, desc}: props) => {
    if(!desc) console.log("An image element is missing an alt tag, please add one!");

    return (
        <div className={styles.imageWrapper}>
            <img className={styles.image} src={source} alt={desc}>

            </img>
        </div>
    );
};

export default IndexImage;
