type MemberData = {
  team: string;
  desc: string;
  name: string;
  cover: string;
  url?: string;
}

type TeamDetails = {
  teamName: string;
  description: string;
  // teamId: string;
  teamId: string;
};

export function sortMembersByTeam(members: MemberData[]) {
  const leadershipTeam: MemberData[] = [];
  const communicationTeam: MemberData[] = [];
  // const projectsMap: { [projectName: string]: MemberData[] } = {};
  const projectsMap: { [projectName: string]: { teamDetails: TeamDetails; members: MemberData[] } } = {};
  let nextProjectId = 1; // Start ID counter at 0

  members.forEach(member => {
    if (member.team === "Leadership Team") {
      leadershipTeam.push(member);
    } else if (member.team === "Communication Team") {
      communicationTeam.push(member);
    } else if (member.team.startsWith("Projects:")) {
      const projectName = member.team.replace("Projects: ", "");
      if (!projectsMap[projectName]) {
        projectsMap[projectName] = {
          teamDetails: { teamName: projectName, description: member.desc, teamId: "team" + nextProjectId.toString() },
          members: []
        };
        nextProjectId++;
      }
      projectsMap[projectName].members.push(member);
    }
  });

  const projects = Object.values(projectsMap);

  return { leadershipTeam, communicationTeam, projects };
}