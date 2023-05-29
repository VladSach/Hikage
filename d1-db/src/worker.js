export default {
	async fetch(request, env) {
    	const { pathname } = new URL(request.url);

    	if (pathname === '/api/shared') {
    		if (request.method === 'GET') {
    			const { results } = await env.DB.prepare(
        			"SELECT * FROM Shared"
        		)
        			.all();

    			return new Response(JSON.stringify(results), {
    				headers: {'Content-Type': 'application/json'},
    			});
    		} else if (request.method === 'POST') {
				const data = await request.json();
				const { title, author, vertex, pixel, slug } = data;

				if (!title) {
        			return new Response('Title is required', { status: 400 });
        		}

        		if (!vertex && !pixel) {
        			return new Response(
            			'Either vertex shader or pixel shader is required',
            			{ status: 400 }
        			);
        		}

        		const info = await env.DB.prepare(
        			'INSERT INTO Shared (title, author, vertex, pixel, slug)\
        			 VALUES (?, ?, ?, ?, ?)'
        		)
        			.bind(title, author || 'anonymous',
        				  vertex || null, pixel || null, slug)
        			.run();

				return new Response('Shaders added successfully.', {
        			status: 201,
        			headers: { 'Content-Type': 'text/plain' },
        		});
    		}
    	} else if (pathname.startsWith('/api/shared/')) {
    		const slug = pathname.substring("/api/shared/".length);

    		const { results } = await env.DB.prepare(
        		"SELECT * FROM Shared WHERE slug = ?"
    		)
    			.bind(slug)
    			.all();

    		if (results) {
        		return new Response(JSON.stringify(results), {
        			headers: { "Content-Type": "application/json" },
        		});
    		} else {
        		return new Response(JSON.stringify({ error: "Not found" }), {
        			status: 404,
        			headers: { "Content-Type": "application/json" },
        		});
    		}
    	}

    	return new Response(
    		"Use /api/shared in order to access DB"
    	);
	},
};
