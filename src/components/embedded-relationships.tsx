import { relationshipDefinitions } from "@/lib/relationship-definitions";

interface EmbeddedRelationshipsProps {
  type: string;
}

export function EmbeddedRelationships({ type }: EmbeddedRelationshipsProps) {
  const relationships = relationshipDefinitions[type]?.embedded;
  
  if (!relationships || Object.keys(relationships).length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="border-b border-border bg-muted/50 px-4 py-2">
        <h3 className="font-semibold text-sm mt-0 mb-0">Embedded Relationships</h3>
      </div>
      <div className="divide-y divide-border">
        {Object.entries(relationships).map(([name, { type: targetType }]) => (
          <div key={name} className="flex items-center gap-4 px-4 py-2 text-xs">
            <code className="min-w-[180px] font-mono font-semibold">{name}</code>
            <div className="flex items-center gap-1.5">
              {name.endsWith('_refs') ? (
                <>
                  <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-accent">list</code>
                  <span className="text-muted-foreground">of type</span>
                </>
              ) : null}
              <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-accent">identifier</code>
              <span className="text-muted-foreground">(of type</span>
              <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-accent">{targetType}</code>
              <span className="text-muted-foreground">)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
