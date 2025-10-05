interface RelationshipDefinition {
  source: string;
  relationship: string;
  target: string | string[];
  description: string;
}

interface RelationshipDefinitions {
  [key: string]: {
    embedded: {
      [key: string]: {
        type: string;
        description: string;
      };
    };
    common: string[];
    forward: RelationshipDefinition[];
    reverse: RelationshipDefinition[];
  };
}

export const relationshipDefinitions: RelationshipDefinitions = {
  'attack-pattern': {
    embedded: {
      'created_by_ref': {
        type: 'identity',
        description: 'The ID of the Source object that describes who created this object.'
      },
      'object_marking_refs': {
        type: 'marking-definition',
        description: 'The list of marking-definition objects to be applied to this object.'
      }
    },
    common: [
      'duplicate-of',
      'derived-from',
      'related-to'
    ],
    forward: [
      {
        source: 'attack-pattern',
        relationship: 'delivers',
        target: 'malware',
        description: 'This Relationship describes that this Attack Pattern is used to deliver this malware instance (or family).'
      },
      {
        source: 'attack-pattern',
        relationship: 'targets',
        target: ['identity', 'location', 'vulnerability'],
        description: 'This Relationship describes that this Attack Pattern typically targets the type of victim, location, or vulnerability represented by the related Identity, Location, or Vulnerability object.'
      },
      {
        source: 'attack-pattern',
        relationship: 'uses',
        target: ['malware', 'tool'],
        description: 'This Relationship describes that the related Malware or Tool is used to perform the behavior identified in the Attack Pattern.'
      }
    ],
    reverse: [
      {
        source: 'indicator',
        relationship: 'indicates',
        target: 'attack-pattern',
        description: 'This Relationship describes that the Pattern identified in the Indicator would potentially detect evidence of the related Attack Pattern.'
      },
      {
        source: 'course-of-action',
        relationship: 'mitigates',
        target: 'attack-pattern',
        description: 'This Relationship describes that this Course of Action can mitigate this Attack Pattern.'
      },
      {
        source: ['campaign', 'intrusion-set', 'malware', 'threat-actor'],
        relationship: 'uses',
        target: 'attack-pattern',
        description: 'This Relationship describes that the related Campaign, Intrusion Set, Malware, or Threat Actor uses this Attack Pattern.'
      }
    ]
  }
};
