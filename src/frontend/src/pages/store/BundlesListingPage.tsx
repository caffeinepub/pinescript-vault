import { useGetAllBundles } from '../../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function BundlesListingPage() {
  const { data: bundles = [], isLoading } = useGetAllBundles();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Script Bundles</h1>

      {isLoading ? (
        <div className="text-center py-12">Loading bundles...</div>
      ) : bundles.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No bundles available yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => (
            <Card
              key={bundle.id}
              className="cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => navigate({ to: '/bundle/$bundleId', params: { bundleId: bundle.id } })}
            >
              <CardHeader>
                <CardTitle>{bundle.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{bundle.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{bundle.productIds.length} scripts included</Badge>
                  <span className="text-xl font-semibold">${(Number(bundle.priceAmount) / 100).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
