import { RelationshipRow } from '@/components/relationship-row';
import { relationshipDefinitions } from '@/lib/relationship-definitions';

interface ForwardRelationshipsProps {
  type: string;
}

export function ForwardRelationships({ type }: ForwardRelationshipsProps) {
  const relationships = relationshipDefinitions[type]?.forward;
  
  if (!relationships || relationships.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border">
      <div className="border-b border-border bg-muted/50 px-4 py-2">
        <h3 className="font-semibold text-sm mt-0 mb-0">Forward Relationships</h3>
      </div>
      <table className="rounded-none w-full border-none text-sm mt-0 mb-0">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-xs">Source</th>
            <th className="px-4 py-2 text-left font-semibold text-xs">Relationship</th>
            <th className="px-4 py-2 text-left font-semibold text-xs">Target</th>
            <th className="px-4 py-2 text-left font-semibold text-xs">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {relationships.map((rel, index) => (
            <RelationshipRow
              key={index}
              source={rel.source}
              relationship={rel.relationship}
              target={Array.isArray(rel.target) ? (
                <>
                  {rel.target.map((t, i) => (
                    <>
                      {i > 0 && ", "}
                      <code key={t} className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-accent">
                        {t}
                      </code>
                    </>
                  ))}
                </>
              ) : (
                <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-accent">
                  {rel.target}
                </code>
              )}
              description={rel.description}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
