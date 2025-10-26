import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface ImageSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  category?: "logo" | "signature" | "seal";
  placeholder?: string;
  id?: string;
}

export function ImageSelector({ label, value, onChange, category, placeholder, id }: ImageSelectorProps) {
  const userFiles = useQuery(api.files.listUserFiles);
  
  // Filter files by category if specified
  const filteredFiles = category 
    ? userFiles?.filter(f => f.fileCategory === category) 
    : userFiles;

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === "custom") {
      onChange("");
    } else {
      onChange(selectedValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select 
        value={value && filteredFiles?.some(f => f.url === value) ? value : "custom"} 
        onValueChange={handleSelectChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select from uploaded files" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="custom">Custom URL</SelectItem>
          {filteredFiles && filteredFiles.length > 0 ? (
            filteredFiles.map((file) => (
              <SelectItem key={file._id} value={file.url || ""}>
                <div className="flex items-center gap-2">
                  <img 
                    src={file.url || ""} 
                    alt={file.fileName}
                    className="h-8 w-8 object-contain rounded border"
                  />
                  <span>{file.fileName}</span>
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>No files uploaded yet</SelectItem>
          )}
        </SelectContent>
      </Select>
      
      {/* Show input field for custom URL or when no match found */}
      {(!filteredFiles?.some(f => f.url === value) || value === "") && (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Enter custom URL"}
          className="mt-2"
        />
      )}
      
      {value && (
        <div className="flex items-center gap-2 mt-2">
          <img 
            src={value} 
            alt="Preview" 
            className="h-12 w-12 object-contain rounded border"
          />
          <p className="text-xs text-muted-foreground">
            Current: {filteredFiles?.find(f => f.url === value)?.fileName || "Custom URL"}
          </p>
        </div>
      )}
    </div>
  );
}