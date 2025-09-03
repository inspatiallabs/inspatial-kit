# Signal

#### The reactive data management system that makes your application values smart and responsive

The **Signal** system is like having a smart assistant for your data. Think of it like a notification system where values can announce when they change, and other parts of your code can automatically listen and react accordingly. Just like how your phone notifies you when you get a new message, signals notify your application when data changes.

This is the lightweight alternative to complex state management systems, completely decoupled from any rendering logic, making it work seamlessly with any framework or even vanilla JavaScript. Signal APIs are self-contained and work at the component level without requiring any global setup.

### 💡 Core Concepts

Signals provide three essential building blocks for reactive programming:

- **Signals**: Smart containers for values that automatically notify listeners when they change
- **Computed Signals**: Values that automatically derive from other signals and stay in sync
- **Effects**: Functions that automatically run whenever their signal dependencies change

The beauty of signals is that they handle all the complexity of tracking dependencies and scheduling updates for you. You just focus on describing what your data should look like and how it should behave.

### 🎯 Prerequisites

Before you start:

- Basic understanding of JavaScript/TypeScript
- Familiarity with reactive programming concepts (helpful but not required)
- No framework dependencies or special setup required

### ⚠️ Important Notes

> [!NOTE]
> Signal effects are batched and processed asynchronously. This means no matter how many times you change a signal's value in the same tick, its effects will only run once at the end. If you need to access updated computed values immediately after making changes, use `nextTick()` or `await tick()`.

> [!NOTE]  
> All signal updates are automatically batched for optimal performance. Multiple changes to the same signal or related signals in the same execution cycle will trigger effects only once with the final values.

> [!NOTE]  
> Signals are the lowest-level interactive primitives you should only ever use `createSignal()` API from `@in/teract/signal` directly only when building frameworks. Otherwise application development MUST use `createState()` api from `@inspatial/kit/state` which builds upon signals.

### 📚 Terminology

> **Signal**: A reactive container that holds a value and notifies listeners when the value changes
> **Computed Signal**: A signal whose value is automatically calculated from other signals
> **Effect**: A function that runs automatically when its signal dependencies change
> **Dependency Tracking**: The automatic process of figuring out which signals an effect depends on
> **Batching**: Grouping multiple updates together to run effects only once per update cycle

## API Reference

### 🎮 Usage

#### Basic Import

```typescript
// ✅ Recommended: Direct import from kit
import { createSignal, computed, watch } from "@inspatial/kit/signal";

// ❌ Avoid: Package-level import
import { createSignal } from "@inspatial/kit";
```

<details>
<summary>📦 Installation for Framework Authors</summary>

If you're building a framework or library that needs to include signals:

```bash
deno install jsr:@in/teract
```

##

```bash
npx jsr add @in/teract
```

##

```bash
yarn dlx jsr add @in/teract
```

##

```bash
pnpm dlx jsr add @in/teract
```

##

```bash
bunx jsr add @in/teract
```

</details>

### Core Functions

#### `createSignal(value, compute?)`

##### Creates a smart container for reactive values

The `createSignal` function is like creating a special box that not only holds your data but also tells everyone when the data changes. Think of it like a smart mailbox that alerts you whenever new mail arrives.

You can create a simple signal with just a value, or create a computed signal that automatically calculates its value based on another signal.

### Example 1: Creating Ben's Game Score Tracker

```typescript
import { createSignal } from "@inspatial/kit/signal";

// Create a signal to track Ben's current score
const benScore = createSignal(0);

// Check Ben's current score
console.log(benScore.value); // 0

// Ben scores some points!
benScore.value = 150;
console.log(benScore.value); // 150

// Ben loses some points
benScore.value = 120;
console.log(benScore.value); // 120
```

### Example 2: Creating Charlotte's Temperature Monitor

```typescript
import { createSignal } from "@inspatial/kit/signal";

// Track the temperature in Charlotte's room
const roomTemperature = createSignal(22); // 22°C

// Create a computed signal that converts to Fahrenheit
const tempInFahrenheit = createSignal(roomTemperature, (celsius) => {
  return (celsius * 9) / 5 + 32;
});

console.log(tempInFahrenheit.value); // 71.6°F

// When Charlotte adjusts the thermostat
roomTemperature.value = 25; // 25°C
console.log(tempInFahrenheit.value); // 77°F (automatically updated!)
```

#### `computed(fn) and/or $()`

##### Creates values that automatically update when their dependencies change

The `computed` function is like having a smart assistant that watches your data and automatically updates calculations for you. Think of it like a personal finance app that shows your total spending - whenever you add a new expense, it instantly updates your total without you having to manually recalculate anything.

> **Note:** `$()` is an alias for `computed()` - they do exactly the same thing!

🔍 **In a nutshell Computed/$:**

- Reads existing signal values
- Transforms them into new values  
- Memoizes the result (only recalculates when dependencies change)
- Updates automatically when dependencies change

It's basically a smart getter that:
- Only runs when its inputs change
- Caches the result between changes
- Automatically tracks what signals it depends on

### Example 1: Eli's Shopping Cart Total

```typescript
import { createSignal, computed } from "@inspatial/kit/signal";

// Eli's shopping cart items
const itemPrice = createSignal(25.99);
const quantity = createSignal(2);
const taxRate = createSignal(0.08); // 8% tax

// The total automatically calculates when any value changes
const cartTotal = computed(() => {
  const subtotal = itemPrice.value * quantity.value;
  const tax = subtotal * taxRate.value;
  return subtotal + tax;
});

console.log(cartTotal.value); // 56.1384 (25.99 * 2 * 1.08)

// When Eli adds more items
quantity.value = 3;
console.log(cartTotal.value); // 84.2076 (automatically recalculated!)
```

### Example 2: Mike's User Profile Display

```typescript
import { createSignal, computed } from "@inspatial/kit/signal";

// Mike's profile information
const firstName = createSignal("Mike");
const lastName = createSignal("Anderson");
const age = createSignal(28);

// Computed values that update when profile changes
const fullName = computed(() => `${firstName.value} ${lastName.value}`);
const displayName = computed(
  () => `${fullName.value} (${age.value} years old)`
);

console.log(displayName.value); // "Mike Anderson (28 years old)"

// When Mike updates his information
lastName.value = "Smith";
age.value = 29;
console.log(displayName.value); // "Mike Smith (29 years old)"
```

#### `isSignal(value)`

##### Checks if a value is a signal

The `isSignal` function helps you determine if something is a signal or just a regular value. Think of it like a detector that tells you whether you're looking at a smart reactive container or just plain data.

### Example 1: Ben's Data Type Checker

