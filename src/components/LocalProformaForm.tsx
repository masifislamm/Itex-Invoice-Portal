import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { ImageSelector } from "@/components/ImageSelector";

export interface LocalProformaItem {
  sln: number;
  itemDescription: string;
  quantityInKg: number;
  unitPriceTk: number;
  totalPriceTk: number;
}

export interface LocalProformaData {
  invoiceNumber: string;
  date: string;
  toName: string;
  toAddress: string;
  fromName: string;
  fromAddress: string;
  items: LocalProformaItem[];
  totalInWords: string;
  paymentTerms: string;
  signatureUrl?: string;
  sealUrl?: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
}

interface LocalProformaFormProps {
  data: LocalProformaData;
  onChange: (data: LocalProformaData) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export function LocalProformaForm({ data, onChange, onSave, isLoading }: LocalProformaFormProps) {
  const updateField = (field: keyof LocalProformaData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addItem = () => {
    const newItem: LocalProformaItem = {
      sln: data.items.length + 1,
      itemDescription: "",
      quantityInKg: 0,
      unitPriceTk: 0,
      totalPriceTk: 0,
    };
    updateField("items", [...data.items, newItem]);
  };

  const updateItem = (index: number, field: keyof LocalProformaItem, value: any) => {
    const updatedItems = [...data.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Auto-calculate total price
    if (field === "quantityInKg" || field === "unitPriceTk") {
      const item = updatedItems[index];
      item.totalPriceTk = item.quantityInKg * item.unitPriceTk;
    }
    
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

  const calculateGrandTotal = () => {
    return data.items.reduce((sum, item) => sum + item.totalPriceTk, 0);
  };

  return (
    <div className="space-y-6">
      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
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
            <Label htmlFor="toName">Client Name</Label>
            <Input
              id="toName"
              value={data.toName}
              onChange={(e) => updateField("toName", e.target.value)}
              placeholder="Heaven Textile Mills"
            />
          </div>
          <div>
            <Label htmlFor="toAddress">Client Address</Label>
            <Textarea
              id="toAddress"
              value={data.toAddress}
              onChange={(e) => updateField("toAddress", e.target.value)}
              placeholder="1/1, Kornogop, Rupganj, Naraynganj 1460, Bangladesh"
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
              placeholder="9 Rang Heritage, House-38, Shahmokhdum avenue, Sector-13, Uttara Dhaka 1230, Bangladesh"
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
                <div className="col-span-4">
                  <Label>Item Description</Label>
                  <Textarea
                    value={item.itemDescription}
                    onChange={(e) => updateItem(index, "itemDescription", e.target.value)}
                    placeholder="Siam Modified Starch. Product of Thailand"
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Quantity (Kg)</Label>
                  <Input
                    type="number"
                    value={item.quantityInKg}
                    onChange={(e) => updateItem(index, "quantityInKg", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Unit Price (TK/Kg)</Label>
                  <Input
                    type="number"
                    value={item.unitPriceTk}
                    onChange={(e) => updateItem(index, "unitPriceTk", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Total Price (TK)</Label>
                  <Input
                    type="number"
                    value={item.totalPriceTk}
                    disabled
                    className="bg-gray-50"
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
          <div className="mt-4 flex justify-end">
            <div className="text-lg font-bold">
              Grand Total: TK {calculateGrandTotal().toFixed(2)}
            </div>
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
            <Label htmlFor="totalInWords">Total in Words</Label>
            <Input
              id="totalInWords"
              value={data.totalInWords}
              onChange={(e) => updateField("totalInWords", e.target.value)}
              placeholder="Say, Eighty eight thousand taka only"
            />
          </div>
          <div>
            <Label htmlFor="paymentTerms">Payment Terms</Label>
            <Input
              id="paymentTerms"
              value={data.paymentTerms}
              onChange={(e) => updateField("paymentTerms", e.target.value)}
              placeholder="Cash"
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
          {isLoading ? "Saving..." : "Save Local Proforma"}
        </Button>
      </div>
    </div>
  );
}