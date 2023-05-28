export async function GET(event) {
    const response = await fetch('https://d1-db.vladsach.workers.dev/api/shared');
    const { shaders } = await response.json();
    return new Response(response);
}

export async function POST(event) {
    const data = await event.request.formData();

    console.log(data.get('title'));

    if (data.get('author'))
        console.log(data.get('author'));

    if (data.get('vertex')) {
        console.log(data.getAll('vertex')[1]);
    }

    if (data.get('pixel')) {
        console.log(data.getAll('pixel')[1]);
    }

    return new Response(
        JSON.stringify({success: true}), {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}
