#!/usr/bin/env tsx
/**
 * Generate tokens.json from live registries.
 *
 * Reads @almadar/operators and @almadar/patterns to build
 * a static snapshot of all valid tokens for the Prism highlighter.
 *
 * Run: npx tsx scripts/generate-tokens.ts
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '../../..');

// Read operators registry
const operatorsPath = resolve(ROOT, 'packages/almadar-operators/operators.json');
const operators = JSON.parse(readFileSync(operatorsPath, 'utf-8'));

// Read patterns registry
const patternsPath = resolve(ROOT, 'packages/almadar-patterns/src/patterns-registry.json');
const patterns = JSON.parse(readFileSync(patternsPath, 'utf-8'));

// Group operators by category -> AVL color namespace
const categoryToColorNamespace: Record<string, string> = {
  arithmetic: 'arithmetic',
  comparison: 'comparison',
  logic: 'logic',
  control: 'control',
  effect: 'effect',
  collection: 'collection',
  'std-math': 'arithmetic',
  'std-str': 'string',
  'std-array': 'collection',
  'std-object': 'collection',
  'std-time': 'time',
  'std-validate': 'comparison',
  'std-format': 'string',
  'std-async': 'async',
  'std-prob': 'arithmetic',
  'std-nn': 'async',
  'std-tensor': 'async',
  'std-train': 'async',
};

const operatorsByNamespace: Record<string, string[]> = {};
for (const [name, meta] of Object.entries(operators.operators)) {
  const category = (meta as Record<string, unknown>).category as string;
  const namespace = categoryToColorNamespace[category] ?? 'control';
  if (!operatorsByNamespace[namespace]) operatorsByNamespace[namespace] = [];
  operatorsByNamespace[namespace].push(name);
}

// Sort each namespace's operators
for (const ns of Object.keys(operatorsByNamespace)) {
  operatorsByNamespace[ns].sort((a, b) => b.length - a.length); // longest first for regex matching
}

// All operator names (flat)
const allOperatorNames = Object.keys(operators.operators);

// Pattern names
const patternNames = Object.keys(patterns.patterns).sort((a, b) => b.length - a.length);

// Standard behavior names (from std exports directory)
const behaviorNames: string[] = [];
try {
  const { readdirSync } = await import('fs');
  const exportsDir = resolve(ROOT, 'packages/almadar-std/behaviors/exports');
  for (const level of ['atoms', 'molecules', 'organisms']) {
    const dir = resolve(exportsDir, level);
    try {
      for (const f of readdirSync(dir)) {
        if (f.endsWith('.orb')) {
          behaviorNames.push(f.replace('.orb', ''));
        }
      }
    } catch { /* directory may not exist */ }
  }
} catch { /* std package may not be available */ }

// Structural keys (from @almadar/core schema structure)
const structuralKeys = [
  'name', 'description', 'version', 'orbitals', 'entity', 'traits', 'pages',
  'stateMachine', 'states', 'events', 'transitions', 'fields', 'emits', 'listens',
  'persistence', 'linkedEntity', 'category', 'collection', 'uses', 'services',
  'config', 'theme', 'design', 'domainContext', 'designTokens', 'customPatterns',
];

// Valid field types
const fieldTypes = [
  'string', 'number', 'boolean', 'date', 'timestamp', 'datetime',
  'array', 'object', 'enum', 'relation',
];

// Valid persistence kinds
const persistenceKinds = ['persistent', 'runtime', 'singleton', 'instance'];

// Valid effect types
const effectTypes = [
  'render-ui', 'set', 'persist', 'fetch', 'emit', 'navigate',
  'notify', 'call-service', 'spawn', 'despawn', 'log', 'wait',
  'if', 'when', 'do', 'let',
];

// UI slot names
const uiSlots = [
  'main', 'sidebar', 'modal', 'drawer', 'overlay', 'center',
  'toast', 'hud-top', 'hud-bottom', 'floating', 'system', 'content', 'screen',
];

// Build the tokens file
const tokens = {
  generatedAt: new Date().toISOString(),
  operatorCount: allOperatorNames.length,
  patternCount: patternNames.length,
  behaviorCount: behaviorNames.length,
  operatorsByNamespace,
  allOperatorNames,
  patternNames,
  behaviorNames,
  structuralKeys,
  fieldTypes,
  persistenceKinds,
  effectTypes,
  uiSlots,
};

// Write to dist/
const outDir = resolve(__dirname, '../dist');
mkdirSync(outDir, { recursive: true });
const outPath = resolve(outDir, 'tokens.json');
writeFileSync(outPath, JSON.stringify(tokens, null, 2));

console.log(`Generated tokens.json:`);
console.log(`  Operators: ${allOperatorNames.length} (${Object.keys(operatorsByNamespace).length} namespaces)`);
console.log(`  Patterns: ${patternNames.length}`);
console.log(`  Behaviors: ${behaviorNames.length}`);
console.log(`  Written to: ${outPath}`);