```typescript
import { createSignal, isSignal } from "@inspatial/kit/signal";

const benAge = createSignal(25);
const benName = "Ben Parker";
const benCity = createSignal("New York");

// Check what's a signal and what isn't
console.log(isSignal(benAge)); // true (it's a signal)
console.log(isSignal(benName)); // false (it's just a string)
console.log(isSignal(benCity)); // true (it's a signal)
console.log(isSignal(42)); // false (it's just a number)
```

#### `Signal.ensure(value)`

##### Ensures a value is a signal, creating one if needed

The `Signal.ensure` method is like a helpful converter that takes any value and makes sure it's a signal. If it's already a signal, it leaves it alone. If it's just a regular value, it wraps it in a signal. Think of it like a universal adapter that makes everything work with the signal system.

### Example 1: Charlotte's Mixed Data Handler

```typescript
import { createSignal } from "@inspatial/kit/signal";

const charlotteAge = createSignal(22);
const charlotteName = "Charlotte Davis"; // Just a string
const charlotteScore = 95; // Just a number

// Ensure everything is a signal for consistent handling
const ageSignal = createSignal.ensure(charlotteAge); // Returns the same signal
const nameSignal = createSignal.ensure(charlotteName); // Creates new signal("Charlotte Davis")
const scoreSignal = createSignal.ensure(charlotteScore); // Creates new signal(95)

console.log(ageSignal === charlotteAge); // true (same signal)
console.log(nameSignal.value); // "Charlotte Davis"
console.log(scoreSignal.value); // 95
```

#### `Signal.ensureAll(...values)`

##### Converts multiple values to signals at once

The `Signal.ensureAll` method is like `Signal.ensure` but for multiple values at once. Think of it like a batch converter that takes a mix of signals and regular values and makes sure they're all signals.

### Example 1: Eli's Data Normalization

```typescript
import { createSignal } from "@inspatial/kit/signal";

// Eli has mixed data types
const existingSignal = createSignal("Hello");
const regularString = "World";
const regularNumber = 42;
const anotherSignal = createSignal(true);

// Convert everything to signals at once
const allSignals = createSignal.ensureAll(
  existingSignal,
  regularString,
  regularNumber,
  anotherSignal
);

// Now everything is guaranteed to be a signal
console.log(allSignals[0].value); // "Hello"
console.log(allSignals[1].value); // "World"
console.log(allSignals[2].value); // 42
console.log(allSignals[3].value); // true
```

### Signal Instance Methods

#### `.get()`

##### Gets the current value and tracks dependencies

The `.get()` method retrieves the current value from a signal and automatically registers the calling effect as a dependency. Think of it like subscribing to a newsletter - when you read the value, you're also signing up to be notified when it changes.

### Example 1: Ben's Score Tracker with Dependency

```typescript
import { createSignal, watch } from "@inspatial/kit/signal";

const benScore = createSignal(100);

// This effect will re-run whenever benScore changes
watch(() => {
  const currentScore = benScore.get(); // Creates dependency
  console.log(`Ben's current score: ${currentScore}`);
});

benScore.value = 150; // Logs: "Ben's current score: 150"
```

#### `.set(value, context?)`

##### Updates the signal's value and notifies all listeners

The `.set()` method updates a signal's value and automatically triggers all connected effects. Think of it like updating a status board - everyone watching gets notified of the change.

@returns {void}

### Example 1: Charlotte's Temperature Control

```typescript
import { createSignal } from "@inspatial/kit/signal";

const roomTemp = createSignal(20);

// Update the temperature
roomTemp.set(25);
console.log(roomTemp.value); // 25

// You can also use the value setter
roomTemp.value = 22;
console.log(roomTemp.value); // 22
```

#### `.peek()`

##### Gets the current value without creating dependencies

The `.peek()` method lets you read a signal's value without subscribing to changes. Think of it like looking at something without committing to watch it - you see the current state but won't be notified of future changes.

### Example 1: Eli's Conditional Logic

```typescript
import { createSignal, watch } from "@inspatial/kit/signal";

const eliScore = createSignal(85);
const gameMode = createSignal("easy");

// Effect that only depends on eliScore, not gameMode
watch(() => {
  const score = eliScore.get(); // Creates dependency
  const mode = gameMode.peek(); // No dependency created

  console.log(`Score: ${score} in ${mode} mode`);
});

gameMode.value = "hard"; // Effect doesn't run (no dependency)
eliScore.value = 90; // Effect runs: "Score: 90 in hard mode"
```

#### `.poke(value)`

##### Sets a value without triggering updates

The `.poke()` method quietly updates a signal's value without notifying anyone. Think of it like changing something behind the scenes - the value changes but no alarms go off.

@returns {void}

### Example 1: Mike's Silent Update

```typescript
import { createSignal, watch } from "@inspatial/kit/signal";

const mikeHealth = createSignal(100);

// Watch for health changes
watch(() => {
  console.log(`Mike's health: ${mikeHealth.value}`);
});
// Logs immediately: "Mike's health: 100"

// Silent update - no effect triggers
mikeHealth.poke(90);
console.log(mikeHealth.value); // 90 (value changed)
// But the watch effect didn't run

// Normal update - effect triggers
mikeHealth.value = 80; // Logs: "Mike's health: 80"
```

#### `.trigger()`

##### Manually triggers all connected effects

The `.trigger()` method manually forces all effects connected to this signal to run, even if the value hasn't changed. Think of it like hitting a refresh button - everyone gets notified regardless.

@returns {void}

### Example 1: Charlotte's Manual Refresh

```typescript
import { createSignal, watch } from "@inspatial/kit/signal";

const charlotteStatus = createSignal("online");

watch(() => {
  console.log(`Charlotte is ${charlotteStatus.value}`);
});
// Logs: "Charlotte is online"

// Force the effect to run again without changing the value
charlotteStatus.trigger(); // Logs: "Charlotte is online"
```

#### `.refresh()`

##### Re-evaluates computed signals with external dependencies

The `.refresh()` method forces a computed signal to recalculate its value, which is useful when external values that aren't signals have changed. Think of it like asking a calculator to redo its math with updated numbers.

@returns {void}

### Example 1: Ben's External Data Integration

```typescript
import { createSignal } from "@inspatial/kit/signal";

const benScore = createSignal(100);
let bonusMultiplier = 1.5; // External variable, not a signal

// Computed signal that uses external variable
const finalScore = createSignal(benScore, (score) => {
  return Math.floor(score * bonusMultiplier);
});

console.log(finalScore.value); // 150 (100 * 1.5)

// Change external variable
bonusMultiplier = 2.0;

// Signal system doesn't know about the change, so we refresh
finalScore.refresh();
console.log(finalScore.value); // 200 (100 * 2.0)
```

#### `.connect(effect, runImmediate?)`

##### Manually connects an effect to the signal

The `.connect()` method lets you manually attach an effect function to a signal. Think of it like subscribing a specific function to receive notifications when the signal changes.

@returns {void}

### Example 1: Eli's Custom Effect Connection

```typescript
import { createSignal } from "@inspatial/kit/signal";

