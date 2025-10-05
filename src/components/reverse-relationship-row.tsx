export function ReverseRelationshipRow({
  source,
  relationship,
  target,
}: {
  source: React.ReactNode
  relationship: string
  target: string
}) {
  return (
    <tr className="hover:bg-muted/30">
      <td className="px-4 py-3 align-top">
        <div className="flex flex-wrap gap-1">{source}</div>
      </td>
      <td className="px-4 py-3 align-top">
        <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs font-semibold text-blue-400">
          {relationship}
        </code>
      </td>
      <td className="px-4 py-3 align-top">
        <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-accent">{target}</code>
      </td>
      <td className="px-4 py-3 text-xs text-muted-foreground">See forward relationship for definition.</td>
    </tr>
  )
}
