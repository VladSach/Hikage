export function slugify(text) {
    return text
        .replace(/\s/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .toLowerCase()
        + Math.floor(100000 + Math.random() * 900000); // random 6-digit number
}
