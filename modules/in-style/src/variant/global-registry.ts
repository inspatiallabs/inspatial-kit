/**
 * Global Style Registry for Automatic Cross-Style Composition
 * 
 * This registry tracks all named styles and enables automatic
 * composition when styles reference each other.
 */

export interface StyleRegistryEntry {
  name: string;
  config: any;
  system: any;
  dependencies: Set<string>;
}

class GlobalStyleRegistry {
  private static instance: GlobalStyleRegistry;
  private styles = new Map<string, StyleRegistryEntry>();
  
  static getInstance(): GlobalStyleRegistry {
    if (!GlobalStyleRegistry.instance) {
      GlobalStyleRegistry.instance = new GlobalStyleRegistry();
    }
    return GlobalStyleRegistry.instance;
  }
  
  /**
   * Register a named style
   */
  register(name: string, entry: StyleRegistryEntry): void {
    this.styles.set(name, entry);
  }
  
  /**
   * Get a style by name
   */
  get(name: string): StyleRegistryEntry | undefined {
    return this.styles.get(name);
  }
  
  /**
   * Check if a style exists
   */
  has(name: string): boolean {
    return this.styles.has(name);
  }
  
  /**
   * Get all styles that depend on a given style
   */
  getDependents(name: string): Set<string> {
    const dependents = new Set<string>();
    
    for (const [styleName, entry] of this.styles) {
      if (entry.dependencies.has(name)) {
        dependents.add(styleName);
      }
    }
    
    return dependents;
  }
  
  /**
   * Get all styles needed for composition (including transitive dependencies)
   */
  getCompositionChain(name: string, visited = new Set<string>()): Set<string> {
    if (visited.has(name)) return visited;
    
    visited.add(name);
    const entry = this.get(name);
    
    if (entry) {
      for (const dep of entry.dependencies) {
        this.getCompositionChain(dep, visited);
      }
    }
    
    return visited;
  }
  
  /**
   * Clear the registry (mainly for testing)
   */
  clear(): void {
    this.styles.clear();
  }
}

export const globalStyleRegistry = GlobalStyleRegistry.getInstance();
