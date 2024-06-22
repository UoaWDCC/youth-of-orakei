import { useState } from "react";
import '../styles/global.css';
import "../styles/members.css";

// type TeamKey = 'team1' | 'team2' | 'team3' | 'team4';

interface TeamMember {
  name: string;
  img: string;
  id: string;
  text?: string;
}

interface TeamDetails {
  teamName: string;
  description: string;
  teamId: string;
}

interface Team {
  teamDetails: TeamDetails;
  members: TeamMember[];
}

const teamsData: Team[] = [{
  teamDetails: { teamId: 'team1', teamName: 'The Gaggle', description: 'Description of the projects team...' },
  members: [
    { name: 'Olivia Anderson', img: '/Team + Individual/T1 - OliviaAnderson.JPG', id: 'team1' },
    { name: 'Ella Aitken', img: '/Team + Individual/T1-EllaAitken.jpg', id: 'team1' },
    { name: 'James Harbour', img: '/Team + Individual/T1-JamesHarbour.JPG', id: 'team1' },
    { name: 'Leo Morrison', img: '/Team + Individual/T1-LeoMorrison.JPG', id: 'team1' },
    { name: 'Toby Low', img: '/Team + Individual/T1-TobyLow (TL).JPG', id: 'team1' },
  ]
},

{
  teamDetails: { teamId: 'team2', teamName: 'Schmetterlinge', description: 'Description of the projects team...' },
  members: [
    { name: 'Enya Grayson', img: '/Team + Individual/T2-EnyaGrayson (TL).JPG', id: 'team2' },
    { name: 'Paida Patronella', img: '/Team + Individual/T2-PaidaPatronella.JPG', id: 'team2' },
    { name: 'Sebastian Udema', img: '/Team + Individual/T2-SebastianUdema.JPG', id: 'team2' },
    { name: 'Will Dickson', img: '/Team + Individual/T2-WillDickson.JPG', id: 'team2' },
  ]
},
{
  teamDetails: { teamId: 'team3', teamName: 'Fermata', description: 'Description of the projects team...' },
  members: [
    { name: 'Olivia Wei', img: '/Team + Individual/T3 - OliviaWei.JPG', id: 'team3' },
    { name: 'Jaimie Cartwright', img: '/Team + Individual/T3-JaimieCartwright (TL).JPG', id: 'team3' },
    { name: 'Tessa Atkinson', img: '/Team + Individual/T3-TessaAtkinson.JPG', id: 'team3' },
    { name: 'Shreevali Pawar', img: '/Team + Individual/T3-ShreevaliPawar.JPG', id: 'team3' },
    { name: 'Tommy Nguyen', img: '/Team + Individual/T3-TommyNguyen.JPG', id: 'team3' },
  ]
}, {
  teamDetails: { teamId: 'team4', teamName: 'Legato', description: 'Description of the projects team...' },
  members: [
    { name: 'Aaron Leong', img: '/Team + Individual/T4-AaronLeong (TL) .JPG', id: 'team4' },
    { name: 'David Bergin', img: '/Team + Individual/T4-DavidBergin.JPG', id: 'team4' },
    { name: 'Dhivya Ramesh', img: '/Team + Individual/T4-DhivyaRamesh.JPG', id: 'team4' },
    { name: 'Emily Gibb', img: '/Team + Individual/T4-EmilyGibb.JPG', id: 'team4' },
    { name: 'Jessica Jihyeong Lee', img: '/Team + Individual/T4-Jessica Jihyeong Lee.JPG', id: 'team4' },
  ]
}
]

const ProjectTeams = () => {
  const [selectedTeam, setSelectedTeam] = useState('team1'); // Default state is team1
  const [teamNumber, setTeamNumber] = useState(0);

  const handleTeamChange = (t: string) => {
    console.log(`Changing team to: ${t}`);
    for (let i = 0; i < teamsData.length; i++) {
      if (teamsData[i].teamDetails.teamId == t) {
        setSelectedTeam(t);
        setTeamNumber(i);
      }
    }
  };

  return (
    <div className="projects" id="proj-section">
      <div className="left1">
        <h2 className="proj-title"><b>{teamsData[teamNumber].teamDetails.teamName}</b></h2>
        <p className="main-description-box-proj">
          {teamsData[teamNumber].teamDetails.description}
          <button className="learn-more-proj">
            <a href={`/projects/${selectedTeam}`}>LEARN MORE</a>
          </button>
        </p>
        <div className="project-team-nav">
          <p className="main-description-box-proj" style={{ padding: 0, margin: 0 }}>View the teams!</p>
          {teamsData.map((team) =>
            <button className={team.teamDetails.teamId !== selectedTeam ? "project-button" : "project-button project-button-active"} onClick={() => handleTeamChange(team.teamDetails.teamId)}>Team {team.teamDetails.teamName}</button>
          )}
        </div>
      </div>
      <div className="right1">
        {teamsData[teamNumber].members.map((member, index) => (
          <div key={index} className="person-card">
            <div className="img-wrapper">
              <img src={member.img} alt={member.name} />
            </div>
            <p className="description-box-proj">
              <b>{member.name}</b><br />
              {member.id} <br />
              {member.text || '[Text]'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTeams;
