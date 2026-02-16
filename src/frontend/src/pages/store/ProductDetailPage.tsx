import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProduct } from '../../hooks/useQueries';
import { useCreateCheckoutSession } from '../../hooks/useStripeCheckout';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { productId } = useParams({ from: '/product/$productId' });
  const { data: product, isLoading } = useGetProduct(productId);
  const createCheckout = useCreateCheckoutSession();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  const handlePurchase = async () => {
    if (!identity) {
      toast.error('Please log in to purchase');
      return;
    }

    if (!product) return;

    try {
      const session = await createCheckout.mutateAsync([
        {
          productName: product.title,
          productDescription: product.shortDescription,
          priceInCents: product.priceAmount,
          currency: product.currency,
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertTitle>Product Not Found</AlertTitle>
          <AlertDescription>The product you're looking for doesn't exist.</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => navigate({ to: '/' })}>
          Return to Home
        </Button>
      </div>
    );
  }

  const price = product.isFree ? 'Free' : `$${(Number(product.priceAmount) / 100).toFixed(2)}`;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{product.title}</h1>
                <div className="flex items-center gap-2">
                  <Badge>{product.category}</Badge>
                  {product.isFree && <Badge variant="secondary">Free</Badge>}
                  {product.requiresInvite && <Badge variant="outline">Invite Required</Badge>}
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground">{product.shortDescription}</p>
          </div>

          <Separator />

          <div>
            <h2 className="text-2xl font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{product.longDescription}</p>
          </div>

          {product.instructions && (
            <>
              <Separator />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Installation Instructions</h2>
                <Card>
                  <CardContent className="pt-6">
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      {product.instructions.split('\n').map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {product.codePreview && (
            <>
              <Separator />
              <div>
                <h2 className="text-2xl font-semibold mb-4">Code Preview</h2>
                <Card>
                  <CardContent className="pt-6">
                    <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto">
                      <code>{product.codePreview}</code>
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {product.disclaimer && (
            <>
              <Separator />
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap">{product.disclaimer}</AlertDescription>
              </Alert>
            </>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Purchase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="text-3xl font-bold">{price}</span>
              </div>

              {product.requiresInvite && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    This script requires manual TradingView invite access. You'll provide your username after purchase.
                  </AlertDescription>
                </Alert>
              )}

              <Button className="w-full" size="lg" onClick={handlePurchase} disabled={createCheckout.isPending}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {createCheckout.isPending ? 'Processing...' : product.isFree ? 'Get Free Script' : 'Buy Now'}
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
