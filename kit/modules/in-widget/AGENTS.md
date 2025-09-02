
/**
 * # Atomic Design Component Pattern**
 * - Structure components following atomic design methodology
 * - Categorize components as Atoms, Molecules, Widgets, Templates (Organisms), or Windows (Pages)
 * - Append component category and "Component" to names
 * - Define prop types with the same prefix and "Type" suffix
 */

/**
 * # Atoms (Basic building blocks)
 * - No Prefix: ""
 * - Simplest components that can't be broken down further
 * - Examples: buttons, inputs, labels, icons
 * - Use InSpatial Type for runtime validation and TypeScript inference
 */

/**
 * # Molecules (Combinations of atoms)
 * - Prefix: "Molecule"
 * - Simple groups of UI elements functioning together
 * - Examples: form fields (label + input), search bars (input + button)
 * - Use InSpatial Type for runtime validation and TypeScript inference
 */

/**
 * # Widgets (AKA Organisms - Complex UI components)
 * - Prefix: "Widget"
 * - Relatively complex components composed of molecules and/or atoms
 * - Examples: navigation bars, user profiles, product cards
 * - Use InSpatial Type for runtime validation and TypeScript inference
 */
/
/**
 * # Templates (Window layouts without content)
 * - Prefix: "Template"
 * - Layout structures that arrange organisms and molecules
 * - Focus on structure rather than content
 * - Use InSpatial Type for runtime validation and TypeScript inference
 */

/**
 * # Windows (Specific instances of templates)
 * - Surfix: "Window"
 * - Complete pages that implement templates with specific content
 * - Usually connected to data sources and routes
 * - Use InSpatial Type for runtime validation and TypeScript inference
 */
