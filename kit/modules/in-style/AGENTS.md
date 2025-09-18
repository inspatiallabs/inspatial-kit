InSpatial variables differ from shadcn: use the variable name in brackets without any suffixes or appended text.

```typescript
// ❌  DON'T DO THIS
<Component className="text-primary-foreground" />
```

```typescript
// ✅ DO THIS
<Component className="text-(--primary)" />
```

---

