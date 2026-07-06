import { Loader2 } from "lucide-react";

export function PaymentsTableLoader() {
  return (
    <tr>
      <td colSpan={7} className="py-20 text-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
      </td>
    </tr>
  );
}
