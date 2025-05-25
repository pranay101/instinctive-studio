const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

async function seed() {
  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await prisma.listing.deleteMany();
    await prisma.category.deleteMany();

    // Read the data file
    console.log("Reading data file...");
    const dataPath = path.join(__dirname, "database", "data.json");
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found at ${dataPath}`);
    }
    const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

    // Create categories first
    console.log("Creating categories...");
    const createdCategories = [];
    for (const category of data.categories) {
      const createdCategory = await prisma.category.create({
        data: {
          name: category.name,
          slug: category.slug,
          attributeSchema: category.attributeSchema,
        },
      });
      createdCategories.push(createdCategory);
    }

    // Create a map of category slugs to IDs
    const categoryMap = createdCategories.reduce((acc, cat) => {
      acc[cat.slug] = cat.id;
      return acc;
    }, {});

    // Create listings
    console.log("Creating listings...");
    for (const listing of data.listings) {
      const categoryId = categoryMap[listing.categoryId];
      if (!categoryId) {
        console.warn(
          `Warning: Category ${listing.categoryId} not found for listing ${listing.title}`
        );
        continue;
      }
      await prisma.listing.create({
        data: {
          title: listing.title,
          description: listing.description,
          price: listing.price,
          location: listing.location,
          categoryId: categoryId,
          attributes: listing.attributes,
          imageUrl: listing.imageUrl,
        },
      });
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

seed()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
