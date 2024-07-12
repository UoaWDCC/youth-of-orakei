type MemberData = {
  team: string;
  desc: string;
  name: string;
  cover: string;
  url?: string;
}

export function sortMembersByTeam(members: MemberData[]) {
  const leadershipTeam: MemberData[] = [];
  const communicationTeam: MemberData[] = [];
  const projectsMap: { [projectName: string]: MemberData[] } = {};
  members.forEach(member => {
    if (member.team === "Leadership Team") {
      leadershipTeam.push(member);
    } else if (member.team === "Communication Team") {
      communicationTeam.push(member);
    } else if (member.team.startsWith("Projects:")) {
      const projectName = member.team.replace("Projects: ", "");
      if (!projectsMap[projectName]) {
        projectsMap[projectName] = [];
      }
      projectsMap[projectName].push(member);
    }
  });

  const projects = Object.values(projectsMap);

  return { leadershipTeam, communicationTeam, projects };
}