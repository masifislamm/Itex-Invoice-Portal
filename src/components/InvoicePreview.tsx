import { Card } from "@/components/ui/card";
import { InvoiceData } from "./InvoiceForm";

interface InvoicePreviewProps {
  data: InvoiceData;
}

export function InvoicePreview({ data }: InvoicePreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Map status to pill styles (used in header meta)
  const statusClasses = (status: InvoiceData["status"]) =>
    status === "paid"
      ? "bg-green-100 text-green-800"
      : status === "sent"
      ? "bg-blue-100 text-blue-800"
      : status === "overdue"
      ? "bg-red-100 text-red-800"
      : status === "cancelled"
      ? "bg-gray-100 text-gray-800"
      : "bg-yellow-100 text-yellow-800";

  const currencyLabel = (data.currency || "EUR").toUpperCase() === "EUR" ? "EURO" : (data.currency || "USD");
  const formatMoney = (n: number) => {
    const cur = (data.currency || "EUR").toUpperCase();
    const symbol = cur === "EUR" ? "€" : cur === "USD" ? "$" : "";
    return `${symbol}${n.toFixed(2)}`;
  };

  // Add: commission percent for preview logic
  const commissionPercent = Number(data.commissionPercent ?? 0);

  return (
    <Card className="p-4 bg-white text-black print:shadow-none print:border-0 print:p-2">
      {/* Modern Header */}
      <div className="mb-2 rounded-xl border border-gray-200 shadow-sm print:shadow-none overflow-hidden">
        {/* Brand bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-gradient-to-r from-[#283273] to-[#283273] text-white px-4 py-3">
          <div className="flex items-center gap-4">
            <img
              src="https://harmless-tapir-303.convex.cloud/api/storage/2ce54506-685b-4831-b850-35b0ca62fc82"
              alt="Company Logo"
              className="h-8 w-8 rounded-lg bg-white/10 p-1"
            />
            <div>
              <div className="text-base md:text-lg font-extrabold tracking-wide leading-tight">
                {data.companyName || "ITEX GLOBAL SOURCING"}
              </div>
            </div>
          </div>
          <div className="text-[10px] md:text-[11px] opacity-95 text-white/90 md:text-right leading-tight space-y-0.5">
            <div>{data.companyAddress}</div>
            {(data.companyCity || data.companyZip) && (
              <div>
                {data.companyCity}
                {data.companyState ? `, ${data.companyState}` : ""} {data.companyZip}
              </div>
            )}
            {/* Hide default 'Bangladesh' placeholder for company country */}
            {data.companyCountry &&
              data.companyCountry.trim().toLowerCase() !== "bangladesh" && (
                <div>{data.companyCountry}</div>
              )}
            <div className="flex flex-col md:items-end md:justify-end">
              {data.companyEmail && <span>{data.companyEmail}</span>}
              {data.companyPhone && <span>{data.companyPhone}</span>}
            </div>
          </div>
        </div>
        {/* Meta row - make single line */}
        <div className="flex items-center justify-between bg-white px-4 py-2 gap-3">
          <div className="flex items-center gap-6 flex-wrap md:flex-nowrap">
            <div className="whitespace-nowrap">
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Invoice No</div>
              <div className="font-semibold text-sm leading-tight">{data.invoiceNumber || "INV-XXXX-XXXX"}</div>
            </div>
            <div className="whitespace-nowrap">
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Date</div>
              <div className="font-semibold text-sm leading-tight">{formatDate(data.issueDate)}</div>
            </div>
            <div className="whitespace-nowrap">
              <div className="text-[10px] uppercase tracking-wider text-gray-500">Reference</div>
              <div className="font-semibold text-sm leading-tight">{data.reference || "-"}</div>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${statusClasses(
                data.status
              )}`}
            >
              {data.status}
            </span>
          </div>
        </div>
      </div>

      {/* Agents only (compact) */}
      <div className="mt-1 mb-2">
        {(data.agentName || data.agentMobile) && (
          <div className="text-[11px] md:text-sm text-gray-800 leading-tight">
            {data.agentName && (
              <p>
                <span className="font-semibold">Agents:</span> {data.agentName}
              </p>
            )}
            {data.agentMobile && (
              <p>
                <span className="font-semibold">Mobile:</span> {data.agentMobile}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bill To Section */}
      <div className="mb-3">
        <div className="bg-gray-50 p-2 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-1 text-xs">BILL TO:</h3>
          <div className="text-xs leading-relaxed">
            <p className="font-medium">{data.clientName || "Client Name"}</p>
            <p>{data.clientAddress}</p>
            <p>
              {data.clientCity && data.clientState && data.clientZip
                ? `${data.clientCity}, ${data.clientState} ${data.clientZip}`
                : ""}
            </p>
            {/* Hide default 'Bangladesh' placeholder */}
            {data.clientCountry &&
              data.clientCountry.trim().toLowerCase() !== "bangladesh" && (
                <p>{data.clientCountry}</p>
              )}
            {data.clientPhone && <p>Telefono {data.clientPhone}</p>}
            {data.clientFax && <p>Fax {data.clientFax}</p>}
            {data.clientEmail && <p>Email {data.clientEmail}</p>}
          </div>
        </div>
      </div>

      {/* Line Items Table in template style - make more compact */}
      <div className="mb-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-1.5 font-semibold">DESCRIPTION</th>
              <th className="text-right py-1.5 font-semibold w-24">QUANTITY KGS</th>
              <th className="text-right py-1.5 font-semibold w-48 whitespace-nowrap">COMMISSION AMOUNT {currencyLabel}</th>
            </tr>
          </thead>
          <tbody>
            {
              // Build a visible item list that hides the auto-generated commission line (qty === 0 and starts with "Commission ")
              (commissionPercent > 0
                ? data.items.filter(
                    (item) =>
                      !(
                        !item.isNote &&
                        (Number(item.quantity) || 0) === 0 &&
                        typeof item.description === "string" &&
                        item.description.startsWith("Commission ")
                      )
                  )
                : data.items
              ).length > 0 ? (
                (commissionPercent > 0
                  ? data.items.filter(
                      (item) =>
                        !(
                          !item.isNote &&
                          (Number(item.quantity) || 0) === 0 &&
                          typeof item.description === "string" &&
                          item.description.startsWith("Commission ")
                        )
                    )
                  : data.items
                ).map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2">
                      {item.description || "Item description"}
                    </td>
                    <td className="text-right py-2">
                      {item.isNote ? "" : item.quantity}
                    </td>
                    <td className="text-right py-2">
                      {
                        // Notes never show amount
                        item.isNote
                          ? ""
                          : commissionPercent > 0
                            // With commission set: show per-line commission next to the product (qty > 0).
                            // Hide amounts for any qty=0 lines.
                            ? ((Number(item.quantity) || 0) > 0
                                ? formatMoney(
                                    (Number(item.amount) || 0) *
                                      (commissionPercent / 100)
                                  )
                                : "")
                            // No commission: show normal item amount
                            : formatMoney(Number(item.amount) || 0)
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-gray-200">
                  <td className="py-2 text-gray-400">No items added yet</td>
                  <td className="text-right py-2 text-gray-400">-</td>
                  <td className="text-right py-2 text-gray-400">{formatMoney(0)}</td>
                </tr>
              )
            }
            {typeof data.commissionPercent === "number" &&
              data.commissionPercent > 0 && (
                <tr className="border-b border-gray-200">
                  <td className="py-2">
                    Commission is {data.commissionPercent}%
                  </td>
                  <td className="text-right py-2"></td>
                  <td className="text-right py-2"></td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* Totals (compact) */}
      <div className="flex justify-end mb-2">
        <div className="w-60 text-sm">
          <div className="flex justify-between py-1.5">
            <span>Subtotal:</span>
            <span>{formatMoney(data.subtotal)}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span>Tax ({data.taxRate}%):</span>
            <span>{formatMoney(data.taxAmount)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-t border-gray-300 font-bold text-base">
            <span>Total:</span>
            <span>{formatMoney(data.total)}</span>
          </div>
        </div>
      </div>

      {/* Total in words */}
      {data.totalInWords && (
        <div className="mb-3 text-xs">
          <p>Total {data.totalInWords}</p>
        </div>
      )}

      {/* Bank Info (keep as one element on page) */}
      {(data.bankBeneficiaryName || data.bankAccountNumber || data.bankName || data.bankBranch || data.bankAddress || data.bankSwiftCode) && (
        <div
          className="mt-3 bg-gray-50 p-2 rounded-lg"
          style={{
            breakInside: "avoid",
            pageBreakInside: "avoid",
          }}
        >
          <h4 className="font-semibold mb-1 uppercase tracking-wide text-sm text-gray-800">Bank Information</h4>
          <div className="text-sm text-gray-800 space-y-1 leading-snug">
            {data.bankBeneficiaryName && (
              <p><span className="font-semibold">Beneficial bank account name:</span> {data.bankBeneficiaryName}</p>
            )}
            {data.bankAccountNumber && (
              <p><span className="font-semibold">Bank account:</span> {data.bankAccountNumber}</p>
            )}
            {data.bankName && (
              <p><span className="font-semibold">Name of the bank:</span> {data.bankName}</p>
            )}
            {data.bankBranch && (
              <p><span className="font-semibold">Bank address:</span> {data.bankBranch}</p>
            )}
            {data.bankAddress && <p className="text-gray-700">{data.bankAddress}</p>}
            {data.bankSwiftCode && (
              <p><span className="font-semibold">SWIFT code:</span> {data.bankSwiftCode}</p>
            )}
          </div>
        </div>
      )}

      {/* Notes and Terms (compact spacing) */}
      {(data.notes || data.terms) && (
        <div className="space-y-2">
          {data.notes && (
            <div>
              <h4 className="font-semibold mb-0.5 text-xs">Notes:</h4>
              <p className="text-xs text-gray-700 whitespace-pre-wrap leading-snug">{data.notes}</p>
            </div>
          )}
          {data.terms && (
            <div>
              <h4 className="font-semibold mb-0.5 text-xs">Terms & Conditions:</h4>
              <p className="text-xs text-gray-700 whitespace-pre-wrap leading-snug">{data.terms}</p>
            </div>
          )}
        </div>
      )}

      {/* Footer removed to save space */}
    </Card>
  );
}