import { useState } from "react";
import "../styles/members.css";

const teamsData = {
  team1: [
    { id: 'team1', teamName: 'The Gaggle', description: '' },
    { name: 'Olivia Anderson', img: '\Team + Individual\T1 - OliviaAnderson.JPG', role: 'Team 1' },
    { name: 'Ella Aitken', img: '\Team + Individual\T1-EllaAitken.jpg', role: 'Team 1' },
    { name: 'James Harbour', img: '\Team + Individual\T1-JamesHarbour.JPG', role: 'Team 1' },
    { name: 'LeoM orrison', img: '\Team + Individual\T1-LeoMorrison.JPG', role: 'Team 1' },
    { name: 'Toby Low', img: '\Team + Individual\T1-TobyLow (TL).JPG', role: 'Team 1' },
  ],
  team2: [
    { teamName: 'Schmetterlinge', description: '' },
    { name: 'Enya Grayson', img: '\Team + Individual\T2-EnyaGrayson (TL).JPG', role: 'Team 2' },
    { name: 'Paida Patronella', img: '\Team + Individual\T2-PaidaPatronella.JPG', role: 'Team 2' },
    { name: 'Sebastian Udema', img: '\Team + Individual\T2-SebastianUdema.JPG', role: 'Team 2' },
    { name: 'Will Dickson', img: '\Team + Individual\T2-WillDickson.JPG', role: 'Team 2' },
  ],
  team3: [
    { teamName: 'Fermata', description: '' },
    { name: 'Olivia Wei', img: '\Team + Individual\T3 - OliviaWei.JPG', role: 'Team 3' },
    { name: 'Jaimie Cartwright', img: '\Team + Individual\T3-JaimieCartwright (TL).JPG', role: 'Team 3' },
    { name: 'Tessa Atkinson', img: '\Team + Individual\T3-TessaAtkinson.JPG', role: 'Team 3' },
    { name: 'Shreevali Pawar', img: '\Team + Individual\T3-ShreevaliPawar.JPG', role: 'Team 3' },
    { name: 'Tommy Nguyen', img: '\Team + Individual\T3-TommyNguyen.JPG', role: 'Team 3' },

  ],
  team4: [
    { teamName: 'Legato', description: '' },
    { name: 'AaronLeong', img: '\Team + Individual\T4-AaronLeong (TL) .JPG', role: 'Team 4' },
    { name: 'DavidBergin', img: '\Team + Individual\T4-DavidBergin.JPG', role: 'Team 4' },
    { name: 'DhivyaRamesh', img: '\Team + Individual\T4-DhivyaRamesh.JPG', role: 'Team 4' },
    { name: 'EmilyGibb', img: '\Team + Individual\T4-EmilyGibb.JPG', role: 'Team 4' },
    { name: 'Jessica Jihyeong Lee', img: '\Team + Individual\T4-Jessica Jihyeong Lee.JPG', role: 'Team 4' },
  ]
};

// const ProjectTeams = () => {
//   const [selectedTeam, setSelectedTeam] = useState('team1');

//   const handleTeamChange = (event) => {
//     const selectedTeam = event.target.value;
//     const member = teamsData.find(team) => team.id == selectedId);
//   };

// return (
//   <div className="projects" id="proj-section">
//       <div className="left1">
//         <h2 className="proj-title"><b>{teamsData[selectedTeam].teamDetails.teamName}</b></h2>
//         <p className="main-description-box-proj">
//           {teamsData[selectedTeam].teamDetails.description}
//           <button className="learn-more-proj">
//             <a href={`/projects/${selectedTeam}`}>LEARN MORE</a>
//           </button>
//         </p>
//       </div>
//       <div className="right1">
//         <div className="projects-nav-card">
//           <div className="project-team-nav">
//             {Object.keys(teamsData).map((teamKey) => (
//               <button
//                 key={teamKey}
//                 className="project-button"
//                 onClick={() => setSelectedTeam(teamKey)}
//               >
//                 {teamsData[teamKey].teamDetails.teamName}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="team-members">
//           {teamsData[selectedTeam].members.map((member, index) => (
//             <div key={index} className="person-card">
//               <div className="img-wrapper">
//                 <img src={member.img} alt={member.name} />
//               </div>
//               <p className="description-box-proj">
//                 <b>{member.name}</b><br />
//                 {member.role} <br />
//                 {member.text || '[Text]'}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectTeams;