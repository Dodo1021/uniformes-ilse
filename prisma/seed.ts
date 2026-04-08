import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const UNIFORM_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const SHOE_SIZES = ["22", "23", "24", "24.5", "25", "25.5", "26", "27"];

async function main() {
  // Categorías
  const uniformes = await prisma.category.upsert({
    where: { slug: "uniformes" },
    update: {},
    create: { name: "Uniformes Quirúrgicos", slug: "uniformes" },
  });

  const zapatos = await prisma.category.upsert({
    where: { slug: "zapatos" },
    update: {},
    create: { name: "Zapatos de Hospital", slug: "zapatos" },
  });

  // Productos
  const productos = [
    {
      name: "Uniforme quirúrgico scrubs unisex azul marino",
      description:
        "Conjunto de scrubs unisex en azul marino, tela antifluidos, ligera y de secado rápido. Bolsillos amplios y costuras reforzadas.",
      price: 380,
      categoryId: uniformes.id,
      sizes: UNIFORM_SIZES,
      stock: 15,
      images: ["/seed/scrubs-azul.svg"],
    },
    {
      name: "Uniforme quirúrgico scrubs verde quirófano",
      description:
        "Scrubs en verde quirófano clásico, tela antifluidos transpirable. Ideal para jornadas largas en hospital.",
      price: 380,
      categoryId: uniformes.id,
      sizes: UNIFORM_SIZES,
      stock: 12,
      images: ["/seed/scrubs-verde.svg"],
    },
    {
      name: "Conjunto scrubs mujer lila",
      description:
        "Conjunto entallado para mujer en color lila. Cuello en V, pantalón con pretina ajustable.",
      price: 420,
      categoryId: uniformes.id,
      sizes: ["XS", "S", "M", "L", "XL"],
      stock: 8,
      images: ["/seed/scrubs-lila.svg"],
    },
    {
      name: "Zapato de hospital blanco antiderrapante",
      description:
        "Zapato profesional blanco con suela antiderrapante, plantilla acolchada y soporte de arco.",
      price: 650,
      categoryId: zapatos.id,
      sizes: SHOE_SIZES,
      stock: 10,
      images: ["/seed/zapato-blanco.svg"],
    },
    {
      name: "Zueco hospitalario negro con arco",
      description:
        "Zueco hospitalario negro con soporte ortopédico de arco. Lavable y resistente a fluidos.",
      price: 580,
      categoryId: zapatos.id,
      sizes: ["23", "24", "24.5", "25", "25.5", "26"],
      stock: 7,
      images: ["/seed/zueco-negro.svg"],
    },
  ];

  for (const p of productos) {
    const slug = slugify(p.name);
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: { ...p, slug },
    });
  }

  // Settings
  await prisma.setting.upsert({
    where: { key: "mp_status" },
    update: {},
    create: { key: "mp_status", value: "unconfigured" },
  });

  console.log("✅ Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
