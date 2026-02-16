import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Product } from '../../backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.isFree ? 'Free' : `$${(Number(product.priceAmount) / 100).toFixed(2)}`;

  return (
    <Link to="/product/$productId" params={{ productId: product.id }}>
      <Card className="h-full hover:border-primary/50 transition-all cursor-pointer group">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">{product.title}</CardTitle>
            {product.isFree && <Badge variant="secondary">Free</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="outline">{product.category}</Badge>
            <span className="text-lg font-semibold">{price}</span>
          </div>
        </CardContent>
        {product.requiresInvite && (
          <CardFooter>
            <Badge variant="outline" className="text-xs">
              Invite Required
            </Badge>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
