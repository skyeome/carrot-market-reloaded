"use server";

import { PAGE_PER_VIEW } from "@/lib/constants";
import db from "@/lib/db";

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    skip: page * PAGE_PER_VIEW,
    take: PAGE_PER_VIEW,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
