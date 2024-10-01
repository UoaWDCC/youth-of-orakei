import prisma from "../lib/prisma"
// Define the CarouselItem type
type CarouselItem = {
  heading: string;
  subheadings: string[];
  paragraphs: string[];
  images: string[];
};

export async function serveProjects(): Promise<{ projects: any[], carouselList: CarouselItem[] }> {
  try {
    // Fetch the projects from the Prisma database
    const projects = await prisma.project.findMany({
      include: {
        tags: true, // Include tags related to the project
      },
    });

    // Initialize the carousel list with the defined type
    const carouselList: CarouselItem[] = [];

    // Filter projects that contain "carousel content" in the title
    const nonCarouselProjects = projects.filter((project: typeof projects[0]) => {
      if (project.title.toLowerCase().includes("carousel content")) {
        // Extract carousel-related content
        const { description, cover } = project;

        const subheadings = description ? [description] : [];
        const paragraphs = [description]; // For simplicity, using description as a placeholder
        const images = cover ? [cover] : []; // Assuming cover is used as an image

        carouselList.push({
          heading: project.title,
          subheadings,
          paragraphs,
          images,
        });

        return false; 
      }

      return true; 
    });

    return { projects: nonCarouselProjects, carouselList };
  } catch (error) {
    console.error("Error fetching projects and carousel list:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
