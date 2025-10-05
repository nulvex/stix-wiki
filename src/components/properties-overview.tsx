import { PropertyPill } from "@/components/ui/property-pill"
import { PropertyGroupCompact } from "@/components/property-group-compact"
import { store } from "@/lib/schema-store"
import { getStixObjectCategory } from "@/lib/utils";

interface PropertiesOverviewProps {
  type: string;
}

export function PropertiesOverview({ type }: PropertiesOverviewProps) {
  const schema = store.get(type);

  // Extract required properties from the schema
  const requiredCommonProps = schema.allOf[0].required;
  const requiredTypeProps = schema.required || [];
  const allRequiredProps = [...new Set([...requiredCommonProps, ...requiredTypeProps])];

  // Get all properties
  const commonProps = schema.allOf[0].properties;
  const typeProps = schema.allOf[1]?.properties || {};

  // Separate properties into groups
  const optionalCommonProps = Object.keys(commonProps).filter(prop => !allRequiredProps.includes(prop));
  const typeSpecificProps = Object.keys(typeProps).filter(prop => prop !== 'type' && prop !== 'id');

  // Get not applicable common properties
  // The 'defanged' property is a common property that only applies to SCOs, not SDOs

  const category = getStixObjectCategory(type)

  let notApplicableProps: string[] = [];

  if (category === 'SDO' || category === 'SRO') {
    notApplicableProps = ['defanged']
  } else if (category === 'SCO') {
    notApplicableProps = ['created_by_ref', 'revoked', 'labels', 'confidence', 'lang', 'external_references'];
  }

  return (
    <div className="space-y-3">
      <PropertyGroupCompact title="Required Common Properties" variant="required">
        <div className="flex flex-wrap gap-1.5">
          {allRequiredProps.map(prop => (
            <PropertyPill key={prop} name={prop} />
          ))}
        </div>
      </PropertyGroupCompact>

      <PropertyGroupCompact title="Optional Common Properties" variant="optional">
        <div className="flex flex-wrap gap-1.5">
          {optionalCommonProps.map(prop => (
            <PropertyPill key={prop} name={prop} />
          ))}
        </div>
      </PropertyGroupCompact>

      {notApplicableProps.length > 0 && (
        <PropertyGroupCompact title="Not Applicable" variant="disabled">
          <div className="flex flex-wrap gap-1.5">
            {notApplicableProps.map(prop => (
              <PropertyPill key={prop} name={prop} disabled />
            ))}
          </div>
        </PropertyGroupCompact>
      )}

      {typeSpecificProps.length > 0 && (
        <PropertyGroupCompact title={`${type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Specific`} variant="specific">
          <div className="flex flex-wrap gap-1.5">
            {typeSpecificProps.map(prop => (
              <PropertyPill key={prop} name={prop} />
            ))}
          </div>
        </PropertyGroupCompact>
      )}
    </div>
  );
};
