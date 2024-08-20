import { useState } from "react";
import "../styles/index.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Events {
    src: string,
    alt: string,
    time: string,
    title: string,
    description: string
}

type CarouselProps = {
    content?: {
        heading: string;
        subheadings: string[];
        paragraphs: string[];
        images: string[];
    };
};

export default function ImageCarousel({content} : CarouselProps) {

    const images: Events[] = [{
        src: "https://warp-potential-efd.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F66a3164d-3826-4413-80cb-27389de9b881%2Ffc1e99e1-fb4b-4074-89a2-fd1d188aa411%2FBeach_Clean-up.jpg?table=block&id=f75a6e96-82dc-4dc7-ad9f-d63ff136aa47&spaceId=66a3164d-3826-4413-80cb-27389de9b881&width=2000&userId=&cache=v2", 
        alt: "Beach clean up", 
        time: "2nd September, 12:30 - 3:30PM",
        title: "Beach Clean Up",
        description: "Come join us to clean the local beach and save our environment!"
    }, {
        src: "https://warp-potential-efd.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F66a3164d-3826-4413-80cb-27389de9b881%2Fe92b70e9-b1c3-49ab-aabc-0f75c374e182%2FArt_Showcase.jpeg?table=block&id=00793dc9-da43-4cea-8cde-33ddeb2c23f3&spaceId=66a3164d-3826-4413-80cb-27389de9b881&width=2000&userId=&cache=v2",
        alt: "Art Showcase",
        time: "2nd August, 12:30 - 3:30PM",
        title: "Art Showcase",
        description: "Come along and view some fine art! Maybe even meet some new friends!"
    }, {
        src: "https://warp-potential-efd.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F66a3164d-3826-4413-80cb-27389de9b881%2F116150f7-853a-4482-a616-8581c1161b83%2FQuiz_Night.jpg?table=block&id=5a11c339-08bc-4587-9417-2c3cb9ea858f&spaceId=66a3164d-3826-4413-80cb-27389de9b881&width=2000&userId=&cache=v2",
        alt: "Quiz night",
        time: "2nd July 12:30 - 3:30PM",
        title: "Quiz Night",
        description: "This is a description about quizzes at YOO. Quizzes are good to learn from."
    }];
    const [imgIndex, setImgIndex] = useState<number>(0);
    const handleBack = () => {
        setImgIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    }

    const handleForward = () => {
        setImgIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }
    console.log(imgIndex)


    return (
        <>  
            <div style={{ width: "100%", height: "100%", position: "relative", padding: "10px"}}>
                <div className="index-event-img" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden" }}>
                    {images.map((event: Events, index: number) => (
                        <img key={index} src={event.src} alt={event.alt} className="index-event-image-container" style={{ translate: `${-100 * imgIndex}%`, opacity: 0.7, aspectRatio: "14/6" }}/>
                    ))}
                </div>
                <div className="index-event-text">
                    <h2 className="index-heading text-green-dark" style={{ paddingRight: 15, paddingLeft: 15, margin: "auto", fontSize: "2.4vw" }}>Upcoming events</h2>
                </div>
                {/* Please do not remove the 2 divs below lmao */}
                <div className="index-event-right-corner-element">corn</div>
                <div className="index-event-left-corner-element">corn</div>
                <button onClick={() => handleBack()} className="index-carousel-button index-carousel-button-left" style={{ left: 10 }}>
                    <ArrowBackIosIcon style={{ width: 50, height: 50 }} />
                </button>
                <button onClick={() => handleForward()} className="index-carousel-button index-carousel-button-right" style={{ right: 10 }}>
                    <ArrowForwardIosIcon style={{ width: 50, height: 50 }} />
                </button>
                <div className="index-event-details">
                    <div>
                        <div>
                            <h5>{images[imgIndex].time}</h5>
                        </div>
                        <div className="index-event-title">
                            <h2><b>{images[imgIndex].title}</b></h2>
                        </div>
                    </div>
                    <div className="index-event-description">
                        <h5>{images[imgIndex].description}</h5>
                    </div>
                </div>
                <div style={{ position: "absolute", bottom: "1.3rem", left: "50%", translate: "-50%" }}>
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