const eliLevel = createSignal(1);

// Manually connect an effect
eliLevel.connect(() => {
  console.log(`Eli reached level ${eliLevel.value}!`);
});
// Logs immediately: "Eli reached level 1!"

// Connect without running immediately
eliLevel.connect(() => {
  console.log(`Level up notification: ${eliLevel.value}`);
}, false);

eliLevel.value = 2;
// Logs: "Eli reached level 2!"
// Logs: "Level up notification: 2"
```

#### `.touch()`

##### Creates a dependency without reading the value

The `.touch()` method subscribes the current effect to this signal without actually reading its value. Think of it like putting your hand on something to feel when it moves, without looking at it.

@returns {void}

### Example 1: Mike's Change Detection

```typescript
import { createSignal, watch } from "@inspatial/kit/signal";

const mikeStatus = createSignal("idle");
const lastUpdate = createSignal(Date.now());

// Effect that runs when mikeStatus changes, but doesn't need its value
watch(() => {
  mikeStatus.touch(); // Subscribe to changes without reading value
  console.log(`Mike's status changed at ${new Date().toLocaleTimeString()}`);
});

mikeStatus.value = "busy"; // Logs: "Mike's status changed at [current time]"
```

#### `.subscribe(listener)`

##### Creates a subscription with automatic cleanup

The `.subscribe()` method creates a subscription that calls your listener function whenever the signal changes. Think of it like subscribing to a newsletter - you get updates delivered to your inbox.

### Example 1: Charlotte's News Subscription

```typescript
import { createSignal } from "@inspatial/kit/signal";

const charlotteScore = createSignal(0);

// Subscribe to score changes
const unsubscribe = charlotteScore.subscribe((newScore) => {
  console.log(`Charlotte's new score: ${newScore}`);
});

charlotteScore.value = 50; // Logs: "Charlotte's new score: 50"
charlotteScore.value = 75; // Logs: "Charlotte's new score: 75"

// Clean up when done
unsubscribe();
charlotteScore.value = 100; // No log (unsubscribed)
```

#### `.on(event, listener)`

##### Enhanced subscription with change details

The `.on()` method provides enhanced subscriptions that give you both old and new values, plus optional context. Think of it like a detailed change log that tells you exactly what happened.

### Example 1: Ben's Detailed Change Tracking

```typescript
import { createSignal } from "@inspatial/kit/signal";

const benHealth = createSignal(100);

// Subscribe to detailed changes
const unsubscribe = benHealth.on("change", (newHealth, oldHealth, context) => {
  const change = newHealth - oldHealth;
  const direction = change > 0 ? "gained" : "lost";
  console.log(`Ben ${direction} ${Math.abs(change)} health points`);
  if (context) {
    console.log(`Reason: ${context}`);
  }
});

benHealth.set(90, "took damage");
// Logs: "Ben lost 10 health points"
// Logs: "Reason: took damage"

benHealth.set(95, "healing potion");
// Logs: "Ben gained 5 health points"
// Logs: "Reason: healing potion"

unsubscribe();
```

### Signal Properties

#### `.value`

##### Direct access to the signal's current value

The `.value` property provides convenient getter/setter access to a signal's value. Think of it like a smart variable that notifies everyone when it changes.

### Example 1: Eli's Simple Value Access

```typescript
import { createSignal } from "@inspatial/kit/signal";

const eliPoints = createSignal(0);

// Get the current value
console.log(eliPoints.value); // 0

// Set a new value
eliPoints.value = 100;
console.log(eliPoints.value); // 100

// Increment the value
eliPoints.value += 25;
console.log(eliPoints.value); // 125
```

#### `.connected`

##### Indicates if the signal has active listeners

The `.connected` property tells you whether any effects or subscriptions are currently listening to this signal. Think of it like checking if anyone is subscribed to your newsletter.

### Example 1: Mike's Connection Status

```typescript
import { createSignal, watch } from "@inspatial/kit/signal";

const mikeStatus = createSignal("idle");

console.log(mikeStatus.connected); // false (no listeners yet)

// Add a watcher
const dispose = watch(() => {
  console.log(`Mike is ${mikeStatus.value}`);
});

console.log(mikeStatus.connected); // true (now has a listener)

// Remove the watcher
dispose();
console.log(mikeStatus.connected); // false (no listeners again)
```

#### `.hasValue()`

##### Checks if the signal contains a meaningful value

The `.hasValue()` method checks if a signal has a non-nullish value (not `undefined` or `null`). Think of it like checking if a box actually contains something useful.

### Example 1: Charlotte's Value Validation

```typescript
import { createSignal } from "@inspatial/kit/signal";

const charlotteName = createSignal("Charlotte");
const charlotteAge = createSignal(null);
const charlotteCity = createSignal(undefined);
const charlotteScore = createSignal(0);

console.log(charlotteName.hasValue()); // true (has a string)
console.log(charlotteAge.hasValue()); // false (null)
console.log(charlotteCity.hasValue()); // false (undefined)
console.log(charlotteScore.hasValue()); // true (0 is a valid value)
```

#### `.nullishThen(value)`

##### Provides a fallback value for null or undefined signals

The `.nullishThen()` method creates a new signal that provides a fallback value when the original signal is nullish (`undefined` or `null`). Think of it like having a backup plan - if the main value isn't available, use the backup.

### Example 1: Ben's Username with Default

```typescript
import { createSignal } from "@inspatial/kit/signal";

const benUsername = createSignal(null);
const displayName = benUsername.nullishThen("Anonymous User");

console.log(displayName.value); // "Anonymous User"

// When Ben sets his username
benUsername.value = "BenCoder123";
console.log(displayName.value); // "BenCoder123"

// If Ben clears his username
benUsername.value = undefined;
console.log(displayName.value); // "Anonymous User" (fallback)
```

### Signal Operations

Signals provide a rich set of operations for creating reactive logic and comparisons. Think of these like smart operators that create new signals based on conditions and logic.

#### Logical Operations

#### `.inverse()`

##### Creates a signal that negates the current value

The `.inverse()` method creates a new signal that contains the logical opposite of the current signal's value. Think of it like a toggle switch - when the original is true, the inverse is false.

### Example 1: Eli's Feature Toggle

```typescript
import { createSignal } from "@inspatial/kit/signal";

const eliDarkMode = createSignal(false);
const eliLightMode = eliDarkMode.inverse();

console.log(eliDarkMode.value); // false
console.log(eliLightMode.value); // true

eliDarkMode.value = true;
console.log(eliDarkMode.value); // true
console.log(eliLightMode.value); // false (automatically updated)
```

#### `.and(value)`, `.or(value)`

##### Basic logical AND and OR operations

The `.and()` and `.or()` methods create signals that perform logical operations with other values. Think of them like smart logical gates that update automatically.

### Example 1: Mike's Permission System

```typescript
import { createSignal } from "@inspatial/kit/signal";

