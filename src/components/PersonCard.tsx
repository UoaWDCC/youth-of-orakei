import React from "react";
import "../styles/global.css";
import "../styles/members.css";

interface PersonCardProps {
  team: string;
  desc: string;
  name: string;
  cover: string;
}

const getClassName = (team: string) => {
  switch (team) {
    case "Leadership Team":
      return 'description-box-lead';
    case 'Communication Team':
      return 'description-box-coms';
    case "Projects: Fermata":
    case "Projects: Legato":
    case "Projects: Schmetterlinge":
    case "Projects: The Gaggle":
      return 'description-box-proj';
    default:
      return '';
  }
};

const PersonCard: React.FC<PersonCardProps> = ({ team, desc, name, cover }) => {
  const className = getClassName(team);

  return (
    <div className="person-card">
      <div className="img-wrapper">
        <img src={cover} alt={name} />
      </div>
      <p className={className}>
        <b>{name}</b><br />
        {team}<br />
        {desc}
      </p>
    </div>
  );
};

export default PersonCard;
