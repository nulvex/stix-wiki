import { store } from '@/lib/schema-store';
import { getStixObjectCategory } from '@/lib/utils';

interface ObjectPageInfo {
  slug: string;
  section: string;
}

const META_OBJECT_PAGE_MAP: Record<string, ObjectPageInfo> = {
  'extension-definition': { slug: 'meta-objects/extension-definition', section: 'STIX Meta Object' },
  'language-content': { slug: 'meta-objects/language-content', section: 'STIX Meta Object' },
  'marking-definition': { slug: 'meta-objects/marking-definition', section: 'STIX Meta Object' },
};

function getSectionFromCategory(category: ReturnType<typeof getStixObjectCategory>): string {
  if (category === 'SDO') return 'STIX Domain Object';
  if (category === 'SRO') return 'STIX Relationship Object';
  if (category === 'SCO') return 'STIX Cyber-observable Object';
  return 'STIX Object';
}

export function getObjectPageInfo(type: string) {
  const category = getStixObjectCategory(type);

  if (category === 'SDO') {
    return {
      slug: `domain-objects/${type}`,
      section: getSectionFromCategory(category),
    };
  }

  if (category === 'SRO') {
    return {
      slug: `relationship-objects/${type}`,
      section: getSectionFromCategory(category),
    };
  }

  if (category === 'SCO') {
    return {
      slug: `cyber-observable-objects/${type}`,
      section: getSectionFromCategory(category),
    };
  }

  return META_OBJECT_PAGE_MAP[type];
}

export function formatObjectTypeName(type: string): string {
  return type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getObjectPreviewData(type: string) {
  if (!store.has(type)) {
    return null;
  }

  const schema = store.get(type);
  const requiredCommon = schema?.allOf?.[0]?.required ?? [];
  const requiredType = schema?.required ?? [];
  const typeProperties = Object.keys(schema?.allOf?.[1]?.properties ?? {}).filter(
    (property) => property !== 'type' && property !== 'id',
  );

  return {
    description: schema?.description as string | undefined,
    requiredProperties: [...new Set([...requiredCommon, ...requiredType])],
    typeProperties,
  };
}
