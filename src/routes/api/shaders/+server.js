import { json } from '@sveltejs/kit'
import { DATABASE_URL } from '$env/static/private';

export async function GET(event) {
    const response = await fetch(DATABASE_URL);

    event.setHeaders({
        'Cache-Control': 'pulbic, max-age=0, s-maxage=60'
    });

    const shaders = await response.json();
    return json(shaders);
}

export async function POST(event) {
    const data = await event.request.formData();

    const response = await fetch(DATABASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: data.get('title'),
            author: data.get('author'),
            vertex: data.getAll('vertex')[1],
            pixel: data.getAll('pixel')[1],
            slug: data.get('slug'),
        }),
    });

    return response;
}
