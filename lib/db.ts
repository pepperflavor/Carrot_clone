import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function test() {
  const token = await db.sMSToken.findUnique({
    where: {
      id: 1,
    },
  });

}

test();

export default db;
