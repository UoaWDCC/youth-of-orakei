import "../../styles/projects.css";
import "../../styles/global.css";
import { relative } from "path";

interface Events {
  src: string;
  alt: string;
  time: string;
  title: string;
  description: string;
  team: string;
}

export default function PastProjectsList() {
  const projects: Events[] = [
    {
      src: "https://warp-potential-efd.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F66a3164d-3826-4413-80cb-27389de9b881%2Ffc1e99e1-fb4b-4074-89a2-fd1d188aa411%2FBeach_Clean-up.jpg?table=block&id=f75a6e96-82dc-4dc7-ad9f-d63ff136aa47&spaceId=66a3164d-3826-4413-80cb-27389de9b881&width=2000&userId=&cache=v2",
      alt: "Beach clean up",
      time: "2nd September, 12:30 - 3:30PM",
      title: "Beach Clean Up",
      description: "Come join us to clean the local beach!",
      team: "Team 1",
    },
    {
      src: "https://warp-potential-efd.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F66a3164d-3826-4413-80cb-27389de9b881%2Fe92b70e9-b1c3-49ab-aabc-0f75c374e182%2FArt_Showcase.jpeg?table=block&id=00793dc9-da43-4cea-8cde-33ddeb2c23f3&spaceId=66a3164d-3826-4413-80cb-27389de9b881&width=2000&userId=&cache=v2",
      alt: "Art Showcase",
      time: "2nd August, 12:30 - 3:30PM",
      title: "Art Showcase",
      description: "Come along and view some fine art! Maybe even meet some new friends!",
      team: "Team 2",
    },
    {
      src: "https://warp-potential-efd.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F66a3164d-3826-4413-80cb-27389de9b881%2F116150f7-853a-4482-a616-8581c1161b83%2FQuiz_Night.jpg?table=block&id=5a11c339-08bc-4587-9417-2c3cb9ea858f&spaceId=66a3164d-3826-4413-80cb-27389de9b881&width=2000&userId=&cache=v2",
      alt: "Quiz night",
      time: "2nd July 12:30 - 3:30PM",
      title: "Quiz Night",
      description: "Come learn about quizzes",
      team: "Team 3",
    },
  ];

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
            headerColour = `var(--YOO-Red-Primary)`;
            infoColour = `var(--YOO-Red-Primary)`;
            break;
          case 2:
            headerColour = `var(--YOO-Blue-Primary)`;
            infoColour = `var(--YOO-Blue-Primary)`;
            break;
          default:
            break;
        }

        return (
          <div className="past-project-container" style={{ backgroundColor: headerColour, position: "relative", padding: "10px" }}>
            <img key={index} src={project.src} alt={project.alt} style={{ height: "1000px", objectFit: "cover", borderRadius: "25px" }}/>
            
            <div className="project-team" style={{ backgroundColor: headerColour }}>
              <h2 className="index-heading text-green-dark">{project.team}</h2>
            </div>
            <div className="project-team-right-corner-element" style={{ boxShadow: `-15px 0px ${headerColour}` }} >corn</div>
            <div className="project-team-left-corner-element" style={{ boxShadow: `-15px 0px ${headerColour}` }} >corn</div>

            <div className="project-text" style={{ backgroundColor: headerColour }}>
              <div className="project-title-time">
                <div className="project-title">
                  <h3 className="index-heading text-green-dark">{project.title}</h3>
                </div>
                <div className="project-date" >
                  <h4>{project.time}</h4>
                </div>
              </div>

              <div className="project-desc">
                <h5>{project.description}</h5>
              </div>
            </div>
            <div className="project-right-corner-element" style={{ boxShadow: `-15px 0px ${headerColour}` }}>corn</div>
            <div className="project-left-corner-element" style={{ boxShadow: `-15px 0px ${headerColour}` }}>corn</div>

          </div>
        );
      })}
    </div>
  );
}
