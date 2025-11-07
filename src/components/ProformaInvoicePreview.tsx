import { Card } from "@/components/ui/card";
import { ProformaInvoiceData } from "./ProformaInvoiceForm";

interface ProformaInvoicePreviewProps {
  data: ProformaInvoiceData;
}

export function ProformaInvoicePreview({ data }: ProformaInvoicePreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full max-w-[210mm] mx-auto p-4 bg-white text-black print:shadow-none print:border-0 print:m-0 print:p-4 font-sans print:w-[210mm]">
      {/* Header with Logo and Company Name */}
      <div className="flex items-start justify-between mb-2">
        <div className="w-16">
          {data.companyLogoUrl && (
            <img src={data.companyLogoUrl} alt="Company Logo" className="h-16 w-16 object-contain" />
          )}
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-2xl font-bold uppercase">{data.companyName}</h1>
          <p className="text-xs italic mt-1">{data.companyAddress}</p>
        </div>
        <div className="w-16"></div>
      </div>

      {/* Title */}
      <div className="text-center mb-3">
        <h2 className="text-lg font-bold uppercase tracking-wider">PROFORMA INVOICE</h2>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6 mb-4 text-xs">
        {/* Left Column */}
        <div className="space-y-2">
          <div>
            <span className="font-semibold italic">INVOICE NO.:</span>
            <span className="ml-2">{data.invoiceNumber}</span>
          </div>
          <div>
            <div className="font-semibold italic mb-1">TO:</div>
            <div className="ml-0">
              <p className="font-medium">{data.clientName}</p>
            </div>
          </div>
          <div>
            <div className="font-semibold italic mb-1">ADD:</div>
            <div className="ml-0">
              <p className="whitespace-pre-line">{data.clientAddress}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="font-semibold italic">Payment Term:</span>
            <span className="ml-2">{data.paymentTerm}</span>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          <div>
            <span className="font-semibold italic">DATE.:</span>
            <span className="ml-2">{formatDate(data.date)}</span>
          </div>
          <div>
            <span className="font-semibold italic">SUPPLIER:</span>
            <span className="ml-2">{data.shipper}</span>
          </div>
          <div>
            <span className="font-semibold italic">TELEPHONE NUMBER:</span>
            <span className="ml-2">{data.telephoneNumber}</span>
          </div>
          <div>
            <span className="font-semibold italic">DESTINATION:</span>
            <span className="ml-2">{data.destination}</span>
          </div>
          <div>
            <span className="font-semibold italic">DELIVERY TIME:</span>
            <span className="ml-2">{data.deliveryTime}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-4">
        <table className="w-full border-2 border-black text-xs">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="border-r-2 border-black p-1 text-left font-bold italic w-[15%]">SHIPPING MARKS</th>
              <th className="border-r-2 border-black p-1 text-left font-bold italic w-[35%]">DESCRIPTION OF GOODS</th>
              <th className="border-r-2 border-black p-1 text-left font-bold italic w-[30%]">UNIT PRICE</th>
              <th className="p-1 text-left font-bold italic w-[20%]">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {data.items.length > 0 ? (
              data.items.map((item, index) => (
                <tr key={index} className="border-b border-black">
                  <td className="border-r-2 border-black p-1 align-top">{item.shippingMarks}</td>
                  <td className="border-r-2 border-black p-1 align-top whitespace-pre-line">{item.description}</td>
                  <td className="border-r-2 border-black p-1 align-top">{item.unitPrice}</td>
                  <td className="p-1 align-top text-right">USD {item.amount.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr className="border-b border-black">
                <td colSpan={4} className="p-2 text-center text-gray-400">No items added yet</td>
              </tr>
            )}
            <tr>
              <td colSpan={3} className="border-r-2 border-black p-1"></td>
              <td className="p-1 text-right font-bold italic">TOTAL: USD {data.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        {data.totalInWords && (
          <div className="mt-1 text-xs font-bold italic text-center">
            {data.totalInWords}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="grid grid-cols-2 gap-6 text-xs">
        {/* Left: Bank Info */}
        <div className="space-y-1">
          <p className="font-semibold">Bank Info:</p>
          {data.advisingBank && <p>Advising Bank: {data.advisingBank}</p>}
          {data.bankAddress && <p>Address of bank: {data.bankAddress}</p>}
          {data.beneficiaryName && <p>Benificiary name: {data.beneficiaryName}</p>}
          {data.accountNumber && <p>Account No.: {data.accountNumber}</p>}
          {data.swiftCode && <p>SWIFT CODE: {data.swiftCode}</p>}
          
          <div className="mt-4 space-y-1">
            {data.origin && <p>ORIGIN: {data.origin}</p>}
            {data.portOfLoading && <p>PORT OF LOADING: {data.portOfLoading}</p>}
            {data.portOfDestination && <p>PORT OF DESTINATION: {data.portOfDestination}</p>}
            {data.partialShipment && <p>PARTIAL SHIPMENT : {data.partialShipment}</p>}
            {data.transshipment && <p>TRANSSHIPMENT: {data.transshipment}</p>}
          </div>
        </div>

        {/* Right: Company Seal */}
        <div className="flex items-end justify-end">
          {data.companySealUrl && (
            <img src={data.companySealUrl} alt="Company Seal" className="h-32 w-32 object-contain" />
          )}
        </div>
      </div>

      {/* Terms */}
      {data.terms && (
        <div className="mt-3 text-xs font-bold uppercase whitespace-pre-line">
          {data.terms}
        </div>
      )}
    </Card>
  );
}
