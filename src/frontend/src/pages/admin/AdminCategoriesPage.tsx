import { useGetAllCategories } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading } = useGetAllCategories();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Categories are automatically created when you add products. Assign a category to a product to create it.
          </AlertDescription>
        </Alert>

        {isLoading ? (
          <div className="text-center py-8">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No categories yet. Create products to add categories.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-sm px-4 py-2">
                {category}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
