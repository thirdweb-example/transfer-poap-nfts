import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto

export async function POST(request: Request) {
	const body = await request.json();
	if (!body) return new Response("No body");
	const url = body.url;
	if (!url) return new Response("No url");
	const options = {
		method: "GET",
		headers: {
			"X-API-KEY": process.env.SIMPLEHASH_API_KEY as string,
		},
	};
	const response = await fetch(url, options);
	if (response.status >= 400) {
		throw new Error(response.statusText);
	}
	const parsedResponse = await response.json();
	return Response.json(parsedResponse);
}
