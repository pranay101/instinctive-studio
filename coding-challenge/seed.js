const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const prisma = new PrismaClient();

// Predefined attribute values for categories
const categoryAttributeValues = {
  "running-shoes": {
    brand: ["Nike", "Adidas", "Puma", "New Balance", "Asics", "Brooks", "Hoka"],
    size: [
      "7",
      "7.5",
      "8",
      "8.5",
      "9",
      "9.5",
      "10",
      "10.5",
      "11",
      "11.5",
      "12",
    ],
    color: ["Black", "White", "Blue", "Red", "Gray", "Green", "Orange"],
    condition: ["new", "used", "like-new"],
  },
  televisions: {
    brand: ["Samsung", "LG", "Sony", "TCL", "Hisense", "Vizio"],
    screenSize: [
      "43 inch",
      "48 inch",
      "50 inch",
      "55 inch",
      "65 inch",
      "70 inch",
      "75 inch",
      "85 inch",
    ],
    resolution: ["4K UHD", "8K"],
    condition: ["new", "used", "refurbished"],
  },
};

async function seed() {
  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await prisma.listing.deleteMany();
    await prisma.categoryAttribute.deleteMany();
    await prisma.categoryAttributeValues.deleteMany();
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

      // Create category attributes
      console.log(`Creating attributes for category: ${category.name}`);
      const attributeEntries = Object.entries(category.attributeSchema);
      for (let i = 0; i < attributeEntries.length; i++) {
        const [name, schema] = attributeEntries[i];
        await prisma.categoryAttribute.create({
          data: {
            categoryId: createdCategory.id,
            name,
            type: schema.type,
            required: schema.required || false,
            enum: schema.enum ? schema.enum : null,
            description: `Attribute for ${name} in ${category.name}`,
            order: i + 1,
          },
        });

        // Create category attribute values
        if (categoryAttributeValues[category.slug]?.[name]) {
          await prisma.categoryAttributeValues.create({
            data: {
              categoryId: createdCategory.id,
              attribute: name,
              values: categoryAttributeValues[category.slug][name],
            },
          });
        }
      }
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
