"use client";

import { InitialProducts } from "@/app/(tabs)/products/page";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/products/actions";

// 이렇게 받아오면 db에서 받아오는 값이 변경되었을때 자동으로 적용됨
interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPage, setLastPage] = useState(false);
  const [page, setPage] = useState(0);
  const trigger = useRef<HTMLSpanElement>(null);

  // 옵서버 생성
  useEffect(() => {
    const observer = new IntersectionObserver(
      (
        entrise: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        console.log(entrise);
      }
    );
  }, [page]);

  const onLoadMoreClick = async () => {
    setIsLoading(true);
    const newProducts = await getMoreProducts(page + 1);
    console.log(" 페이지 : ");
    console.log(page);
    if (newProducts.length !== 0) {
      setPage((prev) => prev + 1);
      setProducts((prev) => [...prev, ...newProducts]);
    } else {
      setLastPage(true);
    }
    setIsLoading(false);
  };
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {isLastPage ? (
        "No more Items"
      ) : (
        <span
          ref={trigger}
          className="mt-[300vh] mb-96 text-sm
      font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
          onClick={onLoadMoreClick}
        >
          {isLoading ? "로딩 중..." : "더 보기"}
        </span>
      )}
    </div>
  );
}
