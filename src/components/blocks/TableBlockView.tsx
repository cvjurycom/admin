import type { TableBlock } from "@/lib/blocks/types"

function TableBlockView({ block }: { block: TableBlock }) {
  const rows = block.rows.filter((row) => row.some(Boolean))
  if (rows.length === 0) {
    return null
  }
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-[#E8E8EC]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[#FAFAFA]">
          <tr>
            {block.headers.map((header, index) => (
              <th
                key={index}
                className="px-4 py-3 font-semibold text-[#161616]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-[#E8E8EC]">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-[#8C8C8C]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { TableBlockView }
