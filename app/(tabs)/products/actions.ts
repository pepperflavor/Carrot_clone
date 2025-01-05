"use server";

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
    // 페이지 스킵, 페이지 사이즈만큼
    skip: page * 1,
    take: 1, // 1페이지당 보여줄 데이터 수
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}
