import { useState } from "react";
import "../styles/index.css";

interface Events {
    src: string,
    alt: string,
    time: string,
    title: string,
    description: string
}

export default function ImageCarousel() {

    const images: Events[] = [{
        src: "https://warp-potential-efd.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F66a3164d-3826-4413-80cb-27389de9b881%2Ffc1e99e1-fb4b-4074-89a2-fd1d188aa411%2FBeach_Clean-up.jpg?table=block&id=f75a6e96-82dc-4dc7-ad9f-d63ff136aa47&spaceId=66a3164d-3826-4413-80cb-27389de9b881&width=2000&userId=&cache=v2", 
        alt: "Beach clean up", 
        time: "2nd September, 12:30 - 3:30PM",
        title: "Beach Clean Up",
        description: "Come join us to clean the local beach!"
    }, {
        src: "https://warp-potential-efd.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F66a3164d-3826-4413-80cb-27389de9b881%2F0bafff12-ccdc-4019-aa9c-800f11a7f7e6%2FLife_Skills_Workshop.jpg?table=block&id=14158091-26a6-4e0c-9d72-724df9c28894&spaceId=66a3164d-3826-4413-80cb-27389de9b881&width=2000&userId=&cache=v2",
        alt: "Life skills workshop",
        time: "2nd August, 12:30 - 3:30PM",
        title: "Life Skills Workshop",
        description: "Come learn about life skills!"
    }, {
        src: "https://warp-potential-efd.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F66a3164d-3826-4413-80cb-27389de9b881%2F116150f7-853a-4482-a616-8581c1161b83%2FQuiz_Night.jpg?table=block&id=5a11c339-08bc-4587-9417-2c3cb9ea858f&spaceId=66a3164d-3826-4413-80cb-27389de9b881&width=2000&userId=&cache=v2",
        alt: "Quiz night",
        time: "2nd July 12:30 - 3:30PM",
        title: "Quiz Night",
        description: "Come learn about quizzes"
    }];
    const [imgIndex, setImgIndex] = useState<number>(0);
    const handleBack = () => {
        setImgIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    }

    const handleForward = () => {
        setImgIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }


    return (
        <>
    {/*
        <>
        <div className="index-events-carousel-wrapper">
            <div className="index-carousel-button" onClick={() => handleBack()}>
                <p><b>&lt;</b></p>
            </div>
            <div className="index-carousel-box">
                {images.map((event: Events, index: number) => (
                    <div className={imgIndex === index ? "index-carousel-image-wrapper" : "index-carousel-image-wrapper-hidden" }>
                        <img src={event.src} alt={event.alt} key={index} className={imgIndex === index ? "index-carousel-image" : "index-carousel-image-hidden"} />
                    </div>
                ))}
                <div className="index-carousel-text">
                    <p className="carousel-subtitle">
                        {images[imgIndex].time}
                    </p>
                    <p className="carousel-title">
                        {images[imgIndex].title}
                    </p>
                    <p className="carousel-paragraph">
                        {images[imgIndex].description}
                    </p>
                </div>
            </div>
            <div className="index-carousel-button" onClick={() => handleForward()}>
                <p><b>&gt;</b></p>
            </div>
        </div>
            <span className="image-carousel-indicators">
                {images.map((_: any, index: number) => (
                    <button key={index} onClick={() => setImgIndex(index)} className={imgIndex === index ? "image-carousel-indicator" : "image-carousel-indicator image-carousel-indicator-inactive"}></button>
                ))}
            </span>
        </>
            */}
            <div style={{ width: "100%", height: "100%", position: "relative"}}>
            
                <div style={{ width: "100%", height: "100%", display: "flex" }}>
                    {images.map((event: Events, index: number) => (
                        <img key={index} src={event.src} alt={event.alt} className={imgIndex === index ? "index-event-image-container" : "index-carousel-image-wrapper-hidden"}/>
                    ))}
                </div>
                <div className="index-event-text" style={{ margin: "auto" }}>
                    <h2 className="index-heading text-green-dark">Upcoming events</h2>
                </div>
                <button onClick={() => handleBack()} className="index-carousel-button" style={{ left: 0 }}>
                    <p><b>&lt;</b></p>
                </button>
                <button onClick={() => handleForward()} className="index-carousel-button" style={{ right: 0 }}>
                    <p><b>&gt;</b></p>
                </button>
                <div style={{ position: "absolute", bottom: ".5rem", left: "50%", translate: "-50%" }}>
                    <span className="image-carousel-indicators" >
                        {images.map((_: any, index: number) => (
                            <button key={index} onClick={() => setImgIndex(index)} className={imgIndex === index ? "image-carousel-indicator" : "image-carousel-indicator image-carousel-indicator-inactive"}></button>
                        ))}
                    </span>
                </div>
            </div>
        </>
    );
}
