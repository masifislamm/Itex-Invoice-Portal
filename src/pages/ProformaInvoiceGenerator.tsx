import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Printer, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { ProformaInvoiceForm, ProformaInvoiceData } from "@/components/ProformaInvoiceForm";
import { ProformaInvoicePreview } from "@/components/ProformaInvoicePreview";

export default function ProformaInvoiceGenerator() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const createProforma = useMutation(api.proformaInvoices.create);
  const updateProforma = useMutation(api.proformaInvoices.update);
  const generateNumber = useQuery(api.proformaInvoices.generateInvoiceNumber);
  const existingProforma = useQuery(
    api.proformaInvoices.getById,
    isEditing && id ? { id: id as any } : "skip"
  );

  const [isSaving, setIsSaving] = useState(false);
  const [proformaData, setProformaData] = useState<ProformaInvoiceData>({
    invoiceNumber: "",
    companyName: "ITEX GLOBAL SOURCING",
    companyAddress: "123 Business Street, Dhaka, Bangladesh",
    companyLogoUrl: "",
    companySealUrl: "",
    clientName: "",
    clientAddress: "",
    date: new Date().toISOString().split("T")[0],
    shipper: "ITEX GLOBAL SOURCING",
    telephoneNumber: "+8801716108470",
    destination: "",
    deliveryTime: "",
    paymentTerm: "100% L/C AT SIGHT",
    items: [],
    total: 0,
    totalInWords: "",
    advisingBank: "",
    bankAddress: "",
    beneficiaryName: "ITEX GLOBAL SOURCING",
    accountNumber: "20502160100494600",
    swiftCode: "IBBLBDDH216",
    origin: "Bangladesh",
    portOfLoading: "",
    portOfDestination: "",
    partialShipment: "ALLOWED",
    transshipment: "ALLOWED",
    terms: "ORIGINAL LETTER OF CREDIT MUST BE ARRANGED WITHIN 7 DAYS FROM THE PI RELEASE DATE.\nTHE UNIT PRICE OF THIS PROFORMA INVOICE IS VALID FOR 7 DAYS",
    status: "draft",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (generateNumber && !isEditing) {
      setProformaData((prev) => ({ ...prev, invoiceNumber: generateNumber }));
    }
  }, [generateNumber, isEditing]);

  useEffect(() => {
    if (existingProforma && isEditing) {
      setProformaData({
        invoiceNumber: existingProforma.invoiceNumber,
        companyName: existingProforma.companyName,
        companyAddress: existingProforma.companyAddress,
        companyLogoUrl: existingProforma.companyLogoUrl || "",
        companySealUrl: existingProforma.companySealUrl || "",
        clientName: existingProforma.clientName,
        clientAddress: existingProforma.clientAddress,
        date: existingProforma.date,
        shipper: existingProforma.shipper,
        telephoneNumber: existingProforma.telephoneNumber,
        destination: existingProforma.destination,
        deliveryTime: existingProforma.deliveryTime,
        paymentTerm: existingProforma.paymentTerm,
        items: existingProforma.items,
        total: existingProforma.total,
        totalInWords: existingProforma.totalInWords,
        advisingBank: existingProforma.advisingBank,
        bankAddress: existingProforma.bankAddress,
        beneficiaryName: existingProforma.beneficiaryName,
        accountNumber: existingProforma.accountNumber,
        swiftCode: existingProforma.swiftCode,
        origin: existingProforma.origin,
        portOfLoading: existingProforma.portOfLoading,
        portOfDestination: existingProforma.portOfDestination,
        partialShipment: existingProforma.partialShipment,
        transshipment: existingProforma.transshipment,
        terms: existingProforma.terms,
        status: existingProforma.status || "draft",
      });
    }
  }, [existingProforma, isEditing]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (isEditing && id) {
        await updateProforma({
          id: id as any,
          ...proformaData,
        });
        toast.success("Proforma invoice updated successfully!");
      } else {
        const newId = await createProforma(proformaData);
        toast.success("Proforma invoice created successfully!");
        navigate(`/proforma/${newId}`);
      }
    } catch (error) {
      console.error("Error saving proforma invoice:", error);
      toast.error("Failed to save proforma invoice");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 print:min-h-0 print:pt-0 print:bg-white print:m-0 print:bg-none"
    >
      {/* Fixed Header */}
      <div className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-10 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isEditing ? "Edit Proforma Invoice" : "New Proforma Invoice"}
                </h1>
                <p className="text-sm text-gray-600">{proformaData.invoiceNumber}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handlePrint} variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8 print:pt-0 print:px-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 print:grid-cols-1 print:gap-0">
            {/* Left: Form */}
            <div className="print:hidden">
              <ProformaInvoiceForm
                data={proformaData}
                onChange={setProformaData}
                onSave={handleSave}
                isLoading={isSaving}
              />
            </div>

            {/* Right: Preview */}
            <div className="xl:sticky xl:top-24 h-fit print:static overflow-x-auto print:overflow-visible">
              <ProformaInvoicePreview data={proformaData} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
