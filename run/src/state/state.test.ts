/**
 * Tests for the streamlined state management system
 */

import { assertEquals, assertExists } from "https://deno.land/std/testing/asserts.ts";
import { createState } from "./state.ts";
import { createTrigger } from "./trigger.ts";
import { persistState, createMemoryStorage } from "./persistence.ts";
import { isSignal, $ } from "./index.ts";

Deno.test("State V2 Tests", async (t) => {
  
  await t.step("createState creates signals for each property", () => {
    const state = createState({ count: 0, name: "test" });
    
    // Properties should be signals
    assertEquals(isSignal(state.count), true);
    assertEquals(isSignal(state.name), true);
    
    // Should have state methods
    assertExists(state.batch);
    assertExists(state.reset);
    assertExists(state.snapshot);
    assertExists(state.subscribe);
    
    // Initial values
    assertEquals(state.count.get(), 0);
    assertEquals(state.name.get(), "test");
  });
  
  await t.step("direct signal manipulation works", () => {
    const state = createState({ count: 0 });
    
    // Set value
    state.count.set(5);
    assertEquals(state.count.get(), 5);
    
    // Use signal operators - testing gt() operator
    const isPositive = state.count.gt(0);
    assertEquals(isPositive.get(), true);
    
    state.count.set(-5);
    assertEquals(isPositive.get(), false);
  });
  
  await t.step("batch updates work correctly", () => {
    const state = createState({ a: 1, b: 2, c: 3 });
    let updateCount = 0;
    
    state.subscribe(() => updateCount++);
    
    // Batch should trigger only one update
    state.batch(s => {
      s.a.set(10);
      s.b.set(20);
      s.c.set(30);
    });
    
    assertEquals(state.a.get(), 10);
    assertEquals(state.b.get(), 20);
    assertEquals(state.c.get(), 30);
    assertEquals(updateCount, 2); // Initial + batch
  });
  
  await t.step("reset restores initial values", () => {
    const state = createState({ count: 0, name: "initial" });
    
    state.count.set(100);
    state.name.set("changed");
    
    state.reset();
    
    assertEquals(state.count.get(), 0);
    assertEquals(state.name.get(), "initial");
  });
  
  await t.step("snapshot returns current values", () => {
    const state = createState({ x: 10, y: 20 });
    
    const snap1 = state.snapshot();
    assertEquals(snap1, { x: 10, y: 20 });
    
    state.x.set(30);
    const snap2 = state.snapshot();
    assertEquals(snap2, { x: 30, y: 20 });
  });
  
  await t.step("subscribe notifies on changes", () => {
    const state = createState({ value: 0 });
    const changes: number[] = [];
    
    const unsub = state.subscribe(snapshot => {
      changes.push(snapshot.value);
    });
    
    state.value.set(1);
    state.value.set(2);
    state.value.set(3);
    
    assertEquals(changes, [0, 1, 2, 3]); // Including initial
    
    unsub();
    state.value.set(4);
    assertEquals(changes.length, 4); // No new update
  });
  

  
  // Trigger tests
  await t.step("createTrigger works with signals", () => {
    const count = createState({ value: 0 }).value;
    const increment = createTrigger(count, (c, amount = 1) => c + amount);
    
    increment();
    assertEquals(count.get(), 1);
    
    increment(5);
    assertEquals(count.get(), 6);
  });
  
  await t.step("createTrigger works with state properties using tuple syntax", () => {
    const state = createState({ count: 0, multiplier: 2 });
    const multiply = createTrigger(
      [state, 'count'], 
      (c) => c * state.multiplier.peek()
    );
    
    state.count.set(5);
    multiply();
    assertEquals(state.count.get(), 10);
  });
  
  await t.step("createTrigger creates multiple triggers using batch syntax", () => {
    const state = createState({ x: 0, y: 0 });
    const triggers = createTrigger(state, {
      moveX: { key: 'x', action: (x, delta: number) => x + delta },
      moveY: { key: 'y', action: (y, delta: number) => y + delta },
      reset: { key: 'x', action: () => 0 }
    });
    
    triggers.moveX(5);
    triggers.moveY(10);
    assertEquals(state.x.get(), 5);
    assertEquals(state.y.get(), 10);
    
    triggers.reset();
    assertEquals(state.x.get(), 0);
  });
  
  await t.step("trigger throttling works", async () => {
    const state = createState({ count: 0 });
    const increment = createTrigger(
      state.count,
      c => c + 1,
      { throttle: 50 }
    );
    
    // Rapid calls
    increment();
    increment();
    increment();
    
    assertEquals(state.count.get(), 1); // Only first call
    
    // Wait for throttle
    await new Promise(resolve => setTimeout(resolve, 60));
    increment();
    assertEquals(state.count.get(), 2);
  });
  
  await t.step("trigger debouncing works", async () => {
    const state = createState({ count: 0 });
    const increment = createTrigger(
      state.count,
      c => c + 1,
      { debounce: 50 }
    );
    
    // Rapid calls
    increment();
    increment();
    increment();
    
    assertEquals(state.count.get(), 0); // Not yet
    
    // Wait for debounce
    await new Promise(resolve => setTimeout(resolve, 60));
    assertEquals(state.count.get(), 1); // Only one update
  });
  
  // Persistence tests
  await t.step("persistence saves and loads state", async () => {
    const storage = createMemoryStorage();
    const state = createState({ count: 0, name: "test" });
    
    const cleanup = persistState(state, {
      key: "test-persist",
      storage
    });
    
    // Change state
    state.count.set(42);
    state.name.set("persisted");
    
    // Wait a bit for save
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Create new state and load
    const state2 = createState({ count: 0, name: "" });
    persistState(state2, {
      key: "test-persist",
      storage
    });
    
    // Wait for load
    await new Promise(resolve => setTimeout(resolve, 10));
    
    assertEquals(state2.count.get(), 42);
    assertEquals(state2.name.get(), "persisted");
    
    cleanup();
  });
  
  await t.step("persistence respects include/exclude", async () => {
    const storage = createMemoryStorage();
    const state = createState({ 
      saved: "yes", 
      excluded: "no",
      alsoSaved: "yes"
    });
    
    persistState(state, {
      key: "test-filter",
      storage,
      include: ["saved", "alsoSaved"],
      exclude: ["excluded"]
    });
    
    state.saved.set("changed");
    state.excluded.set("changed");
    state.alsoSaved.set("changed");
    
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const stored = await storage.getItem("test-filter");
    const parsed = JSON.parse(stored!);
    
    assertEquals(parsed.saved, "changed");
    assertEquals(parsed.alsoSaved, "changed");
    assertEquals(parsed.excluded, undefined);
  });
  
  // Signal operator integration
  await t.step("signal operators work on state properties", () => {
    const state = createState({ 
      health: 100,
      score: 0,
      level: 1
    });
    
    // Boolean operators
    const isAlive = state.health.gt(0);
    const isDead = state.health.lte(0);
    const hasHighScore = state.score.gte(1000);
    
    assertEquals(isAlive.get(), true);
    assertEquals(isDead.get(), false);
    assertEquals(hasHighScore.get(), false);
    
    // Computed values using signal from scratch
    const healthPercent = $(() => (state.health.get() / 100) * 100);
    assertEquals(healthPercent.get(), 100);
    
    state.health.set(50);
    // Health percent is actually the same as health since (health/100)*100 = health
    assertEquals(healthPercent.get(), 50);
    
    // Combining signals
    const canLevelUp = state.score.gte(100).and(state.level.lt(10));
    state.score.set(150);
    assertEquals(canLevelUp.get(), true);
  });
});

// Tests run automatically when file is executed
