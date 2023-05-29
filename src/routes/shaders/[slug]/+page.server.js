import { DATABASE_URL } from '$env/static/private';

export async function load({ params }) {
    const response = await fetch(DATABASE_URL + '/' + params.slug);
    const shader = (await response.json())[0];

    return shader;
}
