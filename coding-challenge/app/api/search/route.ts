import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Fetch listings with pagination
    const listings = await prisma.listing.findMany({
      skip: offset,
      take: limit,
    });

    // Get total count for pagination info
    const total = await prisma.listing.count();

    return NextResponse.json({
      listings,
      pagination: {
        offset,
        limit,
        total,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
