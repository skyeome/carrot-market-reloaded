async function getProducts() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
}

export default async function Products() {
  const products = await getProducts();
  return <div>Products</div>;
}
