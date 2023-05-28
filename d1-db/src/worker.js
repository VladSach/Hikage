export default {
	async fetch(request, env) {
    	const { pathname } = new URL(request.url);

    	if (pathname === "/api/shared") {
    		const { results } = await env.DB.prepare(
        		"SELECT * FROM Shared"
        	)
        		.all();
    		return Response.json(results);
    	}

    	return new Response(
    		"Use /api/shared"
    	);
	},
};
