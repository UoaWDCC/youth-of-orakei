import { useState } from "react";
import "../../styles/index.css";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface Project {
    id: string;
    title: string;
    date: string;
    description: string;
    cover: string;
    team: string;
    createdAt: string;
    updatedAt: string;
    carouselNumber: number;
}

type CarouselProps = {
    projects: Project[];
};

export default function ProjectsImageCarousel({ projects }: CarouselProps) {
    const events = projects.map((project) => ({
        src: project.cover,   // Use the cover image for the carousel image
        alt: project.title,   // Use the project title for the alt text
        time: new Date(project.date).toLocaleDateString(),  // Format the date
        title: project.title, // Use the project title
        description: project.description,  // Use the project description
    }));

    const [imgIndex, setImgIndex] = useState<number>(0);

    const handleBack = () => {
        setImgIndex((prevIndex) => (prevIndex === 0 ? events.length - 1 : prevIndex - 1));
    };

    const handleForward = () => {
        setImgIndex((prevIndex) => (prevIndex === events.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <>  
            <div style={{ width: "100%", height: "100%", position: "relative", padding: "10px"}}>
                <div className="index-event-img" style={{ width: "100%", height: "100%", display: "flex", overflow: "hidden" }}>
                    {events.map((event, index) => (
                        <img key={index} src={event.src} alt={event.alt} className="index-event-image-container" style={{ translate: `${-100 * imgIndex}%`, opacity: 0.7, aspectRatio: "14/6" }}/>
                    ))}
                </div>
                <div className="index-event-text">
                    <h2 className="index-heading text-green-dark" style={{ paddingRight: 15, paddingLeft: 15, margin: "auto", fontSize: "2.4vw" }}>Upcoming events</h2>
                </div>
                {/* Do not remove the 2 divs below */}
                <div className="index-event-right-corner-element">corn</div>
                <div className="index-event-left-corner-element">corn</div>
                <button onClick={handleBack} className="index-carousel-button index-carousel-button-left" style={{ left: 10 }}>
                    <ArrowBackIosIcon style={{ width: 50, height: 50 }} />
                </button>
                <button onClick={handleForward} className="index-carousel-button index-carousel-button-right" style={{ right: 10 }}>
                    <ArrowForwardIosIcon style={{ width: 50, height: 50 }} />
                </button>
                <div className="index-event-details">
                    <div>
                        <div>
                            <h5>{events[imgIndex].time}</h5>
                        </div>
                        <div className="index-event-title">
                            <h2><b>{events[imgIndex].title}</b></h2>
                        </div>
                    </div>
                    <div className="index-event-description">
                        <h5>{events[imgIndex].description}</h5>
                    </div>
                </div>
                <div style={{ position: "absolute", bottom: "1.3rem", left: "50%", translate: "-50%" }}>
                    <span className="image-carousel-indicators">
                        {events.map((_, index) => (
                            <button key={index} onClick={() => setImgIndex(index)} className={imgIndex === index ? "image-carousel-indicator" : "image-carousel-indicator image-carousel-indicator-inactive"}></button>
                        ))}
                    </span>
                </div>
            </div>
        </>
    );
}
