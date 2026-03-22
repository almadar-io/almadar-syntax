/**
 * AVL-aligned color palette for Orb syntax highlighting.
 *
 * Each color matches its corresponding AVL visual concept:
 * - Effect operators are purple (same as AvlEffect icons)
 * - Bindings are cyan (same as AvlBindingRef)
 * - Events are yellow (same as AvlEvent lightning bolt)
 * - etc.
 */

export const ORB_COLORS = {
  dark: {
    binding:        '#22D3EE',  // cyan - AvlBindingRef
    effect:         '#A78BFA',  // purple - AvlEffect
    arithmetic:     '#4A90D9',  // blue - AVL arithmetic
    comparison:     '#E8913A',  // orange - AVL comparison
    logic:          '#9B59B6',  // purple - AVL logic
    control:        '#E74C3C',  // red - AVL control
    string:         '#27AE60',  // green - AVL string ops
    collection:     '#1ABC9C',  // teal - AVL collection
    time:           '#F39C12',  // yellow - AVL time
    async:          '#E91E8F',  // pink - AVL async
    event:          '#FBBF24',  // yellow - AvlEvent
    pattern:        '#F472B6',  // pink - UI pattern
    patternWarning: '#F59E0B',  // amber - unregistered pattern
    error:          '#EF4444',  // red - unknown/invalid
    structural:     '#9CA3AF',  // gray - schema keys
    stringLiteral:  '#4ADE80',  // green - AvlLiteral
    number:         '#60A5FA',  // blue - AvlLiteral
    boolean:        '#C084FC',  // purple
    null:           '#6B7280',  // gray
    uiSlot:         '#2DD4BF',  // teal - AvlSlotMap
    fieldType:      '#E8913A',  // orange - AvlFieldType
    persistence:    '#E8913A',  // orange - Entity stroke
    behavior:       '#818CF8',  // indigo - std behavior
  },
  light: {
    binding:        '#0891B2',
    effect:         '#7C3AED',
    arithmetic:     '#2563EB',
    comparison:     '#D97706',
    logic:          '#7C3AED',
    control:        '#DC2626',
    string:         '#059669',
    collection:     '#0D9488',
    time:           '#D97706',
    async:          '#DB2777',
    event:          '#B45309',
    pattern:        '#DB2777',
    patternWarning: '#D97706',
    error:          '#DC2626',
    structural:     '#6B7280',
    stringLiteral:  '#059669',
    number:         '#2563EB',
    boolean:        '#7C3AED',
    null:           '#6B7280',
    uiSlot:         '#0D9488',
    fieldType:      '#D97706',
    persistence:    '#D97706',
    behavior:       '#4F46E5',
  },
} as const;
