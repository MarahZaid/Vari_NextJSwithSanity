import ProductCard from "../ui/ProductCard";

export default function ProductsGrid({ products }) {
  if (!products.length) {
    return (
      <div className="py-12 text-center text-[#666]">No products found</div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}