const mikeIsLoggedIn = createSignal(true);
const mikeIsAdmin = createSignal(false);
const mikeIsPremium = createSignal(true);

// Mike can edit if he's logged in AND is an admin
const canEdit = mikeIsLoggedIn.and(mikeIsAdmin);
console.log(canEdit.value); // false (logged in but not admin)

// Mike can view premium content if logged in OR is premium
const canViewPremium = mikeIsLoggedIn.or(mikeIsPremium);
console.log(canViewPremium.value); // true (is logged in)

// When Mike becomes admin
mikeIsAdmin.value = true;
console.log(canEdit.value); // true (now logged in AND admin)
```

#### `.andNot(value)`, `.orNot(value)`

##### Logical operations with negated second operand

These methods perform logical operations where the second value is negated. Think of them like "and not" or "or not" conditions.

### Example 1: Charlotte's Game State Logic

```typescript
import { createSignal } from "@inspatial/kit/signal";

const charlotteIsAlive = createSignal(true);
const charlotteIsInvulnerable = createSignal(false);
const charlotteIsMoving = createSignal(true);

// Charlotte can take damage if alive AND NOT invulnerable
const canTakeDamage = charlotteIsAlive.andNot(charlotteIsInvulnerable);
console.log(canTakeDamage.value); // true (alive and not invulnerable)

// Charlotte shows idle animation if moving OR NOT alive
const showIdleAnimation = charlotteIsMoving.orNot(charlotteIsAlive);
console.log(showIdleAnimation.value); // true (is moving)

charlotteIsInvulnerable.value = true;
console.log(canTakeDamage.value); // false (now invulnerable)
```

#### Comparison Operations

#### `.eq(value)`, `.neq(value)`

##### Equality and inequality comparisons

The `.eq()` and `.neq()` methods create signals that compare values for equality. Think of them like smart comparison operators that stay up-to-date.

### Example 1: Ben's Score Tracking

```typescript
import { createSignal } from "@inspatial/kit/signal";

const benScore = createSignal(100);
const targetScore = createSignal(150);

const hasReachedTarget = benScore.eq(targetScore);
const needsMorePoints = benScore.neq(targetScore);

console.log(hasReachedTarget.value); // false (100 ≠ 150)
console.log(needsMorePoints.value); // true (100 ≠ 150)

benScore.value = 150;
console.log(hasReachedTarget.value); // true (150 = 150)
console.log(needsMorePoints.value); // false (150 = 150)
```

#### `.gt(value)`, `.lt(value)`, `.gte(value)`, `.lte(value)`

##### Numeric comparison operations

These methods create signals that perform numeric comparisons. Think of them like smart comparison operators for numbers.

### Example 1: Eli's Health Monitor

```typescript
import { createSignal } from "@inspatial/kit/signal";

const eliHealth = createSignal(75);

const isHealthy = eliHealth.gt(50); // > 50
const isCritical = eliHealth.lt(25); // < 25
const canHeal = eliHealth.lte(90); // <= 90
const isFullHealth = eliHealth.gte(100); // >= 100

console.log(isHealthy.value); // true (75 > 50)
console.log(isCritical.value); // false (75 < 25 is false)
console.log(canHeal.value); // true (75 <= 90)
console.log(isFullHealth.value); // false (75 >= 100 is false)

// When Eli takes damage
eliHealth.value = 20;
console.log(isHealthy.value); // false (20 > 50 is false)
console.log(isCritical.value); // true (20 < 25)
```

#### Boolean and Type Checks

#### `.isTruthy()`, `.isFalsy()`

##### Boolean truthiness checks

These methods create signals that check the truthiness of values. Think of them like smart boolean converters.

### Example 1: Mike's Input Validation

```typescript
import { createSignal } from "@inspatial/kit/signal";

const mikeInput = createSignal("");
const mikeScore = createSignal(0);

const hasInput = mikeInput.isTruthy();
const isEmpty = mikeInput.isFalsy();
const hasScore = mikeScore.isTruthy();

console.log(hasInput.value); // false (empty string is falsy)
console.log(isEmpty.value); // true (empty string is falsy)
console.log(hasScore.value); // false (0 is falsy)

mikeInput.value = "Hello";
mikeScore.value = 100;

console.log(hasInput.value); // true ("Hello" is truthy)
console.log(hasScore.value); // true (100 is truthy)
```

#### `.isNull()`, `.isUndefined()`, `.isNullish()`, `.isDefined()`

##### Type checking operations

These methods create signals that check for specific types or null/undefined values.

### Example 1: Charlotte's Data Validation

```typescript
import { createSignal } from "@inspatial/kit/signal";

const charlotteData = createSignal(null);

const isNull = charlotteData.isNull();
const isUndefined = charlotteData.isUndefined();
const isNullish = charlotteData.isNullish();
const isDefined = charlotteData.isDefined();

console.log(isNull.value); // true
console.log(isUndefined.value); // false
console.log(isNullish.value); // true (null is nullish)
console.log(isDefined.value); // false (null is not defined)

charlotteData.value = "Charlotte";
console.log(isNull.value); // false
console.log(isNullish.value); // false
console.log(isDefined.value); // true
```

#### Range and Collection Operations

#### `.between(min, max)`, `.outside(min, max)`

##### Range checking operations

These methods create signals that check if a value falls within or outside a range.

### Example 1: Ben's Temperature Monitor

```typescript
import { createSignal } from "@inspatial/kit/signal";

const benRoomTemp = createSignal(22);

const isComfortable = benRoomTemp.between(18, 25); // 18 <= temp <= 25
const needsAdjustment = benRoomTemp.outside(18, 25); // temp < 18 || temp > 25

console.log(isComfortable.value); // true (22 is between 18 and 25)
console.log(needsAdjustment.value); // false (22 is not outside the range)

benRoomTemp.value = 30;
console.log(isComfortable.value); // false (30 is not between 18 and 25)
console.log(needsAdjustment.value); // true (30 is outside the range)
```

#### `.isEmpty()`, `.isNotEmpty()`, `.includes(item)`, `.excludes(item)`

##### Array and string operations

These methods work with signals containing arrays or strings, providing reactive collection operations.

### Example 1: Eli's Shopping List Manager

```typescript
import { createSignal } from "@inspatial/kit/signal";

const eliShoppingList = createSignal(["bread", "milk"]);
const eliSearchTerm = createSignal("bread");

const listIsEmpty = eliShoppingList.isEmpty();
const hasItems = eliShoppingList.isNotEmpty();
const hasSearchItem = eliShoppingList.includes(eliSearchTerm);
const missingSearchItem = eliShoppingList.excludes(eliSearchTerm);

