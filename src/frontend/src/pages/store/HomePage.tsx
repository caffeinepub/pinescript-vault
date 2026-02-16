import { useGetAllProducts, useGetAllBundles } from '../../hooks/useQueries';
import ProductCard from '../../components/store/ProductCard';
import CategoryNav from '../../components/store/CategoryNav';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { data: products = [], isLoading: productsLoading } = useGetAllProducts();
  const { data: bundles = [] } = useGetAllBundles();
  const navigate = useNavigate();

  const featuredProducts = products.slice(0, 6);

  return (
    <div>
      <section
        className="relative bg-cover bg-center py-24 md:py-32"
        style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x800.png)' }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium Pine Script Indicators for TradingView
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Elevate your trading with professional-grade indicators and strategies. Tested, optimized, and ready to
              deploy.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate({ to: '/bundles' })}>
                Browse Bundles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: '/' })}>
                View Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
          <CategoryNav />
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        {productsLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No products available yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {bundles.length > 0 && (
        <section className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Bundle Deals</h2>
            <Button variant="outline" onClick={() => navigate({ to: '/bundles' })}>
              View All Bundles
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.slice(0, 3).map((bundle) => (
              <div
                key={bundle.id}
                className="p-6 border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => navigate({ to: '/bundle/$bundleId', params: { bundleId: bundle.id } })}
              >
                <h3 className="text-xl font-semibold mb-2">{bundle.name}</h3>
                <p className="text-muted-foreground mb-4">{bundle.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{bundle.productIds.length} scripts</span>
                  <span className="text-lg font-semibold">${(Number(bundle.priceAmount) / 100).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
