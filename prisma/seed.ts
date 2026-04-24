/* Seed script for Resin Studio. Run `npm run db:seed` after `npm run db:push`. */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    slug: "aurora-ocean-coasters",
    title: "Aurora ocean resin coasters (set of 4)",
    description:
      "Hand-poured set of four resin coasters inspired by Ghana's Atlantic coast. Each piece is unique, heat-resistant to 90°C, and finished with cork feet.",
    priceMinor: 18000,
    category: "resin",
    stock: 12,
    customizable: true,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1617791160588-241658c0f566?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "geode-resin-tray",
    title: "Geode resin serving tray",
    description:
      "A striking centrepiece tray with gold leaf inlay. Perfect for a coffee table or for serving drinks at small gatherings. Dimensions: 35 × 22 cm.",
    priceMinor: 42000,
    category: "resin",
    stock: 5,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1614699055715-33127fdcf92f?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "kente-print-gift-box",
    title: "Kente print gift box (medium)",
    description:
      "Hand-folded rigid gift box with a Kente-inspired wrap. Fits a mug, candle, and two small accessories. Comes flat-packed with magnetic closure.",
    priceMinor: 8500,
    category: "gift-box",
    stock: 50,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "corporate-hamper-bag",
    title: "Corporate hamper gift bag",
    description:
      "Elegant paper gift bag with reinforced rope handles, ideal for corporate hampers and client appreciation. Available in black, ivory, and burgundy. Min. order 10 units.",
    priceMinor: 2500,
    category: "gift-box",
    stock: 200,
    customizable: true,
    images: [
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "custom-tshirt-premium",
    title: "Custom T-shirt — premium cotton",
    description:
      "Upload your design or send us your idea. DTF print on 200 gsm premium cotton tee. Colour-fast up to 30 washes. Sizes S–XXL.",
    priceMinor: 12000,
    category: "tshirt",
    stock: 100,
    customizable: true,
    featured: true,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "personalised-mug",
    title: "Personalised ceramic mug (330 ml)",
    description:
      "Add a name, photo, or short quote. Full-colour sublimation print, microwave and dishwasher safe. Gift-box packaging available at checkout.",
    priceMinor: 6500,
    category: "mug",
    stock: 80,
    customizable: true,
    images: [
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "shea-vanilla-candle",
    title: "Shea & vanilla soy candle",
    description:
      "Hand-poured soy-wax candle with warm notes of shea butter, vanilla, and a hint of orange blossom. 40-hour burn time. 250 g.",
    priceMinor: 9000,
    category: "candle",
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1602874801007-aa24819984c4?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  {
    slug: "lemongrass-ginger-candle",
    title: "Lemongrass & ginger soy candle",
    description:
      "A bright, uplifting blend perfect for work-from-home afternoons. Cotton wick, 35-hour burn, travel tin format.",
    priceMinor: 7500,
    category: "candle",
    stock: 40,
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80",
    ],
  },
];