console.log(listIsEmpty.value); // false (has 2 items)
console.log(hasItems.value); // true (has items)
console.log(hasSearchItem.value); // true (includes "bread")
console.log(missingSearchItem.value); // false (doesn't exclude "bread")

eliShoppingList.value = [];
console.log(listIsEmpty.value); // true (now empty)
console.log(hasItems.value); // false (no items)
```

### Utility Functions

#### `read(value)`

##### Safely reads any value, whether it's a signal or not

The `read` function is a universal value reader that works with both signals and regular values. Think of it like a smart reader that knows how to handle different types of data containers.

### Example 1: Mike's Mixed Data Reader

```typescript
import { createSignal, read } from "@inspatial/kit/signal";

const mikeSignalScore = createSignal(100);
const mikeRegularScore = 85;

// read() works with both signals and regular values
const signalValue = read(mikeSignalScore); // 100 (from signal)
const regularValue = read(mikeRegularScore); // 85 (regular value)

console.log(signalValue); // 100
console.log(regularValue); // 85
```

#### `peek(value)`

##### Reads a value without creating reactive dependencies

The `peek` function reads a signal's value without subscribing to changes. Think of it like taking a quick look without committing to watch.

### Example 1: Charlotte's Non-Reactive Check

```typescript
import { createSignal, peek, watch } from "@inspatial/kit/signal";

const charlotteHealth = createSignal(100);
const charlotteMana = createSignal(50);

// Effect that only depends on health, not mana
watch(() => {
  const health = charlotteHealth.get(); // Creates dependency
  const mana = peek(charlotteMana); // No dependency created

  console.log(`Health: ${health}, Mana: ${mana}`);
});

charlotteMana.value = 75; // Effect doesn't run (no dependency)
charlotteHealth.value = 90; // Effect runs: "Health: 90, Mana: 75"
```

#### `write(signal, newValue)`

##### Safely writes to a signal with function support

The `write` function updates a signal's value and supports both direct values and updater functions. Think of it like a smart setter that can handle different types of updates.

### Example 1: Ben's Score Updater

```typescript
import { createSignal, write } from "@inspatial/kit/signal";

const benScore = createSignal(100);

// Direct value update
write(benScore, 150);
console.log(benScore.value); // 150

// Function-based update
write(benScore, (currentScore) => currentScore + 25);
console.log(benScore.value); // 175

// Works with non-signals too (returns the computed value)
const regularScore = 200;
const newScore = write(regularScore, (score) => score + 10);
console.log(newScore); // 210
```

#### `readAll(...values)`

##### Reads multiple values at once

The `readAll` function reads multiple signals or values simultaneously and returns an array of their unwrapped values. Think of it like batch reading multiple data sources at once.

### Example 1: Eli's Dashboard Data

```typescript
import { createSignal, readAll } from "@inspatial/kit/signal";

const eliScore = createSignal(100);
const eliLevel = createSignal(5);
const eliName = "Eli Thompson"; // Regular string
const eliHealth = createSignal(85);

// Read all values at once
const [score, level, name, health] = readAll(
  eliScore,
  eliLevel,
  eliName,
  eliHealth
);

console.log(score); // 100 (from signal)
console.log(level); // 5 (from signal)
console.log(name); // "Eli Thompson" (regular value)
console.log(health); // 85 (from signal)
```

#### `poke(signal, newValue)`

##### Silently updates a signal without triggering effects

The `poke` function updates a signal's value quietly, without notifying any connected effects. Think of it like making a stealth update.

### Example 1: Mike's Background Update

```typescript
import { createSignal, poke, watch } from "@inspatial/kit/signal";

const mikeStatus = createSignal("online");

// Watch for status changes
watch(() => {
  console.log(`Mike is ${mikeStatus.value}`);
});
// Logs: "Mike is online"

// Silent update - no effect triggers
poke(mikeStatus, "away");
console.log(mikeStatus.value); // "away" (value changed silently)

// Normal update - effect triggers
mikeStatus.value = "offline"; // Logs: "Mike is offline"
```

#### `touch(...values)`

##### Creates dependencies without reading values

The `touch` function subscribes to signals without reading their values. Think of it like putting your hand on something to feel when it moves, without looking at it.

@returns {void}

### Example 1: Charlotte's Change Detector

```typescript
import { createSignal, touch, watch } from "@inspatial/kit/signal";

const charlotteX = createSignal(10);
const charlotteY = createSignal(20);

// Effect that runs when position changes, but doesn't need the values
watch(() => {
  touch(charlotteX, charlotteY); // Subscribe to both without reading
  console.log("Charlotte's position changed!");
});

charlotteX.value = 15; // Logs: "Charlotte's position changed!"
charlotteY.value = 25; // Logs: "Charlotte's position changed!"
```

### Effect Management

#### `watch(effect)`

##### Creates reactive effects that run when dependencies change

The `watch` function creates an effect that automatically runs whenever its signal dependencies change. Think of it like setting up a smart observer that watches for changes and reacts accordingly.

### Example 1: Ben's Health Monitor

```typescript
import { createSignal, watch } from "@inspatial/kit/signal";

const benHealth = createSignal(100);
const benMana = createSignal(50);

// Create an effect that watches both health and mana
const dispose = watch(() => {
  const health = benHealth.value; // Creates dependency
  const mana = benMana.value; // Creates dependency

  if (health < 25) {
    console.log("Ben's health is critical!");
  }
  if (mana < 10) {
    console.log("Ben is low on mana!");
  }
});

benHealth.value = 20; // Logs: "Ben's health is critical!"
benMana.value = 5; // Logs: "Ben is low on mana!"

// Clean up when done
dispose();
```

#### `connect(signals, effect, runImmediate?)`

##### Connects multiple signals to a single effect

The `connect` function manually connects multiple signals to an effect function. Think of it like subscribing one function to multiple newsletters at once.

@returns {void}

### Example 1: Charlotte's Multi-Signal Monitor

```typescript
import { createSignal, connect } from "@inspatial/kit/signal";

const charlotteX = createSignal(0);
const charlotteY = createSignal(0);
const charlotteZ = createSignal(0);

// Connect all position signals to one effect
connect([charlotteX, charlotteY, charlotteZ], () => {
  console.log(
    `Charlotte is at (${charlotteX.value}, ${charlotteY.value}, ${charlotteZ.value})`
  );
});
// Logs immediately: "Charlotte is at (0, 0, 0)"

charlotteX.value = 10; // Logs: "Charlotte is at (10, 0, 0)"
charlotteY.value = 5; // Logs: "Charlotte is at (10, 5, 0)"
```

#### `bind(handler, value)`

##### Binds a handler function to any type of value

The `bind` function connects a handler to a value, whether it's a signal, function, or static value. Think of it like a universal connector that adapts to different data sources.

@returns {void}

### Example 1: Eli's Flexible Data Binding

```typescript
import { createSignal, bind } from "@inspatial/kit/signal";

