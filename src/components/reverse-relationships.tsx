import { ReverseRelationshipRow } from '@/components/reverse-relationship-row';
import { relationshipDefinitions } from '@/lib/relationship-definitions';

interface ReverseRelationshipsProps {
  type: string;
}

export function ReverseRelationships({ type }: ReverseRelationshipsProps) {
  const relationships = relationshipDefinitions[type]?.reverse;
  
  if (!relationships || relationships.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border">
      <div className="border-b border-border bg-muted/50 px-4 py-2">
        <h3 className="font-semibold text-sm mt-0 mb-0">Reverse Relationships</h3>
      </div>
      <table className="w-full rounded-none border-none text-sm mt-0 mb-0">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-xs">Source</th>
            <th className="px-4 py-2 text-left font-semibold text-xs">Relationship Type</th>
            <th className="px-4 py-2 text-left font-semibold text-xs">Target</th>
            <th className="px-4 py-2 text-left font-semibold text-xs">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {relationships.map((rel, index) => (
            <ReverseRelationshipRow
              key={index}
              source={Array.isArray(rel.source) ? (
                <>
                  {rel.source.map((s, i) => (
                    <>
                      {i > 0 && ", "}
                      <code key={s} className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-accent">
                        {s}
                      </code>
                    </>
                  ))}
                </>
              ) : (
                <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-accent">
                  {rel.source}
                </code>
              )}
              relationship={rel.relationship}
              target={rel.target}
              description={rel.description}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
