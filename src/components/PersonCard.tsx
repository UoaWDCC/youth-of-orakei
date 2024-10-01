import React from "react";
import "../styles/global.css";
import "../styles/members.css";

interface PersonCardProps {
  team: string;
  desc: string;
  name: string;
  cover: string | null;
  color: string;
}

const PersonCard: React.FC<PersonCardProps> = ({ team, desc, name, cover, color }) => {
  let className = "";
  if (team.startsWith("Projects: ")) {
    className = 'description-box-proj';
  }

  return (
    <div className="person-card">
      <div className="img-wrapper">
        {cover ? (  // Conditional rendering based on cover value
          <img src={cover} alt={name} />
        ) : (
          <div className="placeholder-cover">No Image Available</div> // Placeholder div or component
        )}
      </div>
      <p className={className} style={{ backgroundColor: `var(${color})` }}>
   
        <b>{name}</b><br />
        {team}<br />
        {desc}
      </p>
    </div>
  );
};

export default PersonCard;
