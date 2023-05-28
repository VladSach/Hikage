export async function GET(event) {
    const ps = event.env.NORTHWIND_DB.prepare('SELECT * FROM Shared');
    const data = await ps.first();

    return Response.json(data);
}
