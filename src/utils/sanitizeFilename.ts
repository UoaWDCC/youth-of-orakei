export default function sanitizeFilename(name: string): string {
    return name
        .replace(/[:\/\\?*|"<>#]/g, '_') // Replace invalid characters including #
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/_+/g, '_') // Replace multiple underscores with a single underscore
        .toLowerCase(); // Optionally, convert to lowercase
}
