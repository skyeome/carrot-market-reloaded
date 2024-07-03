"use server";

import db from "../db";
import getSession from "../session/getSession";

export async function getIsOwner(userId: number) {
  // const session = await getSession();
  // if (session.id) {
  //   return session.id === userId;
  // }
  return false;
}

export async function getProduct(id: number) {
  console.log("get product detail");
  const product = await db.product.findUnique({
    where: { id },
    include: { user: { select: { username: true, avatar: true } } },
  });
  return product;
}

export async function getProductTitle(id: number) {
  console.log("get product title!");
  const product = await db.product.findUnique({
    where: { id },
    select: { title: true },
  });
  return product;
}
