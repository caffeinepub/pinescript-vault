import { useState } from 'react';
import { useGetAllProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FileUploadField from '../../components/admin/FileUploadField';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Product, ExternalBlob } from '../../backend';

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useGetAllProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    longDescription: '',
    priceAmount: '0',
    currency: 'USD',
    isFree: false,
    category: '',
    instructions: '',
    codePreview: '',
    disclaimer: '',
    requiresInvite: false,
  });
  const [downloadableFile, setDownloadableFile] = useState<ExternalBlob | undefined>(undefined);

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        slug: product.slug,
        shortDescription: product.shortDescription,
        longDescription: product.longDescription,
        priceAmount: product.priceAmount.toString(),
        currency: product.currency,
        isFree: product.isFree,
        category: product.category,
        instructions: product.instructions,
        codePreview: product.codePreview,
        disclaimer: product.disclaimer,
        requiresInvite: product.requiresInvite,
      });
      setDownloadableFile(product.downloadableFile);
    } else {
      setEditingProduct(null);
      setFormData({
        title: '',
        slug: '',
        shortDescription: '',
        longDescription: '',
        priceAmount: '0',
        currency: 'USD',
        isFree: false,
        category: '',
        instructions: '',
        codePreview: '',
        disclaimer: '',
        requiresInvite: false,
      });
      setDownloadableFile(undefined);
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData: Product = {
      id: editingProduct?.id || `product_${Date.now()}`,
      title: formData.title,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
      shortDescription: formData.shortDescription,
      longDescription: formData.longDescription,
      priceAmount: BigInt(formData.priceAmount),
      currency: formData.currency,
      isFree: formData.isFree,
      isPaid: !formData.isFree,
      category: formData.category,
      hasScreenshots: false,
      instructions: formData.instructions,
      codePreview: formData.codePreview,
      disclaimer: formData.disclaimer,
      requiresInvite: formData.requiresInvite,
      downloadableFile: downloadableFile,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync(productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct.mutateAsync(productData);
        toast.success('Product created successfully');
      }
      setDialogOpen(false);
    } catch (error) {
      console.error('Product save error:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct.mutateAsync(id);
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Product delete error:', error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Products</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Edit Product' : 'Create Product'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Textarea
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Long Description</Label>
                  <Textarea
                    id="longDescription"
                    value={formData.longDescription}
                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priceAmount">Price (cents)</Label>
                    <Input
                      id="priceAmount"
                      type="number"
                      value={formData.priceAmount}
                      onChange={(e) => setFormData({ ...formData, priceAmount: e.target.value })}
                      disabled={formData.isFree}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="isFree"
                      checked={formData.isFree}
                      onCheckedChange={(checked) => setFormData({ ...formData, isFree: checked })}
                    />
                    <Label htmlFor="isFree">Free Product</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codePreview">Code Preview</Label>
                  <Textarea
                    id="codePreview"
                    value={formData.codePreview}
                    onChange={(e) => setFormData({ ...formData, codePreview: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="disclaimer">Disclaimer</Label>
                  <Textarea
                    id="disclaimer"
                    value={formData.disclaimer}
                    onChange={(e) => setFormData({ ...formData, disclaimer: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="requiresInvite"
                    checked={formData.requiresInvite}
                    onCheckedChange={(checked) => setFormData({ ...formData, requiresInvite: checked })}
                  />
                  <Label htmlFor="requiresInvite">Requires TradingView Invite</Label>
                </div>

                <FileUploadField label="Downloadable Script File" onFileChange={setDownloadableFile} />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
                    {editingProduct ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No products yet</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.isFree ? 'Free' : `$${(Number(product.priceAmount) / 100).toFixed(2)}`}</TableCell>
                  <TableCell>{product.requiresInvite ? 'Invite Only' : 'Public'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
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
