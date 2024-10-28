import { NextResponse } from "next/server";

export function GET() {
    return NextResponse.json({message: "Testing route" }, { status: 200});
}
