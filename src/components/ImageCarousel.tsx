import React from "react";
import "../styles/global.css";
import "../styles/index.css";

export default function ImageCarousel() {

    return (
        <>
            <div className="index-carousel-button">
            </div>
            <div className="index-carousel-box">

                <div className="index-carousel-image">
                    <div className="placeholder">
                        <p className="placeholder-text">Placeholder image</p>
                    </div>
                </div>
                <div className="index-carousel-text">
                    <p className="carousel-subtitle">
                        2nd September, 12:30 - 3:30PM
                    </p>
                    <p className="carousel-title">
                        Sportathon
                    </p>
                    <p className="carousel-paragraph">
                        Are you a student interested in sports, fun, exercise, and meeting new people? Come to our Sportathon event on the 2nd September at College Rifles!
                    </p>
                    </div>
            </div>
            <div className="index-carousel-button">
            </div>
        </>
    );
}
