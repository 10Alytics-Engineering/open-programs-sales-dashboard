import { BookOpen, CalendarClock, Hash, User } from "lucide-react";

import { formatDate } from "@/lib/utils";
import { Transaction } from "@/types";
import { PaymentDetailInfoCard } from "./payment-detail-info-card";

type PaymentDetailInfoGridProps = {
  payment: Transaction;
};

export function PaymentDetailInfoGrid({ payment }: PaymentDetailInfoGridProps) {
  const user = payment.paymentStatus?.user;
  const course = payment.paymentStatus?.course;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PaymentDetailInfoCard
        icon={<User className="w-5 h-5 md:w-6 md:h-6" />}
        title="Payer Details"
        lines={[
          user?.name || "Unknown User",
          user?.email || "No email available",
          user?.phone_number || null,
        ]}
      />

      <PaymentDetailInfoCard
        icon={<BookOpen className="w-5 h-5 md:w-6 md:h-6" />}
        title="Course"
        lines={[course?.title || "No course attached"]}
        tone="violet"
      />

      <PaymentDetailInfoCard
        icon={<Hash className="w-5 h-5 md:w-6 md:h-6" />}
        title="Transaction Reference"
        lines={[
          payment.transactionRef || "No reference available",
          payment.id ? `Transaction ID: ${payment.id}` : null,
        ]}
      />

      <PaymentDetailInfoCard
        icon={<CalendarClock className="w-5 h-5 md:w-6 md:h-6" />}
        title="Transaction Dates"
        lines={[
          payment.paymentDate
            ? `Paid: ${formatDate(payment.paymentDate)}`
            : "Payment not completed",
          `Created: ${formatDate(payment.createdAt)}`,
        ]}
        tone="emerald"
      />
    </div>
  );
}
