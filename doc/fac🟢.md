# Footguns, Anti-Patterns & Conflicts (FAC)

## Anti-Patterns

These are practices that work, but they bend or break the expected mental model of the framework. They don’t necessarily cause harm, and in some cases they can serve as “escape hatches.” The problem is that they disrupt the natural flow and conventions of the system, making things harder to reason about in the long run. In other words, they’re like habits that can easily turn into vices. Having a beer once in a while is fine, but turning it into a daily routine quickly becomes a problem.

## Footguns

These are not just bad habits they’re dangerous. A footgun is something that will blow your leg off if you try to use it. They are inherently unsafe, unpredictable, and should never be considered, even as escape hatches. In other words: don’t do it, EVER!.

## Conflicts

Conflicts happen when two otherwise valid approaches or features clash with one another inside the framework. They may both be correct in isolation, but together they break assumptions, introduce ambiguity, or cause unexpected behavior. Understanding and resolving these conflicts is part of learning the “grammar” of the system.

Because InSpatial is a Universal Development Environment (UDE), many patterns that developers are used to in traditional frameworks naturally turn into conflicts here.

Most of these conflicts stem from three core concepts historically baked into frameworks:

- Styling
- Triggers
- Motion

InSpatial intentionally detaches these systems from the renderer. Why? Because Universal Apps are omni-platform by design. We can’t (and shouldn’t) assume which environment a user is in—web, mobile, XR, or beyond.

By decoupling styling, triggers, and motion from the rendering layer, InSpatial avoids environment-specific assumptions and eliminates the hidden clashes that arise when a single platform’s conventions are forced into a universal context.

**The result:** a conflict-free system that enables truly universal applications.
