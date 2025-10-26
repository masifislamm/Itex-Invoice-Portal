import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { ImageSelector } from "@/components/ImageSelector";

export interface LocalChalanItem {
  sln: number;
  description: string;
  unit: string;
  quantity: number;
}

export interface LocalChalanData {
  invoiceNumber: string;
  date: string;
  toName: string;
  toAddress: string;
  fromName: string;
  fromAddress: string;
  items: LocalChalanItem[];
  inWords: string;
  signatureUrl?: string;
  sealUrl?: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
}

interface LocalChalanFormProps {
  data: LocalChalanData;
  onChange: (data: LocalChalanData) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export function LocalChalanForm({ data, onChange, onSave, isLoading }: LocalChalanFormProps) {
  const updateField = (field: keyof LocalChalanData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addItem = () => {
    const newItem: LocalChalanItem = {
      sln: data.items.length + 1,
      description: "",
      unit: "",
      quantity: 0,
    };
    updateField("items", [...data.items, newItem]);
  };

  const updateItem = (index: number, field: keyof LocalChalanItem, value: any) => {
    const updatedItems = [...data.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    updateField("items", updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = data.items.filter((_, i) => i !== index);
    // Renumber items
    updatedItems.forEach((item, i) => {
      item.sln = i + 1;
    });
    updateField("items", updatedItems);
  };

  return (
    <div className="space-y-6">
      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Challan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Challan Number</Label>
              <Input
                id="invoiceNumber"
                value={data.invoiceNumber}
                onChange={(e) => updateField("invoiceNumber", e.target.value)}
                placeholder="IGS20250909"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={data.date}
                onChange={(e) => updateField("date", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* To Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">To</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="toName">Recipient Name</Label>
            <Input
              id="toName"
              value={data.toName}
              onChange={(e) => updateField("toName", e.target.value)}
              placeholder="Heaven Textile Mills"
            />
          </div>
          <div>
            <Label htmlFor="toAddress">Recipient Address</Label>
            <Textarea
              id="toAddress"
              value={data.toAddress}
              onChange={(e) => updateField("toAddress", e.target.value)}
              placeholder="1/1, Kornogop, Rupganj, Naraynganj-1460, Bangladesh"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* From Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">From</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="fromName">Company Name</Label>
            <Input
              id="fromName"
              value={data.fromName}
              onChange={(e) => updateField("fromName", e.target.value)}
              placeholder="ITEX GLOBAL SOURCING"
            />
          </div>
          <div>
            <Label htmlFor="fromAddress">Company Address</Label>
            <Textarea
              id="fromAddress"
              value={data.fromAddress}
              onChange={(e) => updateField("fromAddress", e.target.value)}
              placeholder="9, Rang heritage, House-38, Shahmokhdum avenue, Sector-13, Uttara, Dhaka-1230, Bangladesh"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Items</CardTitle>
          <Button onClick={addItem} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end border-b pb-4">
                <div className="col-span-1">
                  <Label>Sln</Label>
                  <Input
                    type="number"
                    value={item.sln}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                <div className="col-span-5">
                  <Label>Description of the goods</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    placeholder="Siam Modified Starch, Product of Thailand"
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Unit</Label>
                  <Input
                    value={item.unit}
                    onChange={(e) => updateItem(index, "unit", e.target.value)}
                    placeholder="Kg"
                  />
                </div>
                <div className="col-span-3">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    onClick={() => removeItem(index)}
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="inWords">In Words</Label>
            <Input
              id="inWords"
              value={data.inWords}
              onChange={(e) => updateField("inWords", e.target.value)}
              placeholder="One ton of Siam Modified starch"
            />
          </div>
          <ImageSelector
            label="Signature Image"
            value={data.signatureUrl || ""}
            onChange={(value) => updateField("signatureUrl", value)}
            category="signature"
            placeholder="https://example.com/signature.png"
            id="signatureUrl"
          />
          <ImageSelector
            label="Seal Image"
            value={data.sealUrl || ""}
            onChange={(value) => updateField("sealUrl", value)}
            category="seal"
            placeholder="https://example.com/seal.png"
            id="sealUrl"
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isLoading} size="lg">
          {isLoading ? "Saving..." : "Save Challan"}
        </Button>
      </div>
    </div>
  );
}