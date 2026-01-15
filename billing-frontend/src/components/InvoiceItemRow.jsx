export default function InvoiceItemRow({
  index,
  products,
  item,
  onChange,
  onRemove
}) {
  return (
    <tr className="border-b">
      <td>
        <select
          className="border p-2"
          value={item.productId}
          onChange={(e) =>
            onChange(index, "productId", e.target.value)
          }
        >
          <option value="">Select</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      </td>

      <td>
        <input
          type="number"
          className="border p-2 w-20"
          value={item.quantity}
          onChange={(e) =>
            onChange(index, "quantity", e.target.value)
          }
        />
      </td>

      <td>₹{item.price || 0}</td>
      <td>{item.gstPercent || 0}%</td>
      <td>₹{item.total || 0}</td>

      <td>
        <button
          onClick={() => onRemove(index)}
          className="text-red-600"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}
