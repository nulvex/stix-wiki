import { Badge } from "@/components/ui/badge"

export function PropertyRow({
  name,
  type,
  typeDetail,
  required,
  optional,
  description,
}: {
  name: string
  type: string
  typeDetail?: string
  required?: boolean
  optional?: boolean
  description: React.ReactNode
}) {
  return (
    <tr className="hover:bg-muted/30">
      <td className="px-4 py-3 align-top">
        <div className="flex items-center gap-2">
          <code className="font-mono text-xs font-semibold">{name}</code>
          {required && (
            <Badge variant="outline" className="border-green-500/30 bg-green-500/20 text-[10px] text-green-400">
              required
            </Badge>
          )}
          {optional && (
            <Badge variant="outline" className="border-blue-500/30 bg-blue-500/20 text-[10px] text-blue-400">
              optional
            </Badge>
          )}
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        {typeDetail ? type : <code className="font-mono text-xs text-muted-foreground">{type}</code>}
        {typeDetail && (
          <>
            {" "}
            of <code className="font-mono text-xs text-muted-foreground"><span className="text-accent">{typeDetail}</span></code>
          </>
        )}
      </td>
      <td className="px-4 py-3 text-xs leading-relaxed text-muted-foreground">{description}</td>
    </tr>
  )
}


