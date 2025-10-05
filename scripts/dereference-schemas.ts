import $RefParser from '@apidevtools/json-schema-ref-parser';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const SCHEMA_DIRS = ['sdos', 'sros', 'observables'] as const;
const OUTPUT_DIR = path.join(rootDir, 'src', 'schemas');

async function dereferenceSchema(filePath: string): Promise<object> {
  try {
    const schema = await $RefParser.dereference(filePath);
    return schema;
  } catch (error) {
    console.error(`Error dereferencing ${filePath}:`, error);
    throw error;
  }
}

async function processSchemaDirectory(dirName: string) {
  const inputDir = path.join(rootDir, 'stix-schemas', dirName);
  const outputDir = path.join(OUTPUT_DIR, dirName);

  try {
    await fs.mkdir(outputDir, { recursive: true });
    const files = await fs.readdir(inputDir);

    for (const file of files) {
      if (!file.endsWith('.json')) continue;

      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);
      
      console.log(`Processing ${inputPath}...`);
      const dereferencedSchema = await dereferenceSchema(inputPath);
      
      await fs.writeFile(
        outputPath,
        JSON.stringify(dereferencedSchema, null, 2)
      );
      console.log(`✓ Saved to ${outputPath}`);
    }
  } catch (error) {
    console.error(`Error processing directory ${dirName}:`, error);
    throw error;
  }
}

async function main() {
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    
    for (const dir of SCHEMA_DIRS) {
      console.log(`\nProcessing ${dir} schemas...`);
      await processSchemaDirectory(dir);
    }
    
    console.log('\nAll schemas have been dereferenced successfully!');
  } catch (error) {
    console.error('Failed to process schemas:', error);
    process.exit(1);
  }
}

main();
