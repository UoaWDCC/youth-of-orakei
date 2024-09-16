type ProjectData = {
  team: string;
  desc: string;
  name: string;
  cover: string;
  url?: string;
}

export function sortProjectsByTeam(projects: ProjectData[]) {
  const team1: ProjectData[] = [];
  const team2: ProjectData[] = [];
  const team3: ProjectData[] = [];
  const team4: ProjectData[] = [];

  projects.forEach(project => {
    if (project.team === "Team 1") {
      team1.push(project);
    } else if (project.team === "Team 2") {
      team2.push(project);
    } else if (project.team === "Team 3") {
      team3.push(project);
    }
    else if (project.team === "Team 4") {
      team4.push(project);
    }
  });


  return { team1, team2, team3, team4 };
}