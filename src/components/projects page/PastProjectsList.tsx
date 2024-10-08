import "../../styles/projects.css";
import "../../styles/global.css";
import type { projectData } from "../../types/projectData.ts";

type PastProjectsListProps = {
  projects: projectData[];
};

export default function PastProjectsList({ projects }: PastProjectsListProps) {
  return (
    <div>
      {projects.map((project, index) => {
        let headerColour, infoColour;

        switch (index % 3) {
          case 0:
            headerColour = `var(--YOO-Green-Lightest)`;
            infoColour = `var(--YOO-Green-Medium)`;
            break;
          case 1:
            headerColour = `var(--YOO-Red-Light)`;
            infoColour = `var(--YOO-Red-Dark)`;
            break;
          case 2:
            headerColour = `var(--YOO-Blue-Light)`;
            infoColour = `var(--YOO-Blue-Darkest)`;
            break;
          default:
            break;
        }

        return (
          <div key={index} className="past-project-container" style={{ backgroundColor: headerColour, position: "relative", padding: "10px" }}>
            <div className="index-event-img">
              <img src={project.cover} alt={project.alt} />
            </div>
            <div className="project-team" style={{ backgroundColor: headerColour, color: infoColour }}>
              <h2 className="project-heading"><b>{project.team}</b></h2>
            </div>
            <div className="project-team-right-corner-element" style={{ boxShadow: `-15px 0px ${headerColour}` }}>corn</div>
            <div className="project-team-left-corner-element" style={{ boxShadow: `-15px 0px ${headerColour}` }}>corn</div>

            <div className="index-event-details">
              <div className="index-event-date-and-title">
                <div className="index-event-date">
                  <h5>{project.date}</h5>
                </div>
                <div className="index-event-title">
                  <h2><b>{project.title}</b></h2>
                </div>
              </div>
              <div className="index-event-description">
                <h5>{project.description}</h5>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
