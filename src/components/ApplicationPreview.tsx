import { Card } from "@/components/ui/card";
import { ApplicationData } from "./ApplicationForm";

interface ApplicationPreviewProps {
  data: ApplicationData;
}

export function ApplicationPreview({ data }: ApplicationPreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const amount = `${data.commissionCurrency}${data.commissionAmount}`;
  const inWords = data.commissionInWords || "";
  const transferCcy = data.transferCurrency || "BDT Taka";

  return (
    <Card className="w-full max-w-[210mm] mx-auto bg-white text-black print:shadow-none print:border-0 print:m-0 font-serif">
      <div className="px-[18mm] py-[14mm] print:px-[18mm] print:py-[14mm] text-[13.5px] leading-[1.7]">

        {/* Date — top right aligned, formal letter style */}
        <p className="mb-10">{formatDate(data.date)}</p>

        {/* Recipient address block */}
        <div className="mb-8 leading-[1.9]">
          <p>To</p>
          <p>The Manager</p>
          <p>Islami Bank Bangladesh PLC</p>
          <p>Tongi Branch, Foteh Mansion, 19 Main Road,</p>
          <p>Tongi Gazipur -1710, Bangladesh.</p>
        </div>

        {/* Subject line — bold, slightly larger */}
        <p className="mb-8 font-semibold">
          Sub: To transfer payment amount {amount}{inWords ? ` (${inWords})` : ""}
        </p>

        {/* Salutation */}
        <p className="mb-4">Dear sir,</p>

        {/* Body paragraph */}
        <p className="mb-4 text-justify">
          Please be informed you that the name of the supplier company- {data.supplierCompanyName} , Country of origin-{data.supplierCountry} has sent me my business commission amount {amount}{inWords ? ` ( ${inWords} )` : ""} . I request you to send the same amount to my business account -{data.recipientAccountNumber} in {transferCcy}.
        </p>

        {/* Closing sentence */}
        <p className="mb-8">So this is for your kind information and necessary action please .</p>

        {/* Sign-off */}
        <p>Thanks, and regards</p>
        <p className="mt-1 mb-10">Mohammad Imdadul Hoque</p>

        {/* Seal (top) then Signature (bottom) */}
        <div className="flex flex-col items-start gap-1 mb-10">
          {data.sealUrl && (
            <img src={data.sealUrl} alt="Seal" className="h-20 w-20 object-contain" />
          )}
          {data.signatureUrl && (
            <img src={data.signatureUrl} alt="Signature" className="h-12 w-auto object-contain" />
          )}
        </div>

        {/* Footer — company name & account */}
        <div className="leading-[1.9]">
          <p className="font-semibold">ITEX GLOBAL SOURCING</p>
          <p>A/C no-{data.recipientAccountNumber}</p>
        </div>

      </div>
    </Card>
  );
}
