import { createSignal, type Signal, nextTick } from "@in/teract/signal";
import { createState } from "@in/teract/state";
import { coerceEventValue, slugify, toFormPath } from "./helpers.ts";
import type {
  ControllerSettingsProps,
  ControllerConfig,
  FormPath,
  ValueAtPath,
  RegisteredField,
  StateLike,
} from "./type.ts";

/*####################################(CREATE CONTROLLER)####################################*/
export function createController<
  TC extends Record<string, any>,
  TT extends Record<string, any>
>(
  cfg: ControllerConfig<TC, TT> & { state: StateLike<TT> }
): ControllerSettingsProps<TC>;
export function createController<TC extends Record<string, any>>(
  cfg: Omit<ControllerConfig<TC, TC>, "state">
): ControllerSettingsProps<TC>;
export function createController<
  TC extends Record<string, any>,
  TT extends Record<string, any> = TC
>(cfg: ControllerConfig<TC, TT>): ControllerSettingsProps<TC> {
  const mode = cfg.mode || (cfg.initialValue ? "form" : "manipulator");
  const usingExternal = !!cfg.state;
  const pathMap = (cfg.map || {}) as Partial<Record<string, string>>;
  const resolvePath = (p: string) => (pathMap as any)[p] || p;
  const inverseMap: Record<string, string> = (() => {
    const inv: Record<string, string> = {};
    for (const k in pathMap) {
      const v = (pathMap as any)[k];
      if (typeof v === "string") inv[v] = k;
    }
    return inv;
  })();

  const initial: any = usingExternal
    ? ({} as TC)
    : ((mode === "form"
        ? cfg.initialValue || {}
        : cfg.initialState || {}) as TC);

  if (Array.isArray(cfg.settings)) {
    for (const s of cfg.settings) {
      const p = (s.path || slugify(s.name)) as string;
      if (s.initialValue !== undefined && initial[p] === undefined)
        (initial as any)[p] = s.initialValue;
    }
  }

  const store = usingExternal
    ? (cfg.state as any)
    : (createState(initial) as any);
  const errors: Record<string, Signal<string | undefined>> = {};
  const touched: Record<string, Signal<boolean>> = {};
  const dirty: Record<string, Signal<boolean>> = {};
  const submitCount = createSignal(0);

  /*******************************(Ensure Field Signals)******************************/
  function ensureFieldSignals(path: string): void {
    if (!errors[path])
      errors[path] = createSignal<string | undefined>(undefined);
    if (!touched[path]) touched[path] = createSignal<boolean>(false);
    if (!dirty[path]) dirty[path] = createSignal<boolean>(false);
  }

  function getValue(obj: any, stringFormPath: string): any {
    if (stringFormPath == null) return obj;
    const parts = toFormPath(stringFormPath);
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p as any];
    }
    return cur;
  }

  /*******************************(Set Path)******************************/
  function setPath(
    obj: any,
    FormPath: string | (string | number)[],
    value: any
  ): any {
    const parts = toFormPath(FormPath);
    let cur = obj;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i] as any;
      if (i === parts.length - 1) {
        cur[p] = value;
      } else {
        if (cur[p] == null) cur[p] = typeof parts[i + 1] === "number" ? [] : {};
        cur = cur[p];
      }
    }
    return obj;
  }

  /*******************************(Validate Field)******************************/
  async function validateField<P extends FormPath<TC>>(
    path: P,
    val?: ValueAtPath<TC, P>
  ): Promise<string | undefined> {
    ensureFieldSignals(path);
    const targetPath = resolvePath(path);
    const value =
      val !== undefined
        ? val
        : getValue(store.snapshot?.() || store, targetPath);

    const s = (cfg.settings || []).find(
      (i: any) => (i.path || slugify(i.name)) === path
    );
    if (s?.validate) {
      const msg = await Promise.resolve(
        s.validate(value, store.snapshot?.() || store)
      );
      errors[path].value = msg as any;
      return msg as any;
    }

    if (cfg.resolver) {
      const r = await Promise.resolve(
        cfg.resolver(store.snapshot?.() || store)
      );
      const e = r.errors || {};
      for (const [k, v] of Object.entries(e)) {
        const ctlKey = inverseMap[k] || k;
        ensureFieldSignals(ctlKey);
        errors[ctlKey].value = v as any;
      }
      const tp = resolvePath(path as any);
      return (e as any)[path as any] ?? (e as any)[tp as any];
    }
    errors[path].value = undefined;
    return undefined;
  }

  /*******************************(Validate Form)******************************/
  async function validateForm(): Promise<Record<string, string | undefined>> {
    const out: Record<string, string | undefined> = {};
    if (cfg.resolver) {
      const r = await Promise.resolve(
        cfg.resolver(store.snapshot?.() || store)
      );
      for (const [k, v] of Object.entries(r.errors || {})) {
        const ctlKey = inverseMap[k] || k;
        ensureFieldSignals(ctlKey);
        errors[ctlKey].value = v as any;
        out[ctlKey] = v as any;
      }
      return out;
    }
    for (const s of cfg.settings || []) {
      const p = (s.path || slugify(s.name)) as string;
      const tp = resolvePath(p);
      if (s.validate) {
        const msg = await Promise.resolve(
          s.validate(
            getValue(store.snapshot?.() || store, tp),
            store.snapshot?.() || store
          )
        );
        ensureFieldSignals(p);
        errors[p].value = msg as any;
        if (msg) out[p] = msg as any;
      }
    }
    return out;
  }

  /*******************************(Set)******************************/
  function set<P extends FormPath<TC>>(
    path: P,
    value: ValueAtPath<TC, P>,
    opts?: { validate?: boolean; touch?: boolean; dirty?: boolean }
  ) {
    ensureFieldSignals(path);
    const targetPath = resolvePath(path);
    const prev = getValue(store.snapshot?.() || store, targetPath);
    const next = value;
    if (usingExternal) {
      // direct write to target signal (top-level only)
      const parts = toFormPath(targetPath);
      if (parts.length === 1 && (store as any)[parts[0]]) {
        (store as any)[parts[0]].value = next as any;
      } else {
        // deep path write: reconstruct shallow snapshot and update top-level
        const snap = store.snapshot?.() || {};
        const updated = setPath({ ...snap }, targetPath, next);
        for (const [k, v] of Object.entries(updated)) {
          if ((store as any)[k] && (store as any)[k].peek() !== v)
            (store as any)[k].value = v as any;
        }
      }
      if (opts?.touch) touched[path].value = true;
      if (opts?.dirty ?? true) dirty[path].value = prev !== next;
    } else {
      store.batch((_s: any) => {
        const snap = store.snapshot();
        const updated = setPath({ ...snap }, targetPath, next);
        for (const [k, v] of Object.entries(updated)) {
          if ((store as any)[k] && (store as any)[k].peek() !== v)
            (store as any)[k].value = v as any;
        }
        if (opts?.touch) touched[path].value = true;
        if (opts?.dirty ?? true) dirty[path].value = prev !== next;
      });
    }

    if (opts?.validate || cfg.validateOn === "all") {
      void validateField(path, next);
    } else if (
      (cfg.validateOn === "change" && mode === "form") ||
      submitCount.peek() > 0
    ) {
      void validateField(path, next);
    }
  }

  /*******************************(Register)******************************/
  function register<P extends FormPath<TC>>(
    path: P,
    _opts?: { validate?: boolean }
  ): RegisteredField<ValueAtPath<TC, P>> {
    ensureFieldSignals(path);
    const targetPath = resolvePath(path);
    const parts = toFormPath(targetPath);
    let valueSig: Signal<any> | undefined = undefined;
    if (parts.length === 1 && (store as any)[parts[0]]) {
      valueSig = (store as any)[parts[0]] as Signal<any>;
    } else if (parts.length > 1 && (store as any)[parts[0]]) {
      const rootSig = (store as any)[parts[0]] as Signal<any>;
      valueSig = createSignal(rootSig, function (root: any): any {
        let cur = root;
        for (let i = 1; i < parts.length; i++) {
          const seg = parts[i] as any;
          cur = cur == null ? undefined : cur[seg];
        }
        return cur;
      }) as Signal<any>;
    } else {
      valueSig = createSignal(
        getValue(store.snapshot?.() || store, targetPath)
      );
    }
    const oninput = (evOrVal: any) => {
      const val = coerceEventValue(evOrVal);
      set(path, val, {
        validate:
          _opts?.validate ||
          cfg.validateOn === "all" ||
          cfg.validateOn === "change",
        touch: true,
        dirty: true,
      });
    };
    const onchange = () => {
      touched[path].value = true;
      if (cfg.validateOn === "blur" || cfg.validateOn === "all")
        void validateField(path);
    };
    const onblur = onchange;
    return {
      name: path,
      value: valueSig as any,
      error: errors[path],
      touched: touched[path],
      isDirty: dirty[path],
      oninput,
      onchange,
      onblur,
    } as unknown as RegisteredField<ValueAtPath<TC, P>>;
  }

  /*******************************(Handle Submit)******************************/
  function handleSubmit(
    success: (values: TC) => void,
    error?: (errors: Record<string, string | undefined>) => void
  ) {
    return async (e?: Event) => {
      e?.preventDefault?.();
      submitCount.value = submitCount.peek() + 1;
      const errs = await validateForm();
      const hasErr = Object.values(errs).some(Boolean);
      if (hasErr) error?.(errs);
      else success((store.snapshot?.() || store) as TC);
      nextTick(() => {});
    };
  }

  /*******************************(Reset)******************************/
  function reset(
    values?: Partial<TC>,
    opts?: { keepDirty?: boolean; keepTouched?: boolean; keepError?: boolean }
  ) {
    const next = { ...(values || {}) } as Partial<TC>;
    store.batch((_s: any) => {
      const snap = store.snapshot();
      const merged = { ...snap, ...next };
      for (const [k, v] of Object.entries(merged)) {
        if ((store as any)[k]) (store as any)[k].value = v as any;
      }
    });
    if (!opts?.keepDirty)
      for (const k of Object.keys(dirty)) dirty[k].value = false;
    if (!opts?.keepTouched)
      for (const k of Object.keys(touched)) touched[k].value = false;
    if (!opts?.keepError)
      for (const k of Object.keys(errors)) errors[k].value = undefined;
    submitCount.value = 0;
  }

  /*******************************(Controller Settings)******************************/
  const ctl: ControllerSettingsProps<TC> = {
    id: cfg.id,
    mode: mode as any,
    state: store as any,
    embedded: usingExternal,
    hasReset: cfg.hasReset ?? true,
    settings: cfg.settings,
    set: set as any,
    register: register as any,
    validateOn: cfg.validateOn,
    validateField,
    validateForm,
    handleSubmit,
    reset,
    _errors: errors,
    _touched: touched,
    _dirty: dirty,
  };

  return ctl;
}

/*####################################(CREATE CONTROLLER IN)####################################*/
export const createControllerIn =
  createController as unknown as typeof createController & {
    in: typeof createController;
  };
(createController as any)["in"] = createController;
export default createController;
