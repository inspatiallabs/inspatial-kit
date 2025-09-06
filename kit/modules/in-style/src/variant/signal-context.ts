/**
 * Signal-Based Context Registry for Cross-Style Composition
 * 
 * This enhanced registry uses InSpatial's signal system to provide
 * truly reactive cross-style composition without manual composeStyle.
 */

export type StyleContext = {
  settings: Record<string, any>;
  name: string;
  generation?: number;
};

export class SignalStyleContextRegistry {
  private static instance: SignalStyleContextRegistry;
  
  // Signal-based context storage for reactivity (lazy initialized)
  private contextsSignal: any; // Will be Signal<Map<string, StyleContext>>
  private evaluationDepth: number = 0;
  private cleanupScheduled: boolean = false;
  private generation: number = 0;
  
  // Track active evaluations for proper cleanup
  private activeEvaluations = new Set<string>();
  
  // Track dependencies between styles
  private dependencies = new Map<string, Set<string>>();
  
  // Lazy-loaded signal functions
  private signalModule: any = null;
  
  constructor() {
    // Defer initialization
  }
  
  private async ensureInitialized(): Promise<void> {
    if (!this.signalModule) {
      // Dynamic import to avoid circular dependency
      this.signalModule = await import("@in/teract/signal");
      
      if (!this.contextsSignal) {
        this.contextsSignal = this.signalModule.createSignal(new Map());
      }
    }
  }
  
  private ensureInitializedSync(): void {
    if (!this.signalModule) {
      // Try to load synchronously if possible
      try {
        // @ts-ignore
        this.signalModule = globalThis.__signalModule || require("@in/teract/signal");
        if (!this.contextsSignal) {
          this.contextsSignal = this.signalModule.createSignal(new Map());
        }
      } catch {
        // Fallback to empty map if signals not available yet
        if (!this.contextsSignal) {
          this.contextsSignal = {
            value: new Map(),
            peek: () => new Map(),
          };
        }
      }
    }
  }
  
  static getInstance(): SignalStyleContextRegistry {
    if (!SignalStyleContextRegistry.instance) {
      SignalStyleContextRegistry.instance = new SignalStyleContextRegistry();
    }
    return SignalStyleContextRegistry.instance;
  }
  
  /**
   * Begin a new evaluation cycle
   */
  beginEvaluation(): string {
    this.evaluationDepth++;
    const evaluationId = `eval-${++this.generation}-${Math.random().toString(36).slice(2)}`;
    this.activeEvaluations.add(evaluationId);
    return evaluationId;
  }
  
  /**
   * End an evaluation cycle
   */
  endEvaluation(evaluationId?: string): void {
    this.evaluationDepth--;
    if (evaluationId) {
      this.activeEvaluations.delete(evaluationId);
    }
    
    if (this.evaluationDepth <= 0) {
      this.evaluationDepth = 0;
      // Only clear if no active evaluations
      if (this.activeEvaluations.size === 0) {
        this.clearContexts();
      }
    }
  }
  
  /**
   * Register a style's evaluation context reactively
   */
  register(name: string, settings: Record<string, any>): void {
    if (!name) return;
    this.ensureInitializedSync();
    
    // Auto-start evaluation if not active
    const wasInactive = this.evaluationDepth === 0;
    let evaluationId: string | undefined;
    
    if (wasInactive) {
      evaluationId = this.beginEvaluation();
    }
    
    // Update contexts
    if (this.signalModule?.untrack) {
      // Use untrack if available
      this.signalModule.untrack(() => {
        const current = new Map(this.contextsSignal.peek());
        current.set(name, { 
          name, 
          settings,
          generation: this.generation 
        });
        this.contextsSignal.value = current;
      });
    } else {
      // Fallback for when signals not loaded
      const current = new Map(this.contextsSignal.peek ? this.contextsSignal.peek() : this.contextsSignal.value);
      current.set(name, { 
        name, 
        settings,
        generation: this.generation 
      });
      if (this.contextsSignal.value !== undefined) {
        this.contextsSignal.value = current;
      }
    }
    
    // Schedule cleanup if we auto-started
    if (wasInactive && !this.cleanupScheduled) {
      this.cleanupScheduled = true;
      
      // Use tick() if available, otherwise setTimeout
      const cleanup = () => {
        this.cleanupScheduled = false;
        if (evaluationId) {
          this.endEvaluation(evaluationId);
        }
      };
      
      if (this.signalModule?.tick) {
        this.signalModule.tick().then(cleanup);
      } else {
        setTimeout(cleanup, 0);
      }
    }
  }
  
