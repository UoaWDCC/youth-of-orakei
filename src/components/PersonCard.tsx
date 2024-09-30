import React, { useEffect, useState }  from "react";
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
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/images/${cover}`);
        if (!response.ok) throw new Error('Image not found');
        const blob = await response.blob();
        setImageSrc(URL.createObjectURL(blob));
      } catch (error) {
        console.error(error);
      }
    };

    fetchImage();
  }, [cover]);

  return (
    <div className="person-card">
      <div className="img-wrapper">
        {imageSrc ? <img src={imageSrc} alt={name} /> : <p>Loading...</p>} {/* Show loading state */}
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
