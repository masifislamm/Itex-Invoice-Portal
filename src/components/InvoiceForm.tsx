import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Plus, Trash2, Lock, Unlock } from "lucide-react";
import { useState, useEffect } from "react";

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  // Mark description-only lines
  isNote?: boolean;
}

// Add a strict union for invoice status to match backend and mutation arg types
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceData {
  invoiceNumber: string;
  companyName: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyZip: string;
  companyCountry: string;
  companyEmail: string;
  companyPhone: string;
  tin: string;
  bin: string;
  clientName: string;
  clientAddress: string;
  clientCity: string;
  clientState: string;
  clientZip: string;
  clientCountry: string;
  clientEmail: string;
  clientPhone: string;
  clientFax?: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  reference: string;
  agentName: string;
  agentMobile: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency?: string;
  notes: string;
  terms: string;
  // Bank and extras
  bankBeneficiaryName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  bankAddress?: string;
  bankSwiftCode?: string;
  totalInWords?: string;
  // Commission
  commissionPercent?: number;
}

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export function InvoiceForm({ data, onChange, onSave, isLoading }: InvoiceFormProps) {
  // Add lock state for Bank Information
  const [isBankLocked, setIsBankLocked] = useState(true);
  // New: local state to hold the product subtotal (commission base)
  const [commissionBase, setCommissionBase] = useState<number>(0);

  // New: re-calc totals whenever commissionPercent changes so totals reflect commission-only billing
  useEffect(() => {
    calculateTotals(data.items);
  }, [data.commissionPercent]);

  const updateField = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    updateField("items", [...data.items, newItem]);
  };

  // Add: ability to append a text-only row
  const addTextLine = () => {
    const newItem: InvoiceItem = {
      description: "",
      quantity: 0,
      rate: 0,
      amount: 0,
      isNote: true,
    };
    updateField("items", [...data.items, newItem]);
  };

  // Add: helper to add a commission-only line item based on base subtotal and commission %
  const addCommissionLine = () => {
    const percent = Number(data.commissionPercent ?? 0);
    const base = Number(commissionBase) || 0;
    if (percent <= 0 || base <= 0) {
      return;
    }
    const commissionAmount = +(base * (percent / 100)).toFixed(2);
    const newItem: InvoiceItem = {
      description: `Commission ${percent}% of ${data.currency || "EUR"} ${base.toFixed(2)}`,
      // Quantity is optional for commission lines; set to 0 to avoid implying product units
      quantity: 0,
      rate: commissionAmount, // store computed amount; rate not used for notes, but we keep consistent fields
      amount: commissionAmount,
    };
    const nextItems = [...data.items, newItem];
    updateField("items", nextItems);
    calculateTotals(nextItems);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...data.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    // Keep amount and rate in sync based on what the user edits
    if (field === "quantity" || field === "rate") {
      const qty = Number(updatedItems[index].quantity) || 0;
      const rate = Number(updatedItems[index].rate) || 0;
      updatedItems[index].amount = qty * rate;
    } else if (field === "amount") {
      const amount = Number(value) || 0;
      const qty = Number(updatedItems[index].quantity) || 0;
      // If quantity is set, infer rate from amount; otherwise, keep rate as-is
      if (qty > 0) {
        updatedItems[index].rate = amount / qty;
      }
      updatedItems[index].amount = amount;
    }

    updateField("items", updatedItems);
    calculateTotals(updatedItems);
  };

  const removeItem = (index: number) => {
    const updatedItems = data.items.filter((_, i) => i !== index);
    updateField("items", updatedItems);
    calculateTotals(updatedItems);
  };

  const calculateTotals = (items: InvoiceItem[]) => {
    const percent = Number(data.commissionPercent ?? 0);

    // Remove any existing auto commission line(s) to re-create/update cleanly
    const withoutCommission = items.filter(
      (it) =>
        !(
          !it.isNote &&
          (Number(it.quantity) || 0) === 0 &&
          typeof it.description === "string" &&
          it.description.startsWith("Commission ")
        )
    );

    // Compute product base from real product rows (non-note, quantity > 0)
    const productBase = withoutCommission
      .filter((it) => !it.isNote && (Number(it.quantity) || 0) > 0)
      .reduce((sum, it) => sum + (Number(it.amount) || 0), 0);

    // Build nextItems with an auto commission line if percent > 0 and base > 0
    let nextItems: InvoiceItem[] = withoutCommission;
    if (percent > 0 && productBase > 0) {
      const commissionAmount = +(productBase * (percent / 100)).toFixed(2);
      const commissionItem: InvoiceItem = {
        description: `Commission ${percent}% of ${data.currency || "EUR"} ${productBase.toFixed(2)}`,
        quantity: 0,
        rate: commissionAmount,
        amount: commissionAmount,
      };
      nextItems = [...withoutCommission, commissionItem];
    }

    // Totals:
    // - If commission mode: include only commission-style lines (qty === 0, non-note)
    // - Otherwise: include all non-note lines
    const hasCommission = percent > 0;
    const subtotal = nextItems
      .filter((it) => {
        if (it.isNote) return false;
        if (hasCommission) {
          return (Number(it.quantity) || 0) === 0;
        }
        return true;
      })
      .reduce((sum, it) => sum + (Number(it.amount) || 0), 0);

    const taxAmount = subtotal * (data.taxRate / 100);
    const total = subtotal + taxAmount;

    onChange({
      ...data,
      items: nextItems,
      subtotal,
      taxAmount,
      total,
    });
  };

  const updateTaxRate = (taxRate: number) => {
    const taxAmount = data.subtotal * (taxRate / 100);
    const total = data.subtotal + taxAmount;

    onChange({
      ...data,
      taxRate,
      taxAmount,
      total,
    });
  };

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={data.companyEmail}
                onChange={(e) => updateField("companyEmail", e.target.value)}
                placeholder="info@itexglobal.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="companyAddress">Address</Label>
            <Input
              id="companyAddress"
              value={data.companyAddress}
              onChange={(e) => updateField("companyAddress", e.target.value)}
              placeholder="123 Business Street"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="companyCity">City</Label>
              <Input
                id="companyCity"
                value={data.companyCity}
                onChange={(e) => updateField("companyCity", e.target.value)}
                placeholder="New York"
              />
            </div>
            <div>
              <Label htmlFor="companyState">State</Label>
              <Input
                id="companyState"
                value={data.companyState}
                onChange={(e) => updateField("companyState", e.target.value)}
                placeholder="NY"
              />
            </div>
            <div>
              <Label htmlFor="companyZip">ZIP</Label>
              <Input
                id="companyZip"
                value={data.companyZip}
                onChange={(e) => updateField("companyZip", e.target.value)}
                placeholder="10001"
              />
            </div>
            <div>
              <Label htmlFor="companyPhone">Phone</Label>
              <Input
                id="companyPhone"
                value={data.companyPhone}
                onChange={(e) => updateField("companyPhone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tin">TIN</Label>
              <Input
                id="tin"
                value={data.tin}
                onChange={(e) => updateField("tin", e.target.value)}
                placeholder="Tax Identification Number"
              />
            </div>
            <div>
              <Label htmlFor="bin">BIN</Label>
              <Input
                id="bin"
                value={data.bin}
                onChange={(e) => updateField("bin", e.target.value)}
                placeholder="Business Identification Number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bill To</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={data.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
                placeholder="Client Company Name"
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={data.clientEmail}
                onChange={(e) => updateField("clientEmail", e.target.value)}
                placeholder="client@company.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="clientAddress">Address</Label>
            <Input
              id="clientAddress"
              value={data.clientAddress}
              onChange={(e) => updateField("clientAddress", e.target.value)}
              placeholder="456 Client Avenue"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="clientCity">City</Label>
              <Input
                id="clientCity"
                value={data.clientCity}
                onChange={(e) => updateField("clientCity", e.target.value)}
                placeholder="Los Angeles"
              />
            </div>
            <div>
              <Label htmlFor="clientState">State</Label>
              <Input
                id="clientState"
                value={data.clientState}
                onChange={(e) => updateField("clientState", e.target.value)}
                placeholder="CA"
              />
            </div>
            <div>
              <Label htmlFor="clientZip">ZIP</Label>
              <Input
                id="clientZip"
                value={data.clientZip}
                onChange={(e) => updateField("clientZip", e.target.value)}
                placeholder="90210"
              />
            </div>
            <div>
              <Label htmlFor="clientPhone">Phone</Label>
              <Input
                id="clientPhone"
                value={data.clientPhone}
                onChange={(e) => updateField("clientPhone", e.target.value)}
                placeholder="+1 (555) 987-6543"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="clientFax">Fax (optional)</Label>
              <Input
                id="clientFax"
                value={data.clientFax || ""}
                onChange={(e) => updateField("clientFax", e.target.value)}
                placeholder="Client fax number"
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={data.currency || "EUR"} onValueChange={(value) => updateField("currency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="BDT">BDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="totalInWords">Total (in words)</Label>
              <Input
                id="totalInWords"
                value={data.totalInWords || ""}
                onChange={(e) => updateField("totalInWords", e.target.value)}
                placeholder="e.g., Eighteen hundred and forty eight only"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Information moved below (above Additional Information) and is lockable */}

      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={data.invoiceNumber}
                onChange={(e) => updateField("invoiceNumber", e.target.value)}
                placeholder="INV-2024-0001"
              />
            </div>
            <div>
              <Label htmlFor="issueDate">Issue Date</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="issueDate"
                  type="date"
                  value={data.issueDate}
                  onChange={(e) => updateField("issueDate", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dueDate"
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => updateField("dueDate", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="reference">Reference (REF)</Label>
              <Input
                id="reference"
                value={data.reference}
                onChange={(e) => updateField("reference", e.target.value)}
                placeholder="e.g., 6-19/02/2025"
              />
            </div>
            <div>
              <Label htmlFor="commissionPercent">Commission (%)</Label>
              <Input
                id="commissionPercent"
                type="number"
                value={data.commissionPercent ?? 0}
                onChange={(e) =>
                  updateField(
                    "commissionPercent",
                    parseFloat(e.target.value) || 0
                  )
                }
                min="0"
                step="0.01"
                placeholder="e.g., 7"
              />
            </div>
            <div>
              {/* New: Commission base input */}
              <Label htmlFor="commissionBase">Commission Base (Product Subtotal)</Label>
              <div className="flex gap-2">
                <Input
                  id="commissionBase"
                  type="number"
                  value={commissionBase}
                  onChange={(e) => setCommissionBase(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  placeholder="e.g., 26400"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addCommissionLine}
                >
                  Add Commission Line
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={data.status} onValueChange={(value) => updateField("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agent Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agent Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="agentName">Agent Name</Label>
            <Input
              id="agentName"
              value={data.agentName}
              onChange={(e) => updateField("agentName", e.target.value)}
              placeholder="Agent full name"
            />
          </div>
          <div>
            <Label htmlFor="agentMobile">Agent Mobile</Label>
            <Input
              id="agentMobile"
              value={data.agentMobile}
              onChange={(e) => updateField("agentMobile", e.target.value)}
              placeholder="+8801XXXXXXXXX"
            />
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Line Items</CardTitle>
          <div className="flex gap-2">
            <Button onClick={addTextLine} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Text Line
            </Button>
            <Button onClick={addItem} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                {/* Description spans different columns if it's a note row */}
                <div className={item.isNote ? "col-span-11" : "col-span-5"}>
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    placeholder="Item description"
                  />
                </div>

                {!item.isNote && (
                  <>
                    <div className="col-span-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", parseFloat(e.target.value) || 0)
                        }
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Rate</Label>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(index, "rate", parseFloat(e.target.value) || 0)
                        }
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) =>
                          updateItem(index, "amount", parseFloat(e.target.value) || 0)
                        }
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </>
                )}

                <div className="col-span-1 flex justify-end">
                  <Button
                    onClick={() => removeItem(index)}
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center">
              <span>Subtotal:</span>
              <span className="font-medium">${data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>Tax Rate:</span>
                <Input
                  type="number"
                  value={data.taxRate}
                  onChange={(e) => updateTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-20"
                  min="0"
                  max="100"
                  step="0.01"
                />
                <span>%</span>
              </div>
              <span className="font-medium">${data.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${data.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Information (Locked by default) */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Bank Information</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsBankLocked((v) => !v)}
            className="flex items-center gap-2"
          >
            {isBankLocked ? (
              <>
                <Lock className="h-4 w-4" />
                Unlock to edit
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4" />
                Lock
              </>
            )}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bankBeneficiaryName">Beneficiary Name</Label>
              <Input
                id="bankBeneficiaryName"
                value={data.bankBeneficiaryName || ""}
                onChange={(e) => updateField("bankBeneficiaryName", e.target.value)}
                placeholder="ITEX GLOBAL SOURCING"
                disabled={isBankLocked}
              />
            </div>
            <div>
              <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
              <Input
                id="bankAccountNumber"
                value={data.bankAccountNumber || ""}
                onChange={(e) => updateField("bankAccountNumber", e.target.value)}
                placeholder="Account number"
                disabled={isBankLocked}
              />
            </div>
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                value={data.bankName || ""}
                onChange={(e) => updateField("bankName", e.target.value)}
                placeholder="Bank name"
                disabled={isBankLocked}
              />
            </div>
            <div>
              <Label htmlFor="bankBranch">Bank Branch</Label>
              <Input
                id="bankBranch"
                value={data.bankBranch || ""}
                onChange={(e) => updateField("bankBranch", e.target.value)}
                placeholder="Branch"
                disabled={isBankLocked}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="bankAddress">Bank Address</Label>
            <Input
              id="bankAddress"
              value={data.bankAddress || ""}
              onChange={(e) => updateField("bankAddress", e.target.value)}
              placeholder="Full bank address"
              disabled={isBankLocked}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="bankSwiftCode">SWIFT Code</Label>
              <Input
                id="bankSwiftCode"
                value={data.bankSwiftCode || ""}
                onChange={(e) => updateField("bankSwiftCode", e.target.value)}
                placeholder="SWIFT"
                disabled={isBankLocked}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={data.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              placeholder="Additional notes or comments..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={data.terms}
              onChange={(e) => updateField("terms", e.target.value)}
              placeholder="Payment terms and conditions..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isLoading} size="lg">
          {isLoading ? "Saving..." : "Save Invoice"}
        </Button>
      </div>
    </div>
  );
}