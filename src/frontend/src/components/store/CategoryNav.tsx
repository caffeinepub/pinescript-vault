import { Link } from '@tanstack/react-router';
import { useGetAllCategories } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';

export default function CategoryNav() {
  const { data: categories = [] } = useGetAllCategories();

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <Link key={category} to="/category/$categoryName" params={{ categoryName: category }}>
          <Button variant="outline" size="sm">
            {category}
          </Button>
        </Link>
      ))}
    </div>
  );
}
