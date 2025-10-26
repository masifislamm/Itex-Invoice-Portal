import { Card } from "@/components/ui/card";
import { LocalChalanData } from "./LocalChalanForm";

interface LocalChalanPreviewProps {
  data: LocalChalanData;
}

export function LocalChalanPreview({ data }: LocalChalanPreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, ".");
  };

  const calculateTotalQuantity = () => {
    return data.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <Card className="w-full max-w-[210mm] mx-auto p-8 bg-white text-black print:shadow-none print:border-0 print:m-0 print:p-8 font-sans print:w-[210mm]">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Challan</h1>
      </div>

      {/* Invoice Number and Date */}
      <div className="flex justify-between mb-6 text-sm">
        <div>
          <span className="font-semibold">No:</span>
          <span className="ml-2">{data.invoiceNumber || "IGS20250909"}</span>
        </div>
        <div>
          <span className="font-semibold">Date:</span>
          <span className="ml-2">{formatDate(data.date)}</span>
        </div>
      </div>

      {/* To Section */}
      <div className="mb-4 text-sm">
        <div className="font-semibold mb-1">To</div>
        <div className="ml-0">
          <p className="font-medium">{data.toName || "Recipient Name"}</p>
          <p className="whitespace-pre-line">{data.toAddress || "Recipient Address"}</p>
        </div>
      </div>

      {/* From Section */}
      <div className="mb-6 text-sm">
        <div className="font-semibold mb-1">From</div>
        <div className="ml-0">
          <p className="font-medium">{data.fromName || "ITEX GLOBAL SOURCING"}</p>
          <p className="whitespace-pre-line">{data.fromAddress || "Company Address"}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full border-2 border-black text-sm">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="border-r-2 border-black p-2 text-left font-semibold w-12">Sln</th>
              <th className="border-r-2 border-black p-2 text-left font-semibold">Description of the goods</th>
              <th className="border-r-2 border-black p-2 text-left font-semibold w-24">Unit</th>
              <th className="p-2 text-left font-semibold w-32">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length > 0 ? (
              data.items.map((item, index) => (
                <tr key={index} className="border-b border-black">
                  <td className="border-r-2 border-black p-2 text-center">{item.sln}</td>
                  <td className="border-r-2 border-black p-2 whitespace-pre-line">{item.description}</td>
                  <td className="border-r-2 border-black p-2 text-center">{item.unit}</td>
                  <td className="p-2 text-right">{item.quantity}</td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-black">
                <td colSpan={4} className="p-4 text-center text-gray-400">No items added yet</td>
              </tr>
            )}
            {/* Total Row */}
            {data.items.length > 0 && (
              <tr className="border-b-2 border-black">
                <td colSpan={3} className="border-r-2 border-black p-2 text-left font-semibold">
                  {data.inWords || "In words"}
                </td>
                <td className="p-2 text-right font-semibold">{calculateTotalQuantity()}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Signature Section - Right Aligned */}
      <div className="mt-16 flex justify-end">
        <div className="text-center">
          <div className="mb-2 flex flex-col items-center gap-2">
            {data.sealUrl && (
              <img src={data.sealUrl} alt="Seal" className="h-24 w-24 object-contain" />
            )}
            {data.signatureUrl && (
              <img src={data.signatureUrl} alt="Signature" className="h-12 w-auto object-contain" />
            )}
          </div>
          <div className="pt-2 text-sm min-w-[250px]">
            <p>Authorizing signature & Seal</p>
          </div>
        </div>
      </div>
    </Card>
  );
}