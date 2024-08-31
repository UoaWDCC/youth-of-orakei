type ProjectData = {
  team: string;
  desc: string;
  name: string;
  cover: string;
  url?: string;
}

type ProjectDetails = {
  teamName: string;
  description: string;
  teamId: string;
};

export function sortMembersByTeam(projects: ProjectData[]) {
  const leadershipTeam: ProjectData[] = [];
  const communicationTeam: ProjectData[] = [];
  const projectsMap: { [projectName: string]: { teamDetails: ProjectDetails; members: ProjectData[] } } = {};
  let nextProjectId = 1; // Start ID counter at 0

  projects.forEach(project => {
    if (project.team === "Leadership Team") {
      leadershipTeam.push(project);
    } else if (project.team === "Communication Team") {
      communicationTeam.push(project);
    } else if (project.team.startsWith("Projects:")) {
      const projectName = project.team.replace("Projects: ", "");
      if (!projectsMap[projectName]) {
        projectsMap[projectName] = {
          teamDetails: { teamName: projectName, description: project.desc, teamId: "team" + nextProjectId.toString() },
          members: []
        };
        nextProjectId++;
      }
      projectsMap[projectName].members.push(project);
    }
  });

  const projectsTeam = Object.values(projectsMap);

  return { leadershipTeam, communicationTeam, projectsTeam };
}