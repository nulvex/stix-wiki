import { ReverseRelationshipRow } from '@/components/reverse-relationship-row';
import { relationshipDefinitions } from '@/lib/relationship-definitions';

interface ReverseRelationshipsProps {
  type: string;
}

function renderSource(source: string | string[]) {
  if (!Array.isArray(source)) {
    return (
      <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-accent">
        {source}
      </code>
    );
  }

  return (
    <>
      {source.map((item, itemIndex) => (
        <span key={`${item}-${itemIndex}`}>
          {itemIndex > 0 && ', '}
          <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-accent">
            {item}
          </code>
        </span>
      ))}
    </>
  );
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
          {relationships.map((rel) => {
            const targets = Array.isArray(rel.target) ? rel.target : [rel.target];
            const sourceKey = Array.isArray(rel.source) ? rel.source.join('|') : rel.source;

            return targets.map((target, targetIndex) => (
              <ReverseRelationshipRow
                key={`${sourceKey}-${rel.relationship}-${target}-${targetIndex}`}
                source={renderSource(rel.source)}
                relationship={rel.relationship}
                target={target}
              />
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}
