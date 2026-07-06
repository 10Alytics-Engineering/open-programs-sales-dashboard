export function PaymentsEmptyState() {
  return (
    <tr>
      <td colSpan={7} className="py-20 text-center text-slate-400 font-medium">
        No transactions found matching your criteria.
      </td>
    </tr>
  );
}
