import { Badge } from "@/components/ui/badge"
import { relationshipDefinitions } from "@/lib/relationship-definitions"

interface CommonRelationshipsProps {
  type: string;
}

export function CommonRelationships({ type }: CommonRelationshipsProps) {
  const relationships = relationshipDefinitions[type]?.common;
  
  if (!relationships || relationships.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-2 flex items-center gap-2">
        <Badge variant="outline" className="bg-blue-500/20 text-xs text-blue-400 border-blue-500/30">
          Common Relationships
        </Badge>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {relationships.map(relationship => (
          <span key={relationship} className="inline-flex items-center rounded border border-border bg-secondary/50 px-2 py-0.5 font-mono text-xs text-secondary-foreground">
            {relationship}
          </span>
        ))}
      </div>
    </div>
  )
}

