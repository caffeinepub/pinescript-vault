import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ExternalBlob } from '../../backend';

interface FileUploadFieldProps {
  label: string;
  onFileChange: (blob: ExternalBlob | undefined) => void;
  accept?: string;
}

export default function FileUploadField({ label, onFileChange, accept = '.pine,.txt' }: FileUploadFieldProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      onFileChange(undefined);
      setFileName('');
      setUploadProgress(0);
      return;
    }

    setFileName(file.name);
    setUploadProgress(0);

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
      setUploadProgress(percentage);
    });

    onFileChange(blob);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload">{label}</Label>
      <Input id="file-upload" type="file" accept={accept} onChange={handleFileChange} />
      {fileName && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{fileName}</p>
          {uploadProgress > 0 && uploadProgress < 100 && <Progress value={uploadProgress} />}
        </div>
      )}
    </div>
  );
}
