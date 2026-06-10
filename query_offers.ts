import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
p.platformOffer.findMany()
  .then(data => {
    console.log("PLATFORM OFFERS IN DB:");
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(console.error)
  .finally(() => p.$disconnect());