const eliScore = createSignal(100);

// Bind a logger to the signal
bind((score) => console.log(`Eli's score: ${score}`), eliScore);

// Also works with functions
bind(
  (time) => console.log(`Current time: ${time}`),
  () => new Date().toLocaleTimeString()
);

// And with static values
bind((name) => console.log(`Player name: ${name}`), "Eli");

eliScore.value = 150; // Logs: "Eli's score: 150"
```

#### `listen(signals, callback)`

##### Listens to multiple signals with a single callback

The `listen` function sets up a callback that triggers when any of the provided signals change. Think of it like having one alarm that goes off when any of several things happen.

@returns {void}

### Example 1: Mike's System Monitor

```typescript
import { createSignal, listen } from "@inspatial/kit/signal";

const mikeCPU = createSignal(25);
const mikeMemory = createSignal(60);
const mikeDisk = createSignal(80);

// Listen to all system metrics
listen([mikeCPU, mikeMemory, mikeDisk], () => {
  console.log("System metrics updated!");
  console.log(
    `CPU: ${mikeCPU.value}%, Memory: ${mikeMemory.value}%, Disk: ${mikeDisk.value}%`
  );
});

mikeCPU.value = 45; // Logs system update
mikeMemory.value = 70; // Logs system update
```

### Advanced Signal Operations

#### `merge(signals, handler)`

##### Combines multiple signals into a computed result

The `merge` function creates a computed signal that combines the values of multiple signals using a handler function. Think of it like a smart mixer that blends multiple ingredients into one result.

### Example 1: Ben's Profile Merger

```typescript
import { createSignal, merge } from "@inspatial/kit/signal";

const benFirstName = createSignal("Ben");
const benLastName = createSignal("Parker");
const benAge = createSignal(25);

// Merge multiple signals into a profile display
const benProfile = merge(
  [benFirstName, benLastName, benAge],
  (first, last, age) => `${first} ${last} (${age} years old)`
);

console.log(benProfile.value); // "Ben Parker (25 years old)"

benAge.value = 26;
console.log(benProfile.value); // "Ben Parker (26 years old)"
```

#### `tpl(strings, ...expressions)`

##### Creates reactive template strings

The `tpl` function creates a computed signal that builds template strings from signals and static values. Think of it like a smart template that updates whenever its variables change.

### Example 1: Charlotte's Dynamic Message

```typescript
import { createSignal, tpl } from "@inspatial/kit/signal";

const charlotteName = createSignal("Charlotte");
const charlotteScore = createSignal(150);
const charlotteLevel = createSignal(5);

// Create a reactive template string
const charlotteMessage = tpl`Hello ${charlotteName}! You have ${charlotteScore} points at level ${charlotteLevel}.`;

console.log(charlotteMessage.value);
// "Hello Charlotte! You have 150 points at level 5."

charlotteScore.value = 200;
console.log(charlotteMessage.value);
// "Hello Charlotte! You have 200 points at level 5."
```

#### `not(value)`

##### Creates a signal that negates any value

The `not` function creates a computed signal that negates the input value. Think of it like a universal "opposite" converter that works with any value.

### Example 1: Eli's Boolean Logic

```typescript
import { createSignal, not } from "@inspatial/kit/signal";

const eliIsOnline = createSignal(true);
const eliIsOffline = not(eliIsOnline);

console.log(eliIsOffline.value); // false (not true)

eliIsOnline.value = false;
console.log(eliIsOffline.value); // true (not false)

// Also works with static values
const alwaysFalse = not(true);
console.log(alwaysFalse.value); // false
```

#### `derive(signal, key, compute?)`

##### Creates a derived signal from an object property

The `derive` function creates a signal that automatically tracks a specific property of an object signal. Think of it like creating a focused view of one piece of a larger data structure.

### Example 1: Mike's User Profile Property

```typescript
import { createSignal, derive } from "@inspatial/kit/signal";

const mikeUser = createSignal({
  name: "Mike Anderson",
  email: "mike@inspatial.io",
  score: 100,
  level: 3,
});

// Derive specific properties
const mikeName = derive(mikeUser, "name");
const mikeScore = derive(mikeUser, "score");

console.log(mikeName.value); // "Mike Anderson"
console.log(mikeScore.value); // 100

// When the user object changes
mikeUser.value = { ...mikeUser.value, name: "Mike Smith", score: 150 };
console.log(mikeName.value); // "Mike Smith" (automatically updated)
console.log(mikeScore.value); // 150 (automatically updated)
```

#### `extract(signal, ...keys)`

##### Extracts multiple properties into separate signals

The `extract` function creates multiple signals from an object signal's properties. Think of it like unpacking a suitcase - you get separate containers for each item.

@returns {{ [P in K]: Signal<T[P]> }} Object with extracted property signals

### Example 1: Charlotte's Player Stats

```typescript
import { createSignal, extract } from "@inspatial/kit/signal";

const charlottePlayer = createSignal({
  name: "Charlotte",
  health: 100,
  mana: 50,
  level: 8,
  experience: 2400,
});

// Extract multiple properties at once
const { name, health, mana, level } = extract(
  charlottePlayer,
  "name",
  "health",
  "mana",
  "level"
);

console.log(name.value); // "Charlotte"
console.log(health.value); // 100
console.log(mana.value); // 50
console.log(level.value); // 8

// When player data changes, all extracted signals update
charlottePlayer.value = { ...charlottePlayer.value, health: 85, mana: 30 };
console.log(health.value); // 85
console.log(mana.value); // 30
```

#### `derivedExtract(signal, ...keys)`

##### Creates derived signals for multiple properties

The `derivedExtract` function is similar to `extract` but creates derived signals that can track nested signal properties. Think of it like creating smart pointers to specific parts of complex data.

@returns {{ [P in K]: Signal<T[P]> }} Object with derived property signals

### Example 1: Ben's Nested Data Structure

```typescript
import { createSignal, derivedExtract } from "@inspatial/kit/signal";

const benData = createSignal({
  profile: createSignal({ name: "Ben", age: 25 }),
  stats: createSignal({ score: 1000, level: 10 }),
  settings: { theme: "dark", notifications: true },
});

// Extract with derived behavior for nested signals
const { profile, stats } = derivedExtract(benData, "profile", "stats");

console.log(profile.value.name); // "Ben"
console.log(stats.value.score); // 1000
```

#### `makeReactive(object)`

##### Creates a reactive proxy of an object

The `makeReactive` function creates a proxy object where signal properties can be accessed directly as if they were regular properties. Think of it like creating a smart wrapper that hides the signal complexity.

### Example 1: Eli's Reactive Game State

```typescript
import { createSignal, makeReactive } from "@inspatial/kit/signal";

