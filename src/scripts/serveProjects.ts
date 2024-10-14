import { prisma } from "../lib/prisma";



export async function serveProjects(): Promise<{ projects: any[], carouselList: any[] }> {
  try {
    const projects = await prisma.project.findMany({
      include: {
        tags: true, 
      },
    });

    const carouselProjects: any[] = [];

    const nonCarouselProjects = projects.filter((project: typeof projects[0]) => {
      const title = project.title.toLowerCase();

      if (title.includes("carousel content")) { 
        const numberMatch = title.match(/carousel content #(\d+)/);
        const carouselNumber = numberMatch ? parseInt(numberMatch[1], 10) : 0;
        const heading = project.title.replace(/\(carousel content\)/i, '').trim();
        carouselProjects.push({
          ...project,
          title: heading, 
          carouselNumber  
        });

        return false;
      }

      return true; 
    });

   
    const sortedCarouselProjects = carouselProjects.sort((a, b) => a.carouselNumber - b.carouselNumber);
   
    return { 
      projects: nonCarouselProjects, 
      carouselList: sortedCarouselProjects
    };
  } catch (error) {
    console.error("Error fetching projects and carousel list:", error);
    throw error;
  }
}
