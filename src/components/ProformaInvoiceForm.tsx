import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Upload } from "lucide-react";
import { ImageSelector } from "@/components/ImageSelector";

export interface ProformaInvoiceItem {
  shippingMarks: string;
  description: string;
  unitPrice: string;
  amount: number;
}

export interface ProformaInvoiceData {
  invoiceNumber: string;
  companyName: string;
  companyAddress: string;
  companyLogoUrl?: string;
  companySealUrl?: string;
  clientName: string;
  clientAddress: string;
  date: string;
  shipper: string;
  telephoneNumber: string;
  destination: string;
  deliveryTime: string;
  paymentTerm: string;
  items: ProformaInvoiceItem[];
  total: number;
  totalInWords: string;
  advisingBank: string;
  bankAddress: string;
  beneficiaryName: string;
  accountNumber: string;
  swiftCode: string;
  origin: string;
  portOfLoading: string;
  portOfDestination: string;
  partialShipment: string;
  transshipment: string;
  terms: string;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
}

interface ProformaInvoiceFormProps {
  data: ProformaInvoiceData;
  onChange: (data: ProformaInvoiceData) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export function ProformaInvoiceForm({ data, onChange, onSave, isLoading }: ProformaInvoiceFormProps) {
  const updateField = (field: keyof ProformaInvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addItem = () => {
    const newItem: ProformaInvoiceItem = {
      shippingMarks: "",
      description: "",
      unitPrice: "",
      amount: 0,
    };
    updateField("items", [...data.items, newItem]);
  };

  const updateItem = (index: number, field: keyof ProformaInvoiceItem, value: any) => {
    const updatedItems = [...data.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    updateField("items", updatedItems);
    calculateTotal(updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = data.items.filter((_, i) => i !== index);
    updateField("items", updatedItems);
    calculateTotal(updatedItems);
  };

  const calculateTotal = (items: ProformaInvoiceItem[]) => {
    const total = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    onChange({ ...data, items, total });
  };

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={data.companyName}
              onChange={(e) => updateField("companyName", e.target.value)}
              placeholder="ITEX GLOBAL SOURCING"
            />
          </div>
          <div>
            <Label htmlFor="companyAddress">Company Address</Label>
            <Textarea
              id="companyAddress"
              value={data.companyAddress}
              onChange={(e) => updateField("companyAddress", e.target.value)}
              placeholder="Full company address"
              rows={2}
            />
          </div>
          <ImageSelector
            label="Company Logo"
            value={data.companyLogoUrl || ""}
            onChange={(value) => updateField("companyLogoUrl", value)}
            category="logo"
            placeholder="https://example.com/logo.png"
            id="companyLogoUrl"
          />
          <ImageSelector
            label="Company Seal"
            value={data.companySealUrl || ""}
            onChange={(value) => updateField("companySealUrl", value)}
            category="seal"
            placeholder="https://example.com/seal.png"
            id="companySealUrl"
          />
        </CardContent>
      </Card>

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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipper">Shipper</Label>
              <Input
                id="shipper"
                value={data.shipper}
                onChange={(e) => updateField("shipper", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="telephoneNumber">Telephone Number</Label>
              <Input
                id="telephoneNumber"
                value={data.telephoneNumber}
                onChange={(e) => updateField("telephoneNumber", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                value={data.destination}
                onChange={(e) => updateField("destination", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="deliveryTime">Delivery Time</Label>
              <Input
                id="deliveryTime"
                value={data.deliveryTime}
                onChange={(e) => updateField("deliveryTime", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="paymentTerm">Payment Term</Label>
            <Input
              id="paymentTerm"
              value={data.paymentTerm}
              onChange={(e) => updateField("paymentTerm", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Client Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={data.clientName}
              onChange={(e) => updateField("clientName", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="clientAddress">Client Address</Label>
            <Textarea
              id="clientAddress"
              value={data.clientAddress}
              onChange={(e) => updateField("clientAddress", e.target.value)}
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
                <div className="col-span-2">
                  <Label>Shipping Marks</Label>
                  <Input
                    value={item.shippingMarks}
                    onChange={(e) => updateItem(index, "shippingMarks", e.target.value)}
                  />
                </div>
                <div className="col-span-4">
                  <Label>Description</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="col-span-3">
                  <Label>Unit Price</Label>
                  <Textarea
                    value={item.unitPrice}
                    onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    value={item.amount}
                    onChange={(e) => updateItem(index, "amount", parseFloat(e.target.value) || 0)}
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
              Total: USD {data.total.toFixed(2)}
            </div>
          </div>
          <div className="mt-2">
            <Label htmlFor="totalInWords">Total in Words</Label>
            <Input
              id="totalInWords"
              value={data.totalInWords}
              onChange={(e) => updateField("totalInWords", e.target.value)}
              placeholder="SAY US DOLLARS..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Bank Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bank Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="advisingBank">Advising Bank</Label>
            <Input
              id="advisingBank"
              value={data.advisingBank}
              onChange={(e) => updateField("advisingBank", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bankAddress">Bank Address</Label>
            <Input
              id="bankAddress"
              value={data.bankAddress}
              onChange={(e) => updateField("bankAddress", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
            <Input
              id="beneficiaryName"
              value={data.beneficiaryName}
              onChange={(e) => updateField("beneficiaryName", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={data.accountNumber}
                onChange={(e) => updateField("accountNumber", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="swiftCode">SWIFT Code</Label>
              <Input
                id="swiftCode"
                value={data.swiftCode}
                onChange={(e) => updateField("swiftCode", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Shipping Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              value={data.origin}
              onChange={(e) => updateField("origin", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="portOfLoading">Port of Loading</Label>
              <Input
                id="portOfLoading"
                value={data.portOfLoading}
                onChange={(e) => updateField("portOfLoading", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="portOfDestination">Port of Destination</Label>
              <Input
                id="portOfDestination"
                value={data.portOfDestination}
                onChange={(e) => updateField("portOfDestination", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partialShipment">Partial Shipment</Label>
              <Input
                id="partialShipment"
                value={data.partialShipment}
                onChange={(e) => updateField("partialShipment", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="transshipment">Transshipment</Label>
              <Input
                id="transshipment"
                value={data.transshipment}
                onChange={(e) => updateField("transshipment", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={data.terms}
            onChange={(e) => updateField("terms", e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isLoading} size="lg">
          {isLoading ? "Saving..." : "Save Proforma Invoice"}
        </Button>
      </div>
    </div>
  );
}