const eliGameState = makeReactive({
  score: createSignal(0),
  level: createSignal(1),
  playerName: "Eli", // Regular property
  isPlaying: createSignal(false),
});

// Access signals as if they were regular properties
console.log(eliGameState.score); // 0 (automatically gets signal value)
console.log(eliGameState.playerName); // "Eli" (regular property)

// Set values directly
eliGameState.score = 100; // Automatically sets signal value
eliGameState.isPlaying = true; // Automatically sets signal value

console.log(eliGameState.score); // 100
console.log(eliGameState.isPlaying); // true
```

### Conditional Logic

#### `onCondition(signal, compute?)`

##### Creates conditional pattern matching for signal values

The `onCondition` function creates a pattern matcher that can efficiently test signal values against multiple conditions. Think of it like a smart switch statement that creates reactive boolean signals for each condition.

### Example 1: Mike's Game State Matcher

```typescript
import { createSignal, onCondition } from "@inspatial/kit/signal";

const mikeGameState = createSignal("menu");
const stateMatch = onCondition(mikeGameState);

// Create condition signals
const isInMenu = stateMatch("menu");
const isPlaying = stateMatch("playing");
const isPaused = stateMatch("paused");
const isGameOver = stateMatch("game-over");

console.log(isInMenu.value); // true (current state is "menu")
console.log(isPlaying.value); // false
console.log(isPaused.value); // false

// When game state changes, all conditions update automatically
mikeGameState.value = "playing";
console.log(isInMenu.value); // false
console.log(isPlaying.value); // true
```

### Lifecycle Management

#### `onDispose(callback)`

##### Registers cleanup callbacks for automatic disposal

The `onDispose` function registers a cleanup callback that will be called when the current effect scope is disposed. Think of it like registering a cleanup crew that automatically runs when you're done.

### Example 1: Charlotte's Resource Cleanup

```typescript
import { createSignal, watch, onDispose } from "@inspatial/kit/signal";

const charlotteIsActive = createSignal(true);

const dispose = watch(() => {
  if (charlotteIsActive.value) {
    const timer = setInterval(() => {
      console.log("Charlotte is active");
    }, 1000);

    // Register cleanup when effect is disposed
    onDispose(() => {
      console.log("Cleaning up Charlotte's timer");
      clearInterval(timer);
    });
  }
});

// Later, clean up the effect
dispose(); // Logs: "Cleaning up Charlotte's timer"
```

#### `createEffect(effect, ...args)`

##### Creates self-managing effects with automatic cleanup

The `createEffect` function creates an effect that runs automatically and handles its own cleanup. Think of it like a smart worker that knows how to clean up after itself.

### Example 1: Ben's Auto-Cleanup Timer

```typescript
import { createSignal, createEffect } from "@inspatial/kit/signal";

const benInterval = createSignal(1000);

// Create an effect with automatic cleanup
const cancelEffect = createEffect(() => {
  console.log(`Setting up timer with ${benInterval.value}ms interval`);

  const timer = setInterval(() => {
    console.log("Timer tick");
  }, benInterval.value);

  // Return cleanup function
  return () => {
    console.log("Cleaning up timer");
    clearInterval(timer);
  };
});

// When interval changes, old timer is cleaned up and new one starts
benInterval.value = 2000;
// Logs: "Cleaning up timer"
// Logs: "Setting up timer with 2000ms interval"

// Manual cleanup
cancelEffect();
```

### Control Flow

#### `untrack(fn)`

##### Runs code without creating reactive dependencies

The `untrack` function runs a function without tracking any signal dependencies. Think of it like putting on invisibility glasses - you can see the signals but they can't see you.

### Example 1: Eli's Non-Reactive Calculation

```typescript
import { createSignal, watch, untrack } from "@inspatial/kit/signal";

const eliScore = createSignal(100);
const eliBonus = createSignal(50);

// Effect that only depends on score, not bonus
watch(() => {
  const score = eliScore.value; // Creates dependency

  // Read bonus without creating dependency
  const bonus = untrack(() => eliBonus.value);

  console.log(`Score: ${score}, Bonus: ${bonus}`);
});

eliBonus.value = 75; // Effect doesn't run (no dependency)
eliScore.value = 150; // Effect runs: "Score: 150, Bonus: 75"
```

#### `freeze(fn)`

##### Captures the current effect context for later use

The `freeze` function captures the current effect context and returns a function that will run with that frozen context. Think of it like taking a snapshot of the current reactive environment.

### Example 1: Mike's Frozen Context

```typescript
import { createSignal, watch, freeze } from "@inspatial/kit/signal";

const mikeData = createSignal("initial");

watch(() => {
  // Freeze a function with the current context
  const frozenLogger = freeze((message) => {
    console.log(`Frozen context: ${message}`);
  });

  // Use the frozen function later
  setTimeout(() => {
    frozenLogger("This runs with the original context");
  }, 1000);
});
```

### Scheduling

#### `tick()`

##### Triggers the signal update scheduler

The `tick` function manually triggers the signal scheduler to process all pending updates. Think of it like hitting a "process now" button for all waiting signal changes.

### Example 1: Charlotte's Manual Update Trigger

```typescript
import { createSignal, tick } from "@inspatial/kit/signal";

const charlotteScore = createSignal(0);

// Manually trigger updates
charlotteScore.value = 100;
tick().then(() => {
  console.log("All updates processed");
});
```

#### `nextTick(callback, ...args)`

##### Waits for the next update cycle before executing code

The `nextTick` function waits for all pending signal updates and effects to complete, then executes your callback. Think of it like waiting for all the dust to settle before taking action.

### Example 1: Ben's Update Synchronization

```typescript
import { createSignal, computed, nextTick } from "@inspatial/kit/signal";

const benScore = createSignal(0);
const benDoubled = computed(() => benScore.value * 2);

benScore.value = 50;

// Without nextTick - might see old computed value
console.log(benDoubled.value); // Might be 0 (old value)

// With nextTick - guaranteed to see updated value
nextTick(() => {
  console.log(benDoubled.value); // Will be 100 (updated value)
});

// With arguments
nextTick(
  (prefix, signal) => {
    console.log(`${prefix}: ${signal.value}`);
  },
  "Ben's doubled score",
  benDoubled
);

// Can also be used with async/await
await nextTick(() => {
  console.log("All Ben's updates processed");
});
```

### Special Signal Behaviors

Signals have some special behaviors when used in certain contexts, thanks to built-in `toJSON`, `Symbol.toPrimitive`, and `Symbol.iterator` implementations.

#### JSON Serialization

##### Automatic value extraction in JSON.stringify

When a signal is used with `JSON.stringify`, it automatically returns its value by calling `.get()`. Think of it like signals being transparent to JSON serialization.

### Example 1: Charlotte's Data Export

```typescript
import { createSignal } from "@inspatial/kit/signal";

