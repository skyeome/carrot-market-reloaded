"use server";

import { redirect } from "next/navigation";
import db from "../db";

const deleteProduct = async (id: number, isOwner: boolean) => {
  if (!isOwner) return;
  await db.product.delete({
    where: { id },
  });
  redirect("/home");
};

export default deleteProduct;
