/**
 * @almadar/syntax
 *
 * Registry-driven syntax highlighting for .orb and .lolo programs.
 * Colors align with the Almadar Visual Language (AVL).
 *
 * @packageDocumentation
 */

// ── .orb (JSON) ──────────────────────────────────────────────────────────────
export { registerOrbLanguage, classifyOrbToken, isRegisteredOperator, isRegisteredPattern } from './prism-orb.js';

/**
 * Refractor/react-syntax-highlighter language definition for .orb files.
 *
 *   import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
 *   import { orbLanguage } from '@almadar/syntax';
 *   SyntaxHighlighter.registerLanguage('orb', orbLanguage);
 */
export { orbLanguage } from './refractor-orb.js';

// ── .lolo (text) ─────────────────────────────────────────────────────────────
export { registerLoloLanguage, classifyLoloToken } from './lolo/prism-lolo.js';

/**
 * Refractor/react-syntax-highlighter language definition for .lolo files.
 *
 *   import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
 *   import { loloLanguage } from '@almadar/syntax';
 *   SyntaxHighlighter.registerLanguage('lolo', loloLanguage);
 */
export { loloLanguage } from './lolo/refractor-lolo.js';

// ── Shared ────────────────────────────────────────────────────────────────────
export { ORB_COLORS } from './colors.js';