  /**
   * Get a style's context reactively
   * This creates a reactive dependency!
   */
  getContext(name: string): StyleContext | undefined {
    this.ensureInitializedSync();
    // Reading from signal creates reactive dependency
    const contexts = this.contextsSignal.value || new Map();
    return contexts.get(name);
  }
  
  /**
   * Get context without creating reactive dependency
   */
  peekContext(name: string): StyleContext | undefined {
    this.ensureInitializedSync();
    const contexts = this.contextsSignal.peek ? this.contextsSignal.peek() : (this.contextsSignal.value || new Map());
    return contexts.get(name);
  }
  
  /**
   * Watch for context changes
   */
  watchContext(name: string, callback: (settings: any) => void): () => void {
    this.ensureInitializedSync();
    
    if (this.signalModule?.watch) {
      return this.signalModule.watch(() => {
        const context = this.getContext(name);
        if (context) {
          callback(context.settings);
        }
      });
    }
    
    // Fallback: no-op disposer
    return () => {};
  }
  
  /**
   * Track dependency between styles
   */
  trackDependency(fromStyle: string, toStyle: string): void {
    if (!this.dependencies.has(fromStyle)) {
      this.dependencies.set(fromStyle, new Set());
    }
    this.dependencies.get(fromStyle)!.add(toStyle);
  }
  
  /**
   * Get dependencies for a style
   */
  getDependencies(styleName: string): Set<string> {
    return this.dependencies.get(styleName) || new Set();
  }
  
  /**
   * Check if styles have cross-references
   */
  hasCrossReferences(styleName: string): boolean {
    return this.dependencies.has(styleName) && this.dependencies.get(styleName)!.size > 0;
  }
  
  /**
   * Evaluate with frozen context (for nested evaluations)
   */
  evaluateWithContext<T>(fn: () => T, contexts?: Map<string, StyleContext>): T {
    this.ensureInitializedSync();
    
    if (contexts) {
      // Temporarily set contexts
      const prev = this.contextsSignal.peek ? this.contextsSignal.peek() : this.contextsSignal.value;
      
      if (this.signalModule?.untrack) {
        this.signalModule.untrack(() => {
          this.contextsSignal.value = contexts;
        });
      } else if (this.contextsSignal.value !== undefined) {
        this.contextsSignal.value = contexts;
      }
      
      try {
        return this.signalModule?.freeze ? this.signalModule.freeze(fn)() : fn();
      } finally {
        // Restore previous contexts
        if (this.signalModule?.untrack) {
          this.signalModule.untrack(() => {
            this.contextsSignal.value = prev;
          });
        } else if (this.contextsSignal.value !== undefined) {
          this.contextsSignal.value = prev;
        }
      }
    }
    
    return this.signalModule?.freeze ? this.signalModule.freeze(fn)() : fn();
  }
  
  /**
   * Clear all contexts
   */
  clearContexts(): void {
    this.ensureInitializedSync();
    
    if (this.signalModule?.untrack) {
      this.signalModule.untrack(() => {
        this.contextsSignal.value = new Map();
      });
    } else if (this.contextsSignal.value !== undefined) {
      this.contextsSignal.value = new Map();
    }
  }
  
  /**
   * Check if evaluation is active
   */
  isActive(): boolean {
    return this.evaluationDepth > 0 || this.activeEvaluations.size > 0;
  }
  
  /**
   * Get all current contexts
   */
  getAllContexts(): Map<string, StyleContext> {
    this.ensureInitializedSync();
    return new Map(this.contextsSignal.value || new Map());
  }
  
  /**
   * Clear all state (for testing)
   */
  clear(): void {
    this.clearContexts();
    this.evaluationDepth = 0;
    this.cleanupScheduled = false;
    this.activeEvaluations.clear();
    this.dependencies.clear();
    this.generation = 0;
  }
}

// Export singleton instance
export const signalStyleContextRegistry = SignalStyleContextRegistry.getInstance();