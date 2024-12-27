import ListProduct from "@/components/list-product";
import db from "@/lib/db";

async function getProduct() {
  // await new Promise((resolve) => setTimeout(resolve, 10000));
  const product = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
  });
  return product;
}

export default async function Product() {
  const products = await getProduct();
  return (
    <div className="p-5 flex flex-col gap-5">
      <h1 className="text-white text-4xl">
        {products.map((product) => (
          <ListProduct key={product.id} {...product} />
        ))}
      </h1>
    </div>
  );
}
