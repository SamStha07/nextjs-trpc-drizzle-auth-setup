// import { db } from '@/db';
// import { categories } from '@/db/schema';
import { createTRPCRouter } from '@/trpc/init';

export const authRouter = createTRPCRouter({
  // getMany: publicProcedure.query(async () => {
  //   const data = await db.select().from(categories);
  //   return data;
  // }),
});
