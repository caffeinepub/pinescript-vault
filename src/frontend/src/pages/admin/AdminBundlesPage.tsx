import { useState } from 'react';
import { useGetAllBundles, useGetAllProducts, useCreateBundle, useUpdateBundle, useDeleteBundle } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Bundle } from '../../backend';

export default function AdminBundlesPage() {
  const { data: bundles = [], isLoading } = useGetAllBundles();
  const { data: products = [] } = useGetAllProducts();
  const createBundle = useCreateBundle();
  const updateBundle = useUpdateBundle();
  const deleteBundle = useDeleteBundle();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priceAmount: '0',
    currency: 'USD',
    productIds: [] as string[],
  });

  const handleOpenDialog = (bundle?: Bundle) => {
    if (bundle) {
      setEditingBundle(bundle);
      setFormData({
        name: bundle.name,
        description: bundle.description,
        priceAmount: bundle.priceAmount.toString(),
        currency: bundle.currency,
        productIds: [...bundle.productIds],
      });
    } else {
      setEditingBundle(null);
      setFormData({
        name: '',
        description: '',
        priceAmount: '0',
        currency: 'USD',
        productIds: [],
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const bundleData: Bundle = {
      id: editingBundle?.id || `bundle_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      priceAmount: BigInt(formData.priceAmount),
      currency: formData.currency,
      productIds: formData.productIds,
    };

    try {
      if (editingBundle) {
        await updateBundle.mutateAsync(bundleData);
        toast.success('Bundle updated successfully');
      } else {
        await createBundle.mutateAsync(bundleData);
        toast.success('Bundle created successfully');
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Bundle save error:', error);
      toast.error('Failed to save bundle');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bundle?')) return;

    try {
      await deleteBundle.mutateAsync(id);
      toast.success('Bundle deleted successfully');
    } catch (error) {
      console.error('Bundle delete error:', error);
      toast.error('Failed to delete bundle');
    }
  };

  const toggleProduct = (productId: string) => {
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Bundles</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Bundle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingBundle ? 'Edit Bundle' : 'Create Bundle'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Bundle Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceAmount">Price (cents) *</Label>
                  <Input
                    id="priceAmount"
                    type="number"
                    value={formData.priceAmount}
                    onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Included Products *</Label>
                  <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={product.id}
                          checked={formData.productIds.includes(product.id)}
                          onCheckedChange={() => toggleProduct(product.id)}
                        />
                        <Label htmlFor={product.id} className="cursor-pointer">
                          {product.title}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createBundle.isPending || updateBundle.isPending}>
                    {editingBundle ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading bundles...</div>
        ) : bundles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No bundles yet</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bundles.map((bundle) => (
                <TableRow key={bundle.id}>
                  <TableCell className="font-medium">{bundle.name}</TableCell>
                  <TableCell>{bundle.productIds.length} scripts</TableCell>
                  <TableCell>${(Number(bundle.priceAmount) / 100).toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(bundle)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(bundle.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
