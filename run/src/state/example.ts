import { createState } from "./state.ts";
import { createTrigger } from "./trigger.ts";
import { persistState } from "./persistence.ts";
import { connectPlatformState } from "./platform.ts";
import { $ } from "./index.ts";

/**
 * Example 1: Basic Counter State
 */
export function counterExample() {
  // Create state with direct signal access
  const state = createState({
    count: 0,
    step: 1
  });
  
  // Use signal's rich API directly [[memory:4955231]]
  const isPositive = state.count.gt(0);
  const doubled = $(() => state.count.get() * 2);
  const atLimit = state.count.gte(100);
  
  // Create trigger using unified API
  const trigger = createTrigger(state, {
    increment: { 
      key: 'count', 
      action: (c) => c + state.step.peek() 
    },
    decrement: { 
      key: 'count', 
      action: (c) => c - state.step.peek() 
    },
    setStep: { 
      key: 'step', 
      action: (_, newStep: number) => newStep 
    },
    reset: {
      key: 'count',
      action: () => 0
    }
  });
  
  // Setup persistence
  persistState(state, {
    key: 'counter-state',
    debounce: 500
  });
  
  return { state, trigger, isPositive, doubled, atLimit };
}

/**
 * Example 2: Game State with Platform Integration
 */
export function gameStateExample() {
  const state = createState({
    player: {
      x: 0,
      y: 0,
      health: 100,
      score: 0
    },
    enemies: [] as Array<{ x: number; y: number; health: number }>,
    gameOver: false
  });
  
  // Computed values using signal API
  const playerAlive = $(() => state.player.get().health > 0);
  const enemyCount = $(() => state.enemies.get().length);
  const _highScore = $(() => state.player.get().score);
  
  // Platform event connections
  const cleanup = connectPlatformState(state, {
    player: {
      event: 'mousemove',
      transform: (e) => ({
        ...state.player.peek(),
        x: e.clientX,
        y: e.clientY
      })
    }
  });
  
  // Game trigger using unified API
  const actions = {
    takeDamage: createTrigger(
      [state, 'player'],
      (player, damage: number) => ({
        ...player,
        health: Math.max(0, player.health - damage)
      })
    ),
    
    addScore: createTrigger(
      [state, 'player'],
      (player, points: number) => ({
        ...player,
        score: player.score + points
      })
    ),
    
    spawnEnemy: createTrigger(
      [state, 'enemies'],
      (enemies, x: number, y: number) => [
        ...enemies,
        { x, y, health: 50 }
      ]
    ),
    
    gameOver: createTrigger(
      [state, 'gameOver'],
      () => true
    )
  };
  
  // Watch for game over condition
  state.player.subscribe((player) => {
    if (player.health <= 0 && !state.gameOver.peek()) {
      actions.gameOver();
    }
  });
  
  return { state, actions, playerAlive, enemyCount, cleanup };
}

/**
 * Example 3: Form State with Validation
 */
export function formStateExample() {
  const state = createState({
    username: '',
    email: '',
    password: '',
    errors: {} as Record<string, string>
  });
  
  // Validation using signal operators
  const isValidEmail = $(() => 
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.get())
  );
  
  const isValidPassword = $(() => 
    state.password.get().length >= 8
  );
  
  const hasErrors = $(() => 
    Object.keys(state.errors.get()).length > 0
  );
  
  const isFormValid = $(() => 
    state.username.get().length > 0 &&
    isValidEmail.get() &&
    isValidPassword.get() &&
    !hasErrors.get()
  );
  
  // Form action using unified API
  const actions = createTrigger(state, {
    setUsername: {
      key: 'username',
      action: (_, value: string) => value.trim()
    },
    setEmail: {
      key: 'email',
      action: (_, value: string) => value.toLowerCase().trim()
    },
    setPassword: {
      key: 'password',
      action: (_, value: string) => value
    },
    setError: {
      key: 'errors',
      action: (errors, field: string, message: string) => ({
        ...errors,
        [field]: message
      })
    },
    clearError: {
      key: 'errors',
      action: (errors, field: string) => {
        const { [field]: _, ...rest } = errors;
        return rest;
      }
    }
  });
  
  // Auto-validate on change
  state.email.subscribe(email => {
    if (email && !isValidEmail.peek()) {
      actions.setError('email', 'Invalid email format');
    } else {
      actions.clearError('email');
    }
  });
  
  state.password.subscribe(password => {
    if (password && !isValidPassword.peek()) {
      actions.setError('password', 'Password must be at least 8 characters');
    } else {
      actions.clearError('password');
    }
  });
  
  return { state, actions, isFormValid, isValidEmail, isValidPassword };
}

/**
 * Example 4: Comparison with Old System
 */
export function comparisonExample() {
  // OLD WAY (complex, lots of boilerplate)
  /*
  const state = createState({
    initialState: { count: 0 },
    triggers: ['increment', 'decrement'],
    persist: { storage: 'localStorage', key: 'count' }
  });
  
  const incrementTrigger = registerTrigger({
    name: 'increment',
    action: (state, amount = 1) => ({ ...state, count: state.count + amount })
  });
  
  state.connectTrigger(incrementTrigger);
  state.action.increment(5);
  */
  
  // NEW WAY (simple, direct)  
  const state = createState({ count: 0 });
  const increment = createTrigger(state.count, (c, amount = 1) => c + amount);
  persistState(state, { key: 'count' });
  
  increment(5); // That's it!
  
  // Plus you get all signal operators for free
  const isPositive = state.count.gt(0);
  const isEven = $(() => state.count.get() % 2 === 0);
  const inRange = state.count.between(0, 100);
  
  return { state, increment, isPositive, isEven, inRange };
}

/**
 * Example 5: Advanced Patterns
 */
export function advancedPatternsExample() {
  // Nested state with computed relationships
  const state = createState({
    todos: [] as Array<{ id: number; text: string; done: boolean }>,
    filter: 'all' as 'all' | 'active' | 'completed'
  });
  
  // Computed derived values
  const filteredTodos = $(() => {
    const todos = state.todos.get();
    const filter = state.filter.get();
    
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.done);
      case 'completed':
        return todos.filter(t => t.done);
      default:
        return todos;
    }
  });
  
  const stats = $(() => {
    const todos = state.todos.get();
    return {
      total: todos.length,
      active: todos.filter(t => !t.done).length,
      completed: todos.filter(t => t.done).length
    };
  });
  
  // Batch operations
  const actions = {
    addMultiple: (texts: string[]) => {
      state.batch(s => {
        const currentTodos = s.todos.peek();
        const newTodos = texts.map((text, i) => ({
          id: Date.now() + i,
          text,
          done: false
        }));
        s.todos.set([...currentTodos, ...newTodos]);
      });
    },
    
    toggleAll: () => {
      state.todos.set(
        state.todos.peek().map(t => ({ ...t, done: !t.done }))
      );
    },
    
    clearCompleted: () => {
      state.todos.set(
        state.todos.peek().filter(t => !t.done)
      );
    }
  };
  
  return { state, filteredTodos, stats, actions };
}
