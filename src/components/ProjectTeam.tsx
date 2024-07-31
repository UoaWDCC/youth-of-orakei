import { useState } from "react";
import '../styles/global.css';
import "../styles/members.css";
// import MembersDisplay from "../components/MembersDisplay.astro";
import PersonCard from "./PersonCard.tsx";

import { getMembers } from "../scripts/getMembers";
let members = await getMembers();

import { sortMembersByTeam } from "../scripts/sortTeams.ts";
let { leadershipTeam, communicationTeam, projects } =
  sortMembersByTeam(members);

console.log(projects);

const ProjectTeams = () => {
  const [selectedTeam, setSelectedTeam] = useState(projects[0].teamDetails.teamId); // Default state is team1
  const [teamNumber, setTeamNumber] = useState(0);

  const handleTeamChange = (t: string) => {
    console.log(`Changing team to: ${t}`);
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
              className={team.teamDetails.teamId !== selectedTeam ? "project-button" : "project-button project-button-active"}
              onClick={() => handleTeamChange(team.teamDetails.teamId)}
            >
              Team {team.teamDetails.teamName}
            </button>
          ))}
        </div>
      </div>
      <div className="right1">
        {projects[teamNumber].members.map((member) => (
          <PersonCard
            cover={member.cover}
            name={member.name}
            team={member.team}
            desc={member.desc}
          />
        ))}
      </div>
    </div >
  );
};

export default ProjectTeams;
