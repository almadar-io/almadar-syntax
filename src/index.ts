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
