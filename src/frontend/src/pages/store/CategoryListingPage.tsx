import { useParams } from '@tanstack/react-router';
import { useGetProductsByCategory } from '../../hooks/useQueries';
import ProductCard from '../../components/store/ProductCard';

export default function CategoryListingPage() {
  const { categoryName } = useParams({ from: '/category/$categoryName' });
  const { data: products = [], isLoading } = useGetProductsByCategory(categoryName);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">{categoryName}</h1>

      {isLoading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No products in this category yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
