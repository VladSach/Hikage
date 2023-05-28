export async function GET({event}) {
    return new Response('Hello');
}


export async function POST(event) {
    const data = await event.request.formData();

    console.log(data);

    return new Response(
        JSON.stringify({success: true}),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}
