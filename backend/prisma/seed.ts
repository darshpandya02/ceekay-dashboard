import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Seeds a PUBLIC DEMO: one demo admin account and synthetic sales data.
// Every product name and figure below is made up; none of it is real company data.
const prisma = new PrismaClient(
  process.env.CEEKAY_DATABASE_URL ? { datasourceUrl: process.env.CEEKAY_DATABASE_URL } : undefined
);

export const DEMO_EMAIL = 'demo@ceekay-demo.dev';
export const DEMO_PASSWORD = 'demo-dashboard-2026';

const products = [
  { productName: 'Demo Compound A', category: 'Chemicals', base: 1800000, unitPrice: 42 },
  { productName: 'Demo Compound B', category: 'Chemicals', base: 1250000, unitPrice: 65 },
  { productName: 'Demo Salt C', category: 'Chemicals', base: 900000, unitPrice: 30 },
  { productName: 'Demo Organic Blend D', category: 'Organic', base: 1400000, unitPrice: 55 },
  { productName: 'Demo Humic Flakes E', category: 'Organic', base: 700000, unitPrice: 80 },
  { productName: 'Demo Polymer F', category: 'Polymers', base: 1000000, unitPrice: 210 },
  { productName: 'Demo Additive G', category: 'Additives', base: 450000, unitPrice: 120 },
];

// Deterministic pseudo-random so re-seeding gives the same charts
let seed = 42;
const rand = () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

function buildYear(year: number, growth: number) {
  const rows = [];
  for (const p of products) {
    for (let month = 1; month <= 12; month++) {
      const seasonal = 1 + 0.25 * Math.sin(((month - 3) / 12) * 2 * Math.PI);
      const salesAmount = Math.round(p.base * growth * seasonal * (0.8 + 0.4 * rand()) * 100) / 100;
      rows.push({
        productName: p.productName,
        category: p.category,
        salesAmount,
        month,
        year,
        quantity: Math.round(salesAmount / p.unitPrice),
        unitPrice: p.unitPrice,
      });
    }
  }
  return rows;
}

async function main() {
  console.log('Seeding demo database...');

  const hashedPassword = await bcrypt.hash(DEMO_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { password: hashedPassword, role: UserRole.ADMIN, name: 'Demo Admin' },
    create: { name: 'Demo Admin', email: DEMO_EMAIL, password: hashedPassword, role: UserRole.ADMIN },
  });

  // Reset demo sales data (this only touches this app's own tables)
  await prisma.salesData.deleteMany({});
  await prisma.uploadLog.deleteMany({});
  await prisma.salesData.createMany({ data: [...buildYear(2024, 1.0), ...buildYear(2025, 1.15)] });

  const count = await prisma.salesData.count();
  console.log(`Seeded ${count} synthetic sales rows`);
  console.log(`Demo admin: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
