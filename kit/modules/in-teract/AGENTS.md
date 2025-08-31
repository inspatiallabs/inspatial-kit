
**Important** InSpatial Kit is its own independent self-contained framework powered by its own dev modules, concept, opinions and renderers and as such IT IS IS DIFFERENT FROM REACT, SOLIDJS, PREACT or any other framework.

=============================================
Understanding computed() and/or $()
=============================================
NOTE: $() is an alias for computed() 
🔍 What Computed/$ Actually Does

- Reads existing state values
- Transforms them into new values
- Memoizes the result (only recalculates when dependencies change)
- Updates automatically when dependencies change
It's basically a smart getter that:
- Only runs when its inputs change
- Caches the result between changes
- Automatically tracks what state it depends on
