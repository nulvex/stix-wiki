import { Badge } from "@/components/ui/badge"

export function PropertyGroupCompact({
  title,
  variant,
  children,
}: {
  title: string
  variant: "required" | "optional" | "disabled" | "specific"
  children: React.ReactNode
}) {
  const colors = {
    required: "border-green-500/30 bg-green-500/5",
    optional: "border-blue-500/30 bg-blue-500/5",
    disabled: "border-border/50 bg-muted/20",
    specific: "border-purple-500/30 bg-purple-500/5",
  }

  const badgeColors = {
    required: "bg-green-500/20 text-green-400 border-green-500/30",
    optional: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    disabled: "bg-muted text-muted-foreground border-border",
    specific: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  }

  return (
    <div className={`rounded-lg border p-3 ${colors[variant]}`}>
      <div className="mb-2 flex items-center gap-2">
        <Badge variant="outline" className={`text-xs ${badgeColors[variant]}`}>
          {title}
        </Badge>
      </div>
      {children}
    </div>
  )
}
