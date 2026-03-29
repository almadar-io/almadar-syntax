/**
 * @almadar/syntax
 *
 * Registry-driven syntax highlighting for Orb programs.
 * Colors align with the Almadar Visual Language (AVL).
 *
 * @packageDocumentation
 */

export { registerOrbLanguage, classifyOrbToken, isRegisteredOperator, isRegisteredPattern } from './prism-orb.js';
export { ORB_COLORS } from './colors.js';

/**
 * Refractor-compatible language definition for .orb files.
 *
 * Use with react-syntax-highlighter or refractor directly:
 *
 *   import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/prism-light';
 *   import { orbLanguage } from '@almadar/syntax';
 *   SyntaxHighlighter.registerLanguage('orb', orbLanguage);
 *
 * Or with refractor:
 *   import { refractor } from 'refractor/core';
 *   import { orbLanguage } from '@almadar/syntax';
 *   refractor.register(orbLanguage);
 */
export { orbLanguage } from './refractor-orb.js';
