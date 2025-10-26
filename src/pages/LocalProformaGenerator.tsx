import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Printer, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { LocalProformaForm, LocalProformaData } from "@/components/LocalProformaForm";
import { LocalProformaPreview } from "@/components/LocalProformaPreview";

export default function LocalProformaGenerator() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const createLocalProforma = useMutation(api.localProformas.create);
  const updateLocalProforma = useMutation(api.localProformas.update);
  const generateNumber = useQuery(api.localProformas.generateInvoiceNumber);
  const existingLocalProforma = useQuery(
    api.localProformas.getById,
    isEditing && id ? { id: id as any } : "skip"
  );

  const [isSaving, setIsSaving] = useState(false);
  const [localProformaData, setLocalProformaData] = useState<LocalProformaData>({
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    toName: "",
    toAddress: "",
    fromName: "ITEX GLOBAL SOURCING",
    fromAddress: "9 Rang Heritage, House-38, Shahmokhdum avenue,\nSector-13, Uttara Dhaka 1230, Bangladesh.",
    items: [],
    totalInWords: "",
    paymentTerms: "Cash",
    signatureUrl: "",
    sealUrl: "",
    status: "draft",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (generateNumber && !isEditing) {
      setLocalProformaData((prev) => ({ ...prev, invoiceNumber: generateNumber }));
    }
  }, [generateNumber, isEditing]);

  useEffect(() => {
    if (existingLocalProforma && isEditing) {
      setLocalProformaData({
        invoiceNumber: existingLocalProforma.invoiceNumber,
        date: existingLocalProforma.date,
        toName: existingLocalProforma.toName,
        toAddress: existingLocalProforma.toAddress,
        fromName: existingLocalProforma.fromName,
        fromAddress: existingLocalProforma.fromAddress,
        items: existingLocalProforma.items,
        totalInWords: existingLocalProforma.totalInWords,
        paymentTerms: existingLocalProforma.paymentTerms,
        signatureUrl: existingLocalProforma.signatureUrl || "",
        sealUrl: existingLocalProforma.sealUrl || "",
        status: existingLocalProforma.status || "draft",
      });
    }
  }, [existingLocalProforma, isEditing]);

  const handleSave = async () => {
    try {
      setIsSaving(true);

      if (isEditing && id) {
        await updateLocalProforma({
          id: id as any,
          ...localProformaData,
        });
        toast.success("Local proforma updated successfully!");
      } else {
        const newId = await createLocalProforma(localProformaData);
        toast.success("Local proforma created successfully!");
        navigate(`/local-proforma/${newId}`);
      }
    } catch (error) {
      console.error("Error saving local proforma:", error);
      toast.error("Failed to save local proforma");
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
                  {isEditing ? "Edit Local Proforma" : "New Local Proforma"}
                </h1>
                <p className="text-sm text-gray-600">{localProformaData.invoiceNumber}</p>
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
              <LocalProformaForm
                data={localProformaData}
                onChange={setLocalProformaData}
                onSave={handleSave}
                isLoading={isSaving}
              />
            </div>

            {/* Right: Preview */}
            <div className="xl:sticky xl:top-24 h-fit print:static overflow-x-auto print:overflow-visible">
              <LocalProformaPreview data={localProformaData} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