const GALLERY = [
  { title: "Ocean pour, May batch", imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=900&q=80", tag: "resin" },
  { title: "Wedding hamper build", imageUrl: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80", tag: "gift" },
  { title: "Candle curing shelf", imageUrl: "https://images.unsplash.com/photo-1602874801007-aa24819984c4?auto=format&fit=crop&w=900&q=80", tag: "candle" },
  { title: "Custom T-shirt commission", imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80", tag: "print" },
  { title: "Geode tray finish", imageUrl: "https://images.unsplash.com/photo-1614699055715-33127fdcf92f?auto=format&fit=crop&w=900&q=80", tag: "resin" },
  { title: "Kente gift boxes", imageUrl: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80", tag: "gift" },
  { title: "Mug personalisation station", imageUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80", tag: "print" },
  { title: "Lemongrass candle pour", imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80", tag: "candle" },
];

const COURSES = [
  {
    slug: "resin-foundations",
    title: "Resin Foundations — from first pour to finished piece",
    summary: "Everything a beginner needs to pour their first resin coaster safely and beautifully.",
    description: `Learn resin casting from scratch, in the Ghanaian context.

We cover safety (ventilation, PPE, skin protection), sourcing resin and pigments locally, mould prep, the golden mixing ratio, bubble removal without a pressure pot, de-moulding, sanding, and finishing.

By the end of the course you'll have poured three finished pieces (a coaster, a keyring, and a small tray) and you'll know how to price your work.`,
    priceMinor: 25000,
    coverImage: "https://images.unsplash.com/photo-1580651315530-69c8e0903883?auto=format&fit=crop&w=1400&q=80",
    lessons: [
      { title: "Welcome & what you'll make", description: "A tour of the course and the three finished pieces we'll build.", preview: true, order: 0 },
      { title: "Safety & workspace setup", description: "PPE, ventilation, and workspace prep for home studios.", order: 1 },
      { title: "Sourcing resin in Ghana", description: "Where to buy epoxy, pigments, and moulds locally and online.", order: 2, pdfUrl: "/guides/sourcing-guide.pdf" },
      { title: "Your first coaster pour", description: "Step-by-step pour with a layered ocean effect.", order: 3 },
      { title: "Finishing: sanding & polishing", description: "Wet sanding from 400–3000 grit, then buffing to a glass finish.", order: 4 },
      { title: "Pricing your work", description: "A simple formula to price resin pieces for the Ghanaian market.", order: 5, pdfUrl: "/guides/pricing-worksheet.pdf" },
    ],
  },
  {
    slug: "candle-making-essentials",
    title: "Candle Making Essentials — soy wax & natural fragrance",
    summary: "Pour clean-burning soy candles with natural fragrance blends you can sell or gift.",
    description: `A hands-on course covering soy vs. paraffin, wick selection (and why it's the #1 mistake beginners make), fragrance load calculations, and pouring temperature.

You'll finish the course with six candles in two different vessels, a fragrance blend you actually love, and a troubleshooting checklist you can print.`,
    priceMinor: 18000,
    coverImage: "https://images.unsplash.com/photo-1602874801007-aa24819984c4?auto=format&fit=crop&w=1400&q=80",
    lessons: [
      { title: "Introduction", description: "Why soy, and what you'll pour by the end.", preview: true, order: 0 },
      { title: "Tools & ingredients", description: "What to buy and what to skip.", order: 1 },
      { title: "Wick selection", description: "Sizing wicks for your vessel diameter.", order: 2, pdfUrl: "/guides/wick-chart.pdf" },
      { title: "Your first pour", description: "Melting, fragrance adding, and pouring temperature.", order: 3 },
      { title: "Curing & troubleshooting", description: "Frosting, sinkholes, tunnelling — and how to fix them.", order: 4 },
    ],
  },
  {
    slug: "starter-guide-free",
    title: "Starter Guide — free PDF & intro video",
    summary: "Not sure resin is for you? Start here — a free intro video and PDF supply checklist.",
    description: "A free taster lesson plus a downloadable supply checklist. Great for anyone deciding whether to invest in a full course.",
    priceMinor: 0,
    coverImage: "https://images.unsplash.com/photo-1617791160588-241658c0f566?auto=format&fit=crop&w=1400&q=80",
    lessons: [
      { title: "Is resin art for you?", description: "A 10-minute intro video.", preview: true, order: 0 },
      { title: "Supply checklist", description: "Everything you need to start with less than GH₵ 1,500.", order: 1, pdfUrl: "/guides/starter-checklist.pdf" },
    ],
  },
];

async function main() {
  console.log("Seeding…");

  await prisma.product.deleteMany({});
  await prisma.galleryItem.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.course.deleteMany({});

  for (const p of PRODUCTS) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        title: p.title,
        description: p.description,
        priceMinor: p.priceMinor,
        category: p.category,
        stock: p.stock,
        customizable: p.customizable ?? false,
        featured: p.featured ?? false,
        images: JSON.stringify(p.images),
      },
    });
  }

  for (let i = 0; i < GALLERY.length; i++) {
    const g = GALLERY[i];
    await prisma.galleryItem.create({
      data: { title: g.title, imageUrl: g.imageUrl, tag: g.tag, order: i },
    });
  }

  for (const c of COURSES) {
    await prisma.course.create({
      data: {
        slug: c.slug,
        title: c.title,
        summary: c.summary,
        description: c.description,
        priceMinor: c.priceMinor,
        coverImage: c.coverImage,
        lessons: {
          create: c.lessons.map((l) => ({
            title: l.title,
            description: l.description,
            order: l.order,
            preview: l.preview ?? false,
            pdfUrl: l.pdfUrl,
          })),
        },
      },
    });
  }

  // Create a demo admin/student for quick testing
  if (!(await prisma.user.findUnique({ where: { email: "demo@resinstudio.gh" } }))) {
    await prisma.user.create({
      data: {
        email: "demo@resinstudio.gh",
        name: "Demo Student",
        passwordHash: await bcrypt.hash("demostudent123", 12),
        role: "student",
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
