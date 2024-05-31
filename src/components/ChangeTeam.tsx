import { useState } from "react";
import '../styles/global.css';
import "../styles/members.css";

type TeamKey = 'team1' | 'team2' | 'team3' | 'team4';

interface TeamMember {
  name: string;
  img: string;
  role: string;
  text?: string;
}

interface TeamDetails {
  teamName: string;
  description: string;
}

interface Team {
  teamDetails: TeamDetails;
  members: TeamMember[];
}

const teamsData: Record<TeamKey, Team> = {
  team1: {
    teamDetails: { teamName: 'The Gaggle', description: '' },
    members: [
      { name: 'Olivia Anderson', img: '/Team + Individual/T1 - OliviaAnderson.JPG', role: 'Team 1' },
      { name: 'Ella Aitken', img: '/Team + Individual/T1-EllaAitken.jpg', role: 'Team 1' },
      { name: 'James Harbour', img: '/Team + Individual/T1-JamesHarbour.JPG', role: 'Team 1' },
      { name: 'Leo Morrison', img: '/Team + Individual/T1-LeoMorrison.JPG', role: 'Team 1' },
      { name: 'Toby Low', img: '/Team + Individual/T1-TobyLow (TL).JPG', role: 'Team 1' },
    ],
  },
  team2: {
    teamDetails: { teamName: 'Schmetterlinge', description: '' },
    members: [
      { name: 'Enya Grayson', img: '/Team + Individual/T2-EnyaGrayson (TL).JPG', role: 'Team 2' },
      { name: 'Paida Patronella', img: '/Team + Individual/T2-PaidaPatronella.JPG', role: 'Team 2' },
      { name: 'Sebastian Udema', img: '/Team + Individual/T2-SebastianUdema.JPG', role: 'Team 2' },
      { name: 'Will Dickson', img: '/Team + Individual/T2-WillDickson.JPG', role: 'Team 2' },
    ],
  },
  team3: {
    teamDetails: { teamName: 'Fermata', description: '' },
    members: [
      { name: 'Olivia Wei', img: '/Team + Individual/T3 - OliviaWei.JPG', role: 'Team 3' },
      { name: 'Jaimie Cartwright', img: '/Team + Individual/T3-JaimieCartwright (TL).JPG', role: 'Team 3' },
      { name: 'Tessa Atkinson', img: '/Team + Individual/T3-TessaAtkinson.JPG', role: 'Team 3' },
      { name: 'Shreevali Pawar', img: '/Team + Individual/T3-ShreevaliPawar.JPG', role: 'Team 3' },
      { name: 'Tommy Nguyen', img: '/Team + Individual/T3-TommyNguyen.JPG', role: 'Team 3' },
    ],
  },
  team4: {
    teamDetails: { teamName: 'Legato', description: '' },
    members: [
      { name: 'Aaron Leong', img: '/Team + Individual/T4-AaronLeong (TL).JPG', role: 'Team 4' },
      { name: 'David Bergin', img: '/Team + Individual/T4-DavidBergin.JPG', role: 'Team 4' },
      { name: 'Dhivya Ramesh', img: '/Team + Individual/T4-DhivyaRamesh.JPG', role: 'Team 4' },
      { name: 'Emily Gibb', img: '/Team + Individual/T4-EmilyGibb.JPG', role: 'Team 4' },
      { name: 'Jessica Jihyeong Lee', img: '/Team + Individual/T4-JessicaJihyeongLee.JPG', role: 'Team 4' },
    ],
  },
};

const ProjectTeams = () => {
  const [selectedTeam, setSelectedTeam] = useState<TeamKey>('team1'); // Default state is team1

  const changeTeam = (teamKey: TeamKey) => {
    setSelectedTeam(teamKey);
  };

  return (
    <div className="projects" id="proj-section">
      <div className="left1">
        <h2 className="proj-title"><b>{teamsData[selectedTeam].teamDetails.teamName}</b></h2>
        <p className="main-description-box-proj">
          {teamsData[selectedTeam].teamDetails.description}
          <button className="learn-more-proj">
            <a href={`/projects/${selectedTeam}`}>LEARN MORE</a>
          </button>
        </p>
      </div>
      <div className="right1">
        <div className="projects-nav-card">
          <div className="project-team-nav">
            {Object.keys(teamsData).map((teamKey) => (
              <button
                key={teamKey}
                className="project-button"
                onClick={() => changeTeam(teamKey as TeamKey)}
              >
                {teamsData[teamKey as TeamKey].teamDetails.teamName}
              </button>
            ))}
          </div>
        </div>
        {teamsData[selectedTeam].members.map((member, index) => (
          <div key={index} className="person-card">
            <div className="img-wrapper">
              <img src={member.img} alt={member.name} />
            </div>
            <p className="description-box-proj">
              <b>{member.name}</b><br />
              {member.role} <br />
              {member.text || '[Text]'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTeams;
