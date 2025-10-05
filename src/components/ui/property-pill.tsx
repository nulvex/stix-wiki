export function PropertyPill({ name, disabled = false }: { name: string; disabled?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs ${disabled
        ? "border-border/50 bg-muted/30 text-muted-foreground line-through"
        : "border-border bg-secondary/50 text-secondary-foreground"
        }`}
    >
      {name}
    </span>
  )
}
