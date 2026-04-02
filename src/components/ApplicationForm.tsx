import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageSelector } from "@/components/ImageSelector";

export interface ApplicationData {
  date: string;
  commissionCurrency: string;
  commissionAmount: string;
  commissionInWords: string;
  supplierCompanyName: string;
  supplierCountry: string;
  recipientAccountNumber: string;
  transferCurrency: string;
  signatureUrl?: string;
  sealUrl?: string;
  status?: "draft" | "sent" | "approved" | "rejected";
}

interface ApplicationFormProps {
  data: ApplicationData;
  onChange: (data: ApplicationData) => void;
}

export function ApplicationForm({ data, onChange }: ApplicationFormProps) {
  const set = (key: keyof ApplicationData, value: string) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="space-y-6">

      {/* Date */}
      <Card>
        <CardHeader>
          <CardTitle>Date</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={data.date}
              onChange={(e) => set("date", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Commission */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="w-20">
              <Label htmlFor="commissionCurrency">Currency</Label>
              <Input
                id="commissionCurrency"
                placeholder="€"
                value={data.commissionCurrency}
                onChange={(e) => set("commissionCurrency", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="commissionAmount">Amount</Label>
              <Input
                id="commissionAmount"
                placeholder="813"
                value={data.commissionAmount}
                onChange={(e) => set("commissionAmount", e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="commissionInWords">Amount in Words</Label>
            <Input
              id="commissionInWords"
              placeholder="Eight Hundred and thirteen only"
              value={data.commissionInWords}
              onChange={(e) => set("commissionInWords", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Supplier */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="supplierCompanyName">Supplier Company Name</Label>
            <Input
              id="supplierCompanyName"
              placeholder="JENIUSCHEM"
              value={data.supplierCompanyName}
              onChange={(e) => set("supplierCompanyName", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="supplierCountry">Country of Origin</Label>
            <Input
              id="supplierCountry"
              placeholder="ITALY"
              value={data.supplierCountry}
              onChange={(e) => set("supplierCountry", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="recipientAccountNumber">Account Number</Label>
            <Input
              id="recipientAccountNumber"
              placeholder="205002160100494600"
              value={data.recipientAccountNumber}
              onChange={(e) => set("recipientAccountNumber", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="transferCurrency">Transfer Currency / Denomination</Label>
            <Input
              id="transferCurrency"
              placeholder="BDT Taka"
              value={data.transferCurrency}
              onChange={(e) => set("transferCurrency", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Signature & Seal */}
      <Card>
        <CardHeader>
          <CardTitle>Signature &amp; Seal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Signature</Label>
            <ImageSelector
              category="signature"
              value={data.signatureUrl || ""}
              onChange={(value) => set("signatureUrl", value)}
              label="Select Signature"
              id="signatureUrl"
            />
          </div>
          <div>
            <Label>Seal</Label>
            <ImageSelector
              category="seal"
              value={data.sealUrl || ""}
              onChange={(value) => set("sealUrl", value)}
              label="Select Seal"
              id="sealUrl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Status */}
      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(["draft", "sent", "approved", "rejected"] as const).map((s) => (
              <Button
                key={s}
                variant={data.status === s ? "default" : "outline"}
                onClick={() => onChange({ ...data, status: s })}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
