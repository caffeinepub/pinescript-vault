import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetBundle, useGetAllProducts } from '../../hooks/useQueries';
import { useCreateCheckoutSession } from '../../hooks/useStripeCheckout';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function BundleDetailPage() {
  const { bundleId } = useParams({ from: '/bundle/$bundleId' });
  const { data: bundle, isLoading: bundleLoading } = useGetBundle(bundleId);
  const { data: allProducts = [] } = useGetAllProducts();
  const createCheckout = useCreateCheckoutSession();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const includedProducts = bundle ? allProducts.filter((p) => bundle.productIds.includes(p.id)) : [];

  const handlePurchase = async () => {
    if (!identity) {
      toast.error('Please log in to purchase');
      return;
    }

    if (!bundle) return;

    try {
      const session = await createCheckout.mutateAsync([
        {
          productName: bundle.name,
          productDescription: bundle.description,
          priceInCents: bundle.priceAmount,
          currency: bundle.currency,
          quantity: BigInt(1),
        },
      ]);

      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      window.location.href = session.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to initiate checkout');
    }
  };

  if (bundleLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading bundle...</div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertTitle>Bundle Not Found</AlertTitle>
          <AlertDescription>The bundle you're looking for doesn't exist.</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate({ to: '/bundles' })}>
          View All Bundles
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{bundle.name}</h1>
            <p className="text-lg text-muted-foreground">{bundle.description}</p>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-4">Included Scripts ({includedProducts.length})</h2>
            <div className="space-y-4">
              {includedProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Bundle Purchase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Price</span>
                <span className="text-3xl font-bold">${(Number(bundle.priceAmount) / 100).toFixed(2)}</span>
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Includes {bundle.productIds.length} premium scripts</p>
              </div>

              <Button className="w-full" size="lg" onClick={handlePurchase} disabled={createCheckout.isPending}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {createCheckout.isPending ? 'Processing...' : 'Buy Bundle'}
              </Button>

              {!identity && (
                <p className="text-xs text-center text-muted-foreground">Please log in to purchase</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
