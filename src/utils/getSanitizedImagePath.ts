import sanitizeFilename from "./sanitizeFilename";

export default function getSanitizedImagePath (team: string, name: string) {
    const sanitizedTeam = sanitizeFilename(team);
    const sanitizedName = sanitizeFilename(name);
    const imageFilename = `${sanitizedTeam}_${sanitizedName}.webp`; // Construct the image filename
    return `/members/${imageFilename}`; // Return the path
  };