import { useState } from "react";
import '../styles/global.css';
import "../styles/members.css";
// import MembersDisplay from "../components/MembersDisplay.astro";
import PersonCard from "./PersonCard.tsx";
import type { memberData } from "../types/memberData.ts";
import sanitizeFilename from "../utils/sanitizeFilename.ts";

type TeamDetails = {
  teamName: string;
  description: string;
  teamId: string;
};

type Project = {
  teamDetails: TeamDetails;
  members: memberData[];
};

type ProjectTeamsProps = {
  projects: Project[];
};

const ProjectTeams = ({ projects }: ProjectTeamsProps) => {
  const [selectedTeam, setSelectedTeam] = useState(projects[0].teamDetails.teamId);
  const [teamNumber, setTeamNumber] = useState(0);

  const handleTeamChange = (t: string) => {
    for (let i = 0; i < projects.length; i++) {
      if (projects[i].teamDetails.teamId === t) {
        setSelectedTeam(t);
        setTeamNumber(i);
      }
    }
  };


  return (
    <div className="projects" id="proj-section">
      <div className="left1">
        <h2 className="proj-title"><b>{projects[teamNumber].teamDetails.teamName}</b></h2>
        <p className="main-description-box-proj">
          {projects[teamNumber].teamDetails.description}
          <button className="learn-more-proj">
            <a href={`/projects/${selectedTeam}`}>LEARN MORE</a>
          </button>
        </p>
        <div className="project-team-nav">
          <p className="main-description-box-proj" style={{ padding: 0, margin: 0 }}>View the teams!</p>
          {projects.map((team) => (
            <button
              key={team.teamDetails.teamId}
              className={team.teamDetails.teamId !== selectedTeam ? "project-button" : "project-button project-button-active"}
              onClick={() => handleTeamChange(team.teamDetails.teamId)}
            >
              Team {team.teamDetails.teamName}
            </button>
          ))}
        </div>
      </div>
      <div className="right1">
        {projects[teamNumber].members.map((member) => {
          return (
            <PersonCard
              key={member.name}
              cover={member.cover}
              name={member.name}
              team={member.team}
              desc={member.desc}
              color={"--YOO-Red-Light"}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTeams;
