import { EmbeddedRelationships } from '@/components/embedded-relationships';
import { CommonRelationships } from '@/components/common-relationships';
import { ForwardRelationships } from '@/components/forward-relationships';
import { ReverseRelationships } from '@/components/reverse-relationships';

interface RelationshipProps {
  type: string;
}

export function Relationships({ type }: RelationshipProps) {
  return (
    <div className="space-y-3">
      <CommonRelationships type={type} />
      <EmbeddedRelationships type={type} />
      <ForwardRelationships type={type} />
      <ReverseRelationships type={type} />
    </div>
  );
}
