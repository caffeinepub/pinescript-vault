import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import type { ExternalBlob } from '../../backend';

interface DownloadButtonProps {
  file?: ExternalBlob;
  productTitle: string;
  disabled?: boolean;
}

export default function DownloadButton({ file, productTitle, disabled }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!file) {
      toast.error('No file available for download');
      return;
    }

    try {
      setDownloading(true);
      const bytes = await file.getBytes();
      const blob = new Blob([bytes], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${productTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pine`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={disabled || downloading || !file}>
      <Download className="mr-2 h-4 w-4" />
      {downloading ? 'Downloading...' : 'Download Script'}
    </Button>
  );
}
