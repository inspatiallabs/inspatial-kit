=============================================
Understanding computed() and/or $()
=============================================
NOTE: $() function is the same as computed() only less words
🔍 What Computed/$ Actually Does

- Reads existing state values
- Transforms them into new values
- Memoizes the result (only recalculates when dependencies change)
- Updates automatically when dependencies change
It's basically a smart getter that:
- Only runs when its inputs change
- Caches the result between changes
- Automatically tracks what state it depends on
