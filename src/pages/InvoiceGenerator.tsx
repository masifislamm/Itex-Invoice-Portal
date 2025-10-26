import { InvoiceForm, InvoiceData } from "@/components/InvoiceForm";
import { InvoicePreview } from "@/components/InvoicePreview";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

export default function InvoiceGenerator() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  // Only treat as editing when id exists and isn't "new"
  const isEditing = Boolean(id && id !== "new");

  const createInvoice = useMutation(api.invoices.create);
  const updateInvoice = useMutation(api.invoices.update);
  const generateInvoiceNumber = useQuery(api.invoices.generateInvoiceNumber);
  const existingInvoice = useQuery(
    api.invoices.getById,
    isEditing ? { id: id as any } : "skip" // skip query when creating new
  );

  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "IGS20250710",
    companyName: "ITEX GLOBAL SOURCING",
    companyAddress: "9 Rang heritage , Flat A5, House-38, Shahmohddum avenue, Sector-13, Uttara, Dhaka-1230, Bangladesh",
    companyCity: "",
    companyState: "",
    companyZip: "",
    companyCountry: "Bangladesh",
    companyEmail: "imdad@itexglobalsourcing.com",
    companyPhone: "+8801716108470",
    tin: "314502259212",
    bin: "005527489-0202",

    clientName: "",
    clientAddress: "",
    clientCity: "",
    clientState: "",
    clientZip: "",
    clientCountry: "Bangladesh",
    clientEmail: "",
    clientPhone: "",
    clientFax: "",

    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "sent",

    reference: "6-19/02/2025",
    agentName: "Mr. Mohammad Imdadul Hoque.",
    agentMobile: "+8801716108470",

    items: [],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    currency: "EUR",
    commissionPercent: 0,
    notes: "",
    terms: "",
    bankBeneficiaryName: "ITEX GLOBAL SOURCING",
    bankAccountNumber: "20502160100494600",
    bankName: "ISLAMI BANK BANGLADESH LIMITED",
    bankBranch: "Tongi Branch",
    bankAddress: "Foteh Mansion, 19 Main Road, Tongi, Gazipur-1710, Bangladesh",
    bankSwiftCode: "IBBLBDDH216",
    totalInWords: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Set invoice number when component loads
  useEffect(() => {
    if (generateInvoiceNumber && !isEditing) {
      setInvoiceData(prev => ({
        ...prev,
        invoiceNumber: generateInvoiceNumber,
      }));
    }
  }, [generateInvoiceNumber, isEditing]);

  // Load existing invoice data
  useEffect(() => {
    if (existingInvoice && isEditing) {
      setInvoiceData({
        invoiceNumber: existingInvoice.invoiceNumber,
        companyName: existingInvoice.companyName,
        companyAddress: existingInvoice.companyAddress,
        companyCity: existingInvoice.companyCity,
        companyState: existingInvoice.companyState,
        companyZip: existingInvoice.companyZip,
        companyCountry: existingInvoice.companyCountry,
        companyEmail: existingInvoice.companyEmail,
        companyPhone: existingInvoice.companyPhone,
        tin: existingInvoice.tin || "",
        bin: existingInvoice.bin || "",
        clientName: existingInvoice.clientName,
        clientAddress: existingInvoice.clientAddress,
        clientCity: existingInvoice.clientCity,
        clientState: existingInvoice.clientState,
        clientZip: existingInvoice.clientZip,
        clientCountry: existingInvoice.clientCountry,
        clientEmail: existingInvoice.clientEmail || "",
        clientPhone: existingInvoice.clientPhone || "",
        clientFax: existingInvoice.clientFax || "",
        issueDate: existingInvoice.issueDate,
        dueDate: existingInvoice.dueDate,
        status: existingInvoice.status,
        reference: existingInvoice.reference || "",
        agentName: existingInvoice.agentName || "",
        agentMobile: existingInvoice.agentMobile || "",
        items: existingInvoice.items,
        subtotal: existingInvoice.subtotal,
        taxRate: existingInvoice.taxRate,
        taxAmount: existingInvoice.taxAmount,
        total: existingInvoice.total,
        currency: existingInvoice.currency || "EUR",
        commissionPercent: (existingInvoice as any).commissionPercent ?? 0,
        notes: existingInvoice.notes || "",
        terms: existingInvoice.terms || "",
        bankBeneficiaryName: existingInvoice.bankBeneficiaryName || "",
        bankAccountNumber: existingInvoice.bankAccountNumber || "",
        bankName: existingInvoice.bankName || "",
        bankBranch: existingInvoice.bankBranch || "",
        bankAddress: existingInvoice.bankAddress || "",
        bankSwiftCode: existingInvoice.bankSwiftCode || "",
        totalInWords: existingInvoice.totalInWords || "",
      });
    }
  }, [existingInvoice, isEditing]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleSave = async () => {
    if (!invoiceData.clientName.trim()) {
      toast.error("Please enter a client name");
      return;
    }

    if (invoiceData.items.length === 0) {
      toast.error("Please add at least one line item");
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        await updateInvoice({
          id: id as any,
          ...invoiceData,
          // Ensure status matches Convex union type
          status: invoiceData.status as "draft" | "sent" | "paid" | "overdue" | "cancelled",
        });
        toast.success("Invoice updated successfully!");
      } else {
        const invoiceId = await createInvoice({
          ...invoiceData,
          // Ensure status matches Convex union type
          status: invoiceData.status as "draft" | "sent" | "paid" | "overdue" | "cancelled",
        });
        toast.success("Invoice created successfully!");
        navigate(`/invoice/${invoiceId}`);
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      toast.error("Failed to save invoice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 pt-16 print:pt-0 print:bg-white"
    >
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 fixed top-0 inset-x-0 z-50 w-full print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Invoice" : "Create New Invoice"}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handlePrint}>
                <Download className="h-4 w-4 mr-2" />
                Print/Download
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Invoice"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:px-0 print:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="print:hidden"
          >
            <InvoiceForm
              data={invoiceData}
              onChange={setInvoiceData}
              onSave={handleSave}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-8 lg:h-fit print:static"
          >
            <div className="mb-4 print:hidden">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Live Preview</h2>
              <p className="text-sm text-gray-600">
                This is how your invoice will look when printed or sent to clients.
              </p>
            </div>
            <InvoicePreview data={invoiceData} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}