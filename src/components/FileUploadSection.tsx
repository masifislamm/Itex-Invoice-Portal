import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Copy, Image, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function FileUploadSection() {
  const [selectedCategory, setSelectedCategory] = useState<"logo" | "signature" | "seal">("signature");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFileMetadata = useMutation(api.files.saveFileMetadata);
  const deleteFile = useMutation(api.files.deleteFile);
  const userFiles = useQuery(api.files.listUserFiles);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload file
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();

      // Save metadata
      await saveFileMetadata({
        storageId,
        fileName: file.name,
        fileType: file.type,
        fileCategory: selectedCategory,
      });

      toast.success("File uploaded successfully!");
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteFile({ id: fileId as any });
      toast.success("File deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete file");
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const filteredFiles = userFiles?.filter((file) => file.fileCategory === selectedCategory) || [];

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "logo":
        return "Company Logo";
      case "signature":
        return "Signature";
      case "seal":
        return "Company Seal";
      default:
        return "Files";
    }
  };

  return (
    <Card className="shadow-md border-2">
      <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Image className="h-6 w-6 text-primary" />
          Asset Management
        </CardTitle>
        <CardDescription className="text-gray-600 mt-1">
          Upload and manage logos, signatures, and seals for your invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <Label htmlFor="fileCategory" className="text-sm font-medium text-gray-700">
            Select Asset Type
          </Label>
          <Select value={selectedCategory} onValueChange={(value: any) => setSelectedCategory(value)}>
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="logo">Company Logo</SelectItem>
              <SelectItem value="signature">Signature</SelectItem>
              <SelectItem value="seal">Company Seal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Upload Section */}
        <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-primary transition-colors">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Upload {getCategoryLabel(selectedCategory)}</h3>
              <p className="text-sm text-gray-600">
                PNG, JPG, SVG up to 5MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-primary hover:bg-primary/90"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Choose File"}
            </Button>
          </div>
        </div>

        {/* Files List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              Uploaded {getCategoryLabel(selectedCategory)}s
            </Label>
            {filteredFiles.length > 0 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
              </span>
            )}
          </div>
          
          {filteredFiles.length > 0 ? (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div
                  key={file._id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {file.url && (
                    <div className="flex-shrink-0">
                      <img
                        src={file.url}
                        alt={file.fileName}
                        className="h-12 w-12 object-contain border rounded bg-white"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.fileName}</p>
                    <p className="text-xs text-gray-500 truncate">{file.url}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => file.url && copyToClipboard(file.url)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:bg-red-50"
                      onClick={() => handleDelete(file._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg bg-gray-50">
              <Image className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm text-gray-600 mb-1">
                No {getCategoryLabel(selectedCategory).toLowerCase()}s uploaded yet
              </p>
              <p className="text-xs text-gray-500">
                Upload your first file to get started
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}