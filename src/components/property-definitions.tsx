import { PropertyRow } from "@/components/property-row"
import { store } from "@/lib/schema-store"

interface PropertyDefinitionsProps {
  type: string;
}

export function PropertyDefinitions({ type }: PropertyDefinitionsProps) {
  const schema = store.get(type);

  // Get type-specific properties and type field
  const typeProps = schema.allOf[1]?.properties || {};
  const typeSpecificProps = ['type', ...Object.keys(typeProps).filter(prop => prop !== 'type' && prop !== 'id')];

  // Helper function to get property type info
  const getTypeInfo = (prop: string, propSchema: any) => {
    if (propSchema.type === 'array') {
      const typeDetail = propSchema.items?.type ||
        propSchema.items?.$ref?.split('/').pop() ||
        propSchema.items?.title;
      return { type: 'list', typeDetail };
    }
    return { type: propSchema.type };
  };

  // Helper function to format property description
  const formatDescription = (prop: string, propSchema: any) => {
    let desc = propSchema.description || '';

    // Special handling for external_references property for attack-pattern
    if (prop === 'external_references' && type === 'attack-pattern') {
      return (
        <>
          {desc} This property{" "}
          <strong>MAY</strong> be used to provide one or more Attack Pattern identifiers, such as a CAPEC ID.
          When specifying a CAPEC ID, the{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">source_name</code> property of
          the external reference <strong>MUST</strong> be set to{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs text-accent">capec</code> and
          the <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs">external_id</code> property{" "}
          <strong>MUST</strong> be formatted as{" "}
          <code className="rounded bg-secondary px-1 py-0.5 font-mono text-xs text-accent">CAPEC-[id]</code>.
        </>
      );
    }

    return desc;
  };

  return (
    <table className="w-full text-sm mt-3">
      <thead className="border-b border-border bg-muted/50">
        <tr>
          <th className="px-4 py-2 text-left font-semibold">Property</th>
          <th className="px-4 py-2 text-left font-semibold">Type</th>
          <th className="px-4 py-2 text-left font-semibold">Description</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {typeSpecificProps.map(prop => {
          const propSchema = typeProps[prop];
          const { type: propType, typeDetail } = getTypeInfo(prop, propSchema);
          const isRequired = schema.required?.includes(prop) || false;
          const description = formatDescription(prop, propSchema);

          return (
            <PropertyRow
              key={prop}
              name={prop}
              type={propType}
              typeDetail={typeDetail}
              required={isRequired}
              optional={!isRequired}
              description={description}
            />
          );
        })}
      </tbody>
    </table>
  );
}
