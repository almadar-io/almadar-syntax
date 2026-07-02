#!/usr/bin/env tsx
/**
 * Generate tokens.json from live registries.
 *
 * Reads @almadar/std (canonical operator registry) and @almadar/patterns
 * to build a static snapshot of all valid tokens for the Prism highlighter.
 *
 * Run: npx tsx scripts/generate-tokens.ts
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { STD_OPERATORS } from '@almadar/std';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '../../..');

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
for (const [name, meta] of Object.entries(STD_OPERATORS)) {
  const category = meta.category;
  const namespace = categoryToColorNamespace[category] ?? 'control';
  if (!operatorsByNamespace[namespace]) operatorsByNamespace[namespace] = [];
  operatorsByNamespace[namespace].push(name);
}

// Sort each namespace's operators
for (const ns of Object.keys(operatorsByNamespace)) {
  operatorsByNamespace[ns].sort((a, b) => b.length - a.length); // longest first for regex matching
}

// All operator names (flat)
const allOperatorNames = Object.keys(STD_OPERATORS);

// Pattern names
const patternNames = Object.keys(patterns.patterns).sort((a, b) => b.length - a.length);

// Standard behavior names (from the canonical std registry directory).
// Behaviors live per-topic (registry/<topic>/{atoms,molecules,organisms}/*.orb),
// not flat under registry/ — walk topic dirs, then the 3 tiers within each.
const behaviorNames: string[] = [];
try {
  const { readdirSync, statSync } = await import('fs');
  const registryDir = resolve(ROOT, 'packages/almadar-std/behaviors/registry');
  for (const topic of readdirSync(registryDir)) {
    const topicDir = resolve(registryDir, topic);
    if (!statSync(topicDir).isDirectory()) continue;
    for (const level of ['atoms', 'molecules', 'organisms']) {
      const dir = resolve(topicDir, level);
      try {
        for (const f of readdirSync(dir)) {
          if (f.endsWith('.orb')) {
            behaviorNames.push(f.replace('.orb', ''));
          }
        }
      } catch { /* tier may not exist for this topic */ }
    }
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

// .lolo declaration keywords (distinct from `structuralKeys` above, which are
// .orb JSON schema object keys — these are bare-word .lolo syntax keywords).
const loloKeywords = [
  'app', 'orbital', 'uses', 'from', 'entity', 'type', 'derived', 'extends',
  'trait', 'initial', 'state', 'for', 'emits', 'listens', 'ticks', 'config',
  'page', 'with',
];

// .lolo primitive type keywords (distinct from `fieldTypes` above, which
// describes @almadar/core's EntityField.type enum — these are the literal
// type-name tokens .lolo's own grammar recognizes).
const loloPrimitiveTypes = ['string', 'number', 'boolean', 'date', 'timestamp', 'datetime', 'int'];

// .lolo entity-persistence AND event-scope keywords in one class (distinct
// from `persistenceKinds` above, which covers entity persistence only —
// .lolo's own highlighter merges the entity-persistence tags with the
// emitsScope local/internal/external tags into a single token class).
const loloPersistenceAndScope = ['persistent', 'runtime', 'singleton', 'instance', 'local', 'internal', 'external'];

// .lolo trait category tags (the `[category]` marker after a trait's entity name).
const loloTraitCategories = [
  'interaction', 'integration', 'lifecycle', 'temporal', 'validation', 'notification', 'agent',
  'game-core', 'game-character', 'game-ai', 'game-combat', 'game-items', 'game-cards', 'game-board', 'game-puzzle',
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
  loloKeywords,
  loloPrimitiveTypes,
  loloPersistenceAndScope,
  loloTraitCategories,
};

// Write to src/ so it's committed and typecheck works without build
const outPath = resolve(__dirname, '../src/tokens.json');
writeFileSync(outPath, JSON.stringify(tokens, null, 2));

console.log(`Generated tokens.json:`);
console.log(`  Operators: ${allOperatorNames.length} (${Object.keys(operatorsByNamespace).length} namespaces)`);
console.log(`  Patterns: ${patternNames.length}`);
console.log(`  Behaviors: ${behaviorNames.length}`);
console.log(`  Written to: ${outPath}`);
