import type { memberData } from "../types/memberData";

type TeamDetails = {
  teamName: string;
  description: string;
  teamId: string;
};

export function sortMembersByTeam(members: memberData[]) {
  const leadershipTeam: memberData[] = [];
  const communicationTeam: memberData[] = [];
  // const projectsMap: { [projectName: string]: MemberData[] } = {};
  const teamsDict: { [team: string]: memberData[] } = {};
  const projectsMap: { [projectName: string]: { teamDetails: TeamDetails; members: memberData[] } } = {};
  let nextProjectId: number = 1; // Start ID counter at 0

  members.forEach(member => {
    // if (member.team === "Leadership Team") {
    //   leadershipTeam.push(member);
    // } else if (member.team === "Communication Team") {
    //   communicationTeam.push(member);
    // } else
    if (member.team.startsWith("Projects:")) {
      const projectName: string = member.team.replace("Projects: ", "");
      if (!projectsMap[projectName]) {
        projectsMap[projectName] = {
          teamDetails: { teamName: projectName, description: member.description, teamId: "team" + nextProjectId.toString() },
          members: []
        };
        nextProjectId++;
      }
      projectsMap[projectName].members.push(member);
    } else {
      let teamName: string = member.team;
      if (!(teamName in teamsDict)) {
        teamsDict[teamName] = [member];
      } else {
        teamsDict[teamName].push(member);
      }
    }
  });

  const projects = Object.values(projectsMap);

  return { teamsDict, projects };
}