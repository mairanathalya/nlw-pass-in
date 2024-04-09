export function generateSlug (text: string): string {
    return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") //remove accents
    .toLowerCase() //leave it in lowercase
    .replace(/[^\w\s-]/g, "") //replaces characters that are not letters, spaces or hyphens with an empty string
    .replace(/\s+/g, "-"); //remove symbols and spaces for hyphen
}