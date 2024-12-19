import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // console.log(request);

  return Response.json({
    ok: true,
    say: "hello",
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  return Response.json(data);
}
