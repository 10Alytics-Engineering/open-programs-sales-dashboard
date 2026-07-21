import { formatDate } from "@/lib/utils";
import { Transaction } from "@/types";

type PaymentTransactionMetadataCardProps = {
  payment: Transaction;
  metadata: Record<string, any>;
};

const DISPLAY_METADATA_KEYS = new Set([
  "courseName",
  "cohortName",
  "installmentNumber",
  "installmentsCount",
  "selectedCurrency",
  "selectedProvider",
]);

export function PaymentTransactionMetadataCard({
  payment,
  metadata,
}: PaymentTransactionMetadataCardProps) {
  const metadataEntries = Object.entries(metadata || {}).filter(
    ([key, value]) => {
      if (value === null || value === undefined || value === "") return false;
      if (DISPLAY_METADATA_KEYS.has(key)) return true;

      return false;
    },
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 md:p-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-900">
            Transaction Details
          </h3>

          <p className="text-sm font-medium text-slate-500 mt-1">
            Extra information stored on this payment record.
          </p>
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          ID: {payment.id}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
        <DetailRow label="Transaction Ref" value={payment.transactionRef} />
        <DetailRow label="Payment Type" value={payment.paymentType} />

        {metadataEntries.map(([key, value]) => (
          <DetailRow
            key={key}
            label={formatMetadataLabel(key)}
            value={formatMetadataValue(key, value)}
          />
        ))}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value?: string | number | boolean | null;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 min-w-0">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>

      <p className="text-xs md:text-sm font-bold text-slate-700 mt-1 wrap-break-word">
        {value === null || value === undefined || value === ""
          ? "N/A"
          : String(value)}
      </p>
    </div>
  );
}

function formatMetadataLabel(key: string) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim();
}

function formatMetadataValue(key: string, value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "N/A";
  }

  if (isDateField(key, value)) {
    return formatDate(String(value));
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function isDateField(key: string, value: unknown) {
  if (typeof value !== "string") return false;

  const normalizedKey = key.toLowerCase();

  const looksLikeDateKey =
    normalizedKey.includes("date") ||
    normalizedKey.includes("at") ||
    normalizedKey.includes("time");

  if (!looksLikeDateKey) return false;

  const parsed = new Date(value);

  return !Number.isNaN(parsed.getTime());
}
