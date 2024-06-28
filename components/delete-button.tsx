"use client";

import db from "@/lib/db";
import deleteProduct from "@/lib/products/deleteProducts";
import { redirect } from "next/navigation";

interface DeleteButtonProps {
  userId: number;
  isOwner: boolean;
}

export default function DeleteButton({ userId, isOwner }: DeleteButtonProps) {
  const onDelete = async () => {
    deleteProduct(userId, isOwner);
  };
  return (
    <form action={onDelete}>
      <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
        상품 삭제
      </button>
    </form>
  );
}
