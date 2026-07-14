import type { TableBlock } from "@/lib/blocks/types"

function TableBlockView({ block }: { block: TableBlock }) {
  const rows = block.rows.filter((row) => row[0] || row[1])
  if (rows.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-[#E8E8EC]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#FAFAFA]">
          <tr>
            <th className="px-4 py-3 font-semibold text-[#161616]">
              {block.headers[0]}
            </th>
            <th className="px-4 py-3 font-semibold text-[#161616]">
              {block.headers[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-[#E8E8EC]">
              <td className="px-4 py-3 text-[#4A4A4A]">{row[0]}</td>
              <td className="px-4 py-3 text-[#8C8C8C]">{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { TableBlockView }
