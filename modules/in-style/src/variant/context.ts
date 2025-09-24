/**
 * Context Registry for Cross-Style Composition
 * 
 * This module provides an implicit context system that allows styles to
 * reference each other without explicit composition at the component level.
 * 
 * Uses InSpatial's signal system for proper batching and reactivity.
 */

import { tick } from "@in/teract/signal";

type StyleContext = {
  settings: Record<string, any>;
  name: string;
};

class StyleContextRegistry {
  private static instance: StyleContextRegistry;
  private contexts: Map<string, StyleContext> = new Map();
  private evaluationDepth: number = 0;
  private cleanupScheduled: boolean = false;

  static getInstance(): StyleContextRegistry {
    if (!StyleContextRegistry.instance) {
      StyleContextRegistry.instance = new StyleContextRegistry();
    }
    return StyleContextRegistry.instance;
  }

  /**
   * Begin a new evaluation cycle
   * Increments depth to handle nested evaluations
   */
  beginEvaluation(): void {
    this.evaluationDepth++;
  }

  /**
   * End the current evaluation cycle
   * Only clears when all nested evaluations are complete
   */
  endEvaluation(): void {
    this.evaluationDepth--;
    if (this.evaluationDepth <= 0) {
      this.evaluationDepth = 0;
      this.contexts.clear();
    }
  }

  /**
   * Register a style's evaluation context
   */
  register(name: string, settings: Record<string, any>): void {
    if (!name) return;
    
    // Auto-start evaluation if not active
    const wasInactive = this.evaluationDepth === 0;
    if (wasInactive) {
      this.beginEvaluation();
    }
    
    this.contexts.set(name, { name, settings });
    
    // Schedule cleanup if we auto-started
    if (wasInactive && !this.cleanupScheduled) {
      this.cleanupScheduled = true;
      // Use tick() for proper signal batching
      // This ensures context survives the entire render cycle
      tick().then(() => {
        this.cleanupScheduled = false;
        if (this.evaluationDepth === 1) {
          this.endEvaluation();
        }
      });
    }
  }

  /**
   * Get a style's context by name
   */
  getContext(name: string): StyleContext | undefined {
    return this.contexts.get(name);
  }

  /**
   * Check if we're currently collecting contexts
   */
  isActive(): boolean {
    return this.evaluationDepth > 0;
  }

  /**
   * Get all registered contexts
   */
  getAllContexts(): Map<string, StyleContext> {
    return new Map(this.contexts);
  }

  /**
   * Clear all contexts (useful for cleanup)
   */
  clear(): void {
    this.contexts.clear();
    this.evaluationDepth = 0;
  }
}

export const styleContextRegistry = StyleContextRegistry.getInstance();