const charlotteProfile = createSignal({
  name: "Charlotte",
  score: 1500,
  level: 12,
});

const exportData = {
  player: charlotteProfile,
  timestamp: Date.now(),
};

// Signal automatically provides its value during JSON serialization
const jsonString = JSON.stringify(exportData);
console.log(jsonString);
// '{"player":{"name":"Charlotte","score":1500,"level":12},"timestamp":...}'
```

#### Primitive Coercion

##### Automatic type conversion in operations

Signals can be automatically coerced to primitives in mathematical and string operations. Think of it like signals becoming transparent when used in calculations.

### Example 1: Ben's Math Operations

```typescript
import { createSignal } from "@inspatial/kit/signal";

const benScore = createSignal(100);
const benMultiplier = createSignal(2.5);

// Automatic coercion in math operations
console.log(benScore + 50); // 150 (number coercion)
console.log(benScore * benMultiplier); // 250 (both signals coerced)

// String coercion
console.log(`Ben's score: ${benScore}`); // "Ben's score: 100"

// Boolean coercion
if (benScore) {
  console.log("Ben has a score!"); // Runs if score is truthy
}
```

#### Iteration Support

##### Direct iteration over signal contents

If a signal contains an iterable (like an array), it can be used directly in `for...of` loops or with spread syntax. Think of it like the signal becoming invisible, leaving just its contents.

### Example 1: Eli's Item Collection

```typescript
import { createSignal } from "@inspatial/kit/signal";

const eliInventory = createSignal(["sword", "shield", "potion"]);

// Direct iteration over signal contents
for (const item of eliInventory) {
  console.log(`Eli has: ${item}`);
}
// Logs: "Eli has: sword"
// Logs: "Eli has: shield"
// Logs: "Eli has: potion"

// Spread syntax works too
const allItems = [...eliInventory]; // ["sword", "shield", "potion"]
const withNewItem = [...eliInventory, "bow"]; // ["sword", "shield", "potion", "bow"]
```

## 📝 Best Practices

1. **Use computed signals for derived data instead of manual updates**:

   ```typescript
   // ✅ Good: Automatic updates
   const fullName = computed(() => `${firstName.value} ${lastName.value}`);

   // ❌ Avoid: Manual synchronization
   let fullName = "";
   watch(() => {
     fullName = `${firstName.value} ${lastName.value}`;
   });
   ```

2. **Always dispose of effects when they're no longer needed**:

   ```typescript
   const dispose = watch(() => {
     // effect logic
   });

   // Clean up when component unmounts or scope ends
   dispose();
   ```

3. **Use `peek()` to read values without creating dependencies**:

   ```typescript
   // ✅ Good: No dependency created
   const currentValue = mySignal.peek();

   // ❌ Creates unnecessary dependency
   const currentValue = mySignal.value;
   ```

4. **Leverage automatic batching for multiple updates**:

   ```typescript
   // ✅ Good: Updates are automatically batched
   firstName.value = "Mike";
   lastName.value = "Anderson";
   age.value = 30;
   // All dependent effects run only once with final values
   ```

5. **Use `untrack()` for operations that shouldn't be reactive**:
   ```typescript
   const result = untrack(() => {
     // These reads won't create dependencies
     return someSignal.value + otherSignal.value;
   });
   ```

## 🎯 Complete Examples

### Example 1: Ben's Game Score System

```typescript
import { createSignal, computed, watch } from "@inspatial/kit/signal";

// Ben's game state
const benScore = createSignal(0);
const benLevel = createSignal(1);
const benExperience = createSignal(0);

// Computed values that update automatically
const experienceNeeded = computed(() => benLevel.value * 100);
const canLevelUp = computed(
  () => benExperience.value >= experienceNeeded.value
);
const scoreDisplay = computed(
  () => `Score: ${benScore.value} (Level ${benLevel.value})`
);

// Effect that handles level ups
watch(() => {
  if (canLevelUp.value) {
    console.log(`Ben can level up! Current XP: ${benExperience.value}`);
  }
});

// Simulate gameplay
benScore.value = 150;
benExperience.value = 120;
console.log(scoreDisplay.value); // "Score: 150 (Level 1)"
console.log(canLevelUp.value); // true (120 >= 100)
```

### Example 2: Charlotte's Shopping Cart

```typescript
import { createSignal, computed, watch } from "@inspatial/kit/signal";

// Charlotte's shopping cart
const charlotteCart = createSignal([
  { id: 1, name: "Laptop", price: 999, quantity: 1 },
  { id: 2, name: "Mouse", price: 25, quantity: 2 },
]);

const charlotteTaxRate = createSignal(0.08); // 8% tax

// Computed cart totals
const subtotal = computed(() =>
  charlotteCart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

const tax = computed(() => subtotal.value * charlotteTaxRate.value);
const total = computed(() => subtotal.value + tax.value);

// Watch for cart changes
watch(() => {
  console.log(`Charlotte's cart: $${total.value.toFixed(2)} total`);
});

// Add item to cart
function addItem(item) {
  charlotteCart.value = [...charlotteCart.value, item];
}

// Update quantity
function updateQuantity(id, quantity) {
  charlotteCart.value = charlotteCart.value.map((item) =>
    item.id === id ? { ...item, quantity } : item
  );
}

// Test the cart
addItem({ id: 3, name: "Keyboard", price: 75, quantity: 1 });
updateQuantity(2, 3); // Change mouse quantity to 3
```

## 🔧 TypeScript Support

Signals provide full TypeScript support with automatic type inference and generic constraints:

```typescript
import { createSignal, computed, Signal } from "@inspatial/kit/signal";

// Explicit typing
const eliScore: Signal<number> = createSignal(0);

// Automatic type inference
const mikeName = createSignal("Mike"); // Signal<string>
const charlotteActive = createSignal(true); // Signal<boolean>

// Complex types
interface Player {
  name: string;
  level: number;
  inventory: string[];
}

const benPlayer = createSignal<Player>({
  name: "Ben",
  level: 5,
  inventory: ["sword", "potion"],
});

// Computed with inferred types
const playerSummary = computed(
  () => `${benPlayer.value.name} (Level ${benPlayer.value.level})`
); // Signal<string>
```

### 📝 Uncommon Knowledge

> **Signals are fundamentally about time, not just state.** Most developers think of signals as reactive variables, but they're actually time-traveling containers that let your present code react to future changes. This temporal aspect is why batching and async scheduling exist - signals operate in the dimension of time, not just data.

### 🔧 Runtime Support

- ✅ Node.js
- ✅ Deno
- ✅ Bun
- ✅ Modern Browsers (ES2020+)
