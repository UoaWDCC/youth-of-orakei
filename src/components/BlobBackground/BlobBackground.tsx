import styles from './blobbackground.module.css'
import zIndex from "@mui/material/styles/zIndex";

type props = {
    offset: number,
    zIndexVal: number
}

/*
Blob background component.

Two props:
Offset (e.g. -100): the absolute positioning offset in pixels (passing -100 will move the background up by 100px)
ZIndexVal (e.g. -10): the z-index for the background. Keep at 0 unless you've got other z positioned elements and you need to make sure it's behind them.
 */

const BlobBackground = ({offset, zIndexVal = 0}: props) => {

    const offsetStyle = offset ? {top: `${offset}px`} : undefined

    return (
        <>
            <img className={styles.blobBg} alt="abstract background shapes" src="/assets/YOO_index-hero-bg-2.svg"
                 style={{...offsetStyle, zIndex: zIndexVal}}/>
        </>
    );
};

export default BlobBackground;
