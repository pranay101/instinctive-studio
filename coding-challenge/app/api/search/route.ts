import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const offset = parseInt(searchParams.get("offset") || "0");
    const limit = parseInt(searchParams.get("limit") || "10");
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("q");

    let filter: Record<string, any> = {};
    try {
      filter = JSON.parse(searchParams.get("filters") || "{}");
    } catch {
      return NextResponse.json(
        { message: "Invalid filters format" },
        { status: 400 }
      );
    }

    // MongoDB-style filter
    const mongoFilter: any = {};

    // Add search on title or description first if present
    if (search && search.trim() !== "") {
      mongoFilter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    } else {
      // If no search, then use category
      const category = await prisma.category.findUnique({
        where: {
          slug: categorySlug || "",
        },
      });

      if (!category) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        );
      }

      mongoFilter.categoryId = category.id;
    }

    // Add dynamic attribute filters
    for (const [key, value] of Object.entries(filter)) {
      mongoFilter[`attributes.${key}`] = value;
    }

    // Fetch listings
    const listings = await prisma.listing.findRaw({
      filter: mongoFilter,
      options: {
        skip: offset,
        limit: limit,
      },
    });

    // Count total matching listings (for pagination)
    const countResult = await prisma.listing.aggregateRaw({
      pipeline: [{ $match: mongoFilter }, { $count: "total" }],
    });

    const total = countResult?.[0]?.total ?? 0;

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
