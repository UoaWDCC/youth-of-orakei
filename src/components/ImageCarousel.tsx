import { useState } from "react";
import "../styles/index.css";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface Events {
  src: string;
  alt: string;
  time: string;
  title: string;
  description: string;
}

type CarouselProps = {
  carousels?: {
    heading: string;
    subheadings: string[];
    paragraphs: string[];
    images: string[];
  }[];
};

export default function ImageCarousel({ carousels }: CarouselProps) {
  const events: Events[] =
    carousels?.map((carousel) => ({
      src: carousel.images[0],
      alt: carousel.subheadings[0],
      time: carousel.paragraphs[0],
      title: carousel.subheadings[0],
      description: carousel.paragraphs[1],
    })) || [];

  const [imgIndex, setImgIndex] = useState<number>(0);

  const handleBack = () => {
    setImgIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const handleForward = () => {
    setImgIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          padding: "10px",
        }}
      >
        <div
          className="index-event-img"
          style={{ width: "100%", display: "flex", overflow: "hidden" }}
        >
          {events.map((event: Events, index: number) => (
            <img
              key={index}
              src={event.src}
              alt={event.alt}
              className="index-event-image-container"
              style={{ translate: `${-100 * imgIndex}%`, opacity: 0.7 }}
            />
          ))}
        </div>
        <div className="index-event-left-corner-element">corn</div>
        <div className="index-event-right-corner-element">corn</div>
        <div className="index-event-text">
          <h2 className="index-heading text-green-dark">Upcoming events</h2>
        </div>
        <button
          onClick={handleBack}
          className="index-carousel-button index-carousel-button-left"
          style={{ left: 10 }}
          aria-label="Back"
        >
          <ArrowBackIosIcon style={{ width: 50, height: 50 }} />
        </button>
        <button
          onClick={handleForward}
          className="index-carousel-button index-carousel-button-right"
          style={{ right: 10 }}
          aria-label="Forward"
        >
          <ArrowForwardIosIcon style={{ width: 50, height: 50 }} />
        </button>
        <div className="index-event-details">
          <div className="index-event-date-and-title">
            <div className="index-event-date">
              <h5>{events[imgIndex].time}</h5>
            </div>
            <div className="index-event-title">
              <h2>{events[imgIndex].title}</h2>
            </div>
          </div>
          <div className="index-event-description">
            <h5>{events[imgIndex].description}</h5>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "1.3rem",
            left: "50%",
            translate: "-50%",
          }}
        >
          <span className="image-carousel-indicators">
            {events.map((_, index: number) => (
              <button
                key={index}
                onClick={() => setImgIndex(index)}
                className={
                  imgIndex === index
                    ? "image-carousel-indicator"
                    : "image-carousel-indicator image-carousel-indicator-inactive"
                }
                aria-label={`carousel index ${index}`}
              ></button>
            ))}
          </span>
        </div>
      </div>
    </>
  );
}
