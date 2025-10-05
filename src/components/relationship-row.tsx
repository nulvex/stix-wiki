export function RelationshipRow({
  source,
  relationship,
  target,
  description,
}: {
  source: string
  relationship: string
  target: React.ReactNode
  description: React.ReactNode
}) {
  return (
    <tr className="hover:bg-muted/30">
      <td className="px-4 py-3 align-top">
        <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-accent">{source}</code>
      </td>
      <td className="px-4 py-3 align-top">
        <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs font-semibold text-blue-400">
          {relationship}
        </code>
      </td>
      <td className="px-4 py-3 align-top">
        <div className="flex flex-wrap gap-1">{target}</div>
      </td>
      <td className="px-4 py-3 text-xs leading-relaxed text-muted-foreground">{description}</td>
    </tr>
  )
}
