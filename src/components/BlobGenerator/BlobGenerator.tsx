/*
welcome to the blob generator!
TODO documentation here
 */

import React from "react";
import styles from "./blobs.module.css";

interface BlobParameters{
    colorScheme: string,
    blobDensity: number,
    blobShape: string
}

function BlobGenerator({colorScheme = "normal", blobDensity = 5, blobShape = "rounded"}:BlobParameters){
    /*
    const [colorScheme, setColorScheme] = React.useState("");
    const [blobDensity, setBlobDensity] = React.useState("");
    const [blobShape, setBlobShape] = React.useState("");
    */
    return(
        <div className={styles.wrapper}>

        </div>
    )
}

export default BlobGenerator;