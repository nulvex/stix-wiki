// SDOs
import attackPattern from '../schemas/sdos/attack-pattern.json';
import campaign from '../schemas/sdos/campaign.json';
import courseOfAction from '../schemas/sdos/course-of-action.json';
import grouping from '../schemas/sdos/grouping.json';
import identity from '../schemas/sdos/identity.json';
import incident from '../schemas/sdos/incident.json';
import indicator from '../schemas/sdos/indicator.json';
import infrastructure from '../schemas/sdos/infrastructure.json';
import intrusionSet from '../schemas/sdos/intrusion-set.json';
import location from '../schemas/sdos/location.json';
import malwareAnalysis from '../schemas/sdos/malware-analysis.json';
import malware from '../schemas/sdos/malware.json';
import note from '../schemas/sdos/note.json';
import observedData from '../schemas/sdos/observed-data.json';
import opinion from '../schemas/sdos/opinion.json';
import report from '../schemas/sdos/report.json';
import threatActor from '../schemas/sdos/threat-actor.json';
import tool from '../schemas/sdos/tool.json';
import vulnerability from '../schemas/sdos/vulnerability.json';

// SROs
import relationship from '../schemas/sros/relationship.json';
import sighting from '../schemas/sros/sighting.json';

// Observables
import artifact from '../schemas/observables/artifact.json';
import autonomousSystem from '../schemas/observables/autonomous-system.json';
import directory from '../schemas/observables/directory.json';
import domainName from '../schemas/observables/domain-name.json';
import emailAddr from '../schemas/observables/email-addr.json';
import emailMessage from '../schemas/observables/email-message.json';
import file from '../schemas/observables/file.json';
import ipv4Addr from '../schemas/observables/ipv4-addr.json';
import ipv6Addr from '../schemas/observables/ipv6-addr.json';
import macAddr from '../schemas/observables/mac-addr.json';
import mutex from '../schemas/observables/mutex.json';
import networkTraffic from '../schemas/observables/network-traffic.json';
import process from '../schemas/observables/process.json';
import software from '../schemas/observables/software.json';
import url from '../schemas/observables/url.json';
import userAccount from '../schemas/observables/user-account.json';
import windowsRegistryKey from '../schemas/observables/windows-registry-key.json';
import x509Certificate from '../schemas/observables/x509-certificate.json';

export const sdos = {
  attackPattern,
  campaign,
  courseOfAction,
  grouping,
  identity,
  incident,
  indicator,
  infrastructure,
  intrusionSet,
  location,
  malwareAnalysis,
  malware,
  note,
  observedData,
  opinion,
  report,
  threatActor,
  tool,
  vulnerability,
} as const;

export const sros = {
  relationship,
  sighting,
} as const;

export const observables = {
  artifact,
  autonomousSystem,
  directory,
  domainName,
  emailAddr,
  emailMessage,
  file,
  ipv4Addr,
  ipv6Addr,
  macAddr,
  mutex,
  networkTraffic,
  process,
  software,
  url,
  userAccount,
  windowsRegistryKey,
  x509Certificate,
} as const;

export type SdoType = keyof typeof sdos;
export type SroType = keyof typeof sros;
export type ObservableType = keyof typeof observables;

export const schemas = {
  sdos,
  sros,
  observables,
} as const;

export class SchemaStore {
  private static instance: SchemaStore;
  private schemaMap: Map<string, any>;

  private constructor() {
    this.schemaMap = new Map();
    
    // Map all SDOs
    Object.entries(sdos).forEach(([key, schema]) => {
      this.schemaMap.set(this.normalizeKey(key), schema);
    });

    // Map all SROs
    Object.entries(sros).forEach(([key, schema]) => {
      this.schemaMap.set(this.normalizeKey(key), schema);
    });

    // Map all Observables
    Object.entries(observables).forEach(([key, schema]) => {
      this.schemaMap.set(this.normalizeKey(key), schema);
    });
  }

  private normalizeKey(key: string): string {
    return key
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '');
  }

  static getInstance(): SchemaStore {
    if (!SchemaStore.instance) {
      SchemaStore.instance = new SchemaStore();
    }
    return SchemaStore.instance;
  }

  get(type: string): any {
    const schema = this.schemaMap.get(type);
    if (!schema) {
      throw new Error(`Schema not found for type: ${type}`);
    }
    return schema;
  }

  has(type: string): boolean {
    return this.schemaMap.has(type);
  }

  getAllTypes(): string[] {
    return Array.from(this.schemaMap.keys());
  }
}

export const store = SchemaStore.getInstance();