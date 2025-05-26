import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get("category");

    if (!categorySlug) {
      return NextResponse.json(
        { message: "Category parameter is required" },
        { status: 400 }
      );
    }

    // Get the category first
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    // Get attributes and values using findMany
    const [attributes, attributeValues] = await Promise.all([
      prisma.categoryAttribute.findMany({
        where: { categoryId: category.id },
        orderBy: { order: "asc" },
      }),
      prisma.categoryAttributeValues.findMany({
        where: { categoryId: category.id },
      }),
    ]);

    // Transform the data to combine attributes with their possible values
    const transformedAttributes = attributes.map((attr) => {
      const values = attributeValues.find((av) => av.attribute === attr.name);
      return {
        name: attr.name,
        type: attr.type,
        required: attr.required,
        description: attr.description,
        order: attr.order,
        values: values?.values || [],
      };
    });

    return NextResponse.json({
      category: {
        name: category.name,
        slug: category.slug,
      },
      attributes: transformedAttributes,
    });
  } catch (error) {
    console.error("Error fetching category attributes:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
