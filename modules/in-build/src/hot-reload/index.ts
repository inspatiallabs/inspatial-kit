/* Copyright Yukino Song, SudoMaker Ltd.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding
 * copyright ownership. The ASF licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * Source: https://github.com/SudoMaker/rEFui/blob/main/src/hmr.js
 */

/* -----------------------------------------------------------------------------
 * Modifications by InSpatial Labs
 * SPDX-License-Identifier: Apache-2.0
 * © 2026 InSpatial Labs. Portions © 2025 Yukino Song, SudoMaker Ltd.
 *
 * Description: Hot Reload (InSpatial Hot Reload) – refactors and extensions.
 * Version: v0.7.0
 * Project: https://inspatial.dev
 * --------------------------------------------------------------------------- */

import { createSignal } from "@in/teract/signal";
import { isPrimitive, env } from "@in/vader";
import type {
  ExtendedImportMeta,
  HotReloadOptions,
  HotModuleData,
  SetupOptions,
  WrappedFunction,
} from "./type.ts";
import { KEY_HOTWRAP, KEY_HOTWRAPPED } from "./const.ts";

/*##################################(HOT RELOAD ENABLER)##################################*/
export const hotReloadEnabler =
  !env.isProduction() &&
  (!!(/* @inspatial webpack */ (import.meta as ExtendedImportMeta).hot) ||
    // Enable when served by InSpatial dev server HMR client
    (globalThis as any).__inspatialHMR === true);

const toString = Object.prototype.toString;

// Determine if an exported value has materially changed
function didExportChange(origVal: any, newVal: any): boolean {
  return (
    toString.call(origVal) !== toString.call(newVal) ||
    String(origVal) !== String(newVal)
  );
}

// Bind a stable hot reloader around a function export
function bindHotReloader(fn: any): any {
  if (typeof fn !== "function") {
    return fn;
  }
  const wrapped = fn.bind(null);
  (wrapped as WrappedFunction)[KEY_HOTWRAPPED] = true;
  return wrapped;
}

// Create a hot-marked component wrapper with a stable indirection target
// deno-lint-ignore ban-types
function markHotComponent(fn: Function): any {
  const wrapped = createSignal(fn as any, bindHotReloader) as any;
  Object.defineProperty(fn, KEY_HOTWRAP, {
    value: wrapped,
    enumerable: false,
  });
  wrapped.name = fn.name;
  wrapped.hot = false;
  return wrapped;
}

function handleError(
  err: Error,
  _: any,
  { name, hot }: { name: string; hot: boolean }
): void {
  if (hot) {
    console.error(
      `[InSpatial HMR] Render error in <${name}> during update:`,
      err
    );
  } else {
    throw err;
  }
}

export function enableHotReload({
  builtins,
  makeDyn,
  Component,
  createComponentRaw,
}: HotReloadOptions) {
  // Use the global debug instance for HOT logging
  const globalDebug = (globalThis as any).debug;
  if (globalDebug?.info) {
    globalDebug.info("hot", "[InSpatial Hot Reload] Enabled");
  } else {
    console.info("[InSpatial Hot Reload] Enabled.");
  }
  return function (tpl: any, props?: any, ...children: any[]): any {
    let hotLevel = 0;

    if (typeof tpl === "function" && !builtins.has(tpl)) {
      const wrappedFn = tpl as WrappedFunction;
      if (wrappedFn[KEY_HOTWRAP]) {
        tpl = wrappedFn[KEY_HOTWRAP];
        hotLevel = 2;
      } else if (!wrappedFn[KEY_HOTWRAPPED]) {
        tpl = markHotComponent(tpl);
        hotLevel = 1;
      }
    }

    if (hotLevel) {
      return new Component(makeDyn(tpl, handleError), props ?? {}, ...children);
    }

    return createComponentRaw(tpl, props, ...children);
  };
}

// Apply an in-place hot update by reconciling exports
async function applyHotUpdate(
  this: any,
  newModule: Promise<any>,
  invalidate: (reason: string) => void
): Promise<void> {
  const resolvedNewModule = await newModule;
  if (!resolvedNewModule) {
    return;
  }
  const oldModule = Object.entries(await this);
  // deno-lint-ignore prefer-const
  for (let [key, origVal] of oldModule) {
    const newVal = resolvedNewModule[key];

    if (
      typeof origVal === "function" &&
      typeof newVal === "function" &&
      (key === "default" || key[0].toUpperCase() === key[0])
    ) {
      let wrapped = (origVal as WrappedFunction)[KEY_HOTWRAP];
      if (wrapped) {
        wrapped.hot = true;
      } else {
        wrapped = markHotComponent(origVal as Function);
      }
      if (typeof newVal === "function") {
        Object.defineProperty(newVal, KEY_HOTWRAP, {
          value: wrapped,
          enumerable: false,
        });
      }
      wrapped.value = newVal;
    } else {
      let invalid = false;

      if ((isPrimitive(origVal) || isPrimitive(newVal)) && origVal !== newVal) {
        invalid = true;
      } else {
        invalid = didExportChange(origVal, newVal);
        if (!invalid) {
          console.warn(
            `[InSpatial Hot Reload] No effective change detected for export "${key}". If the UI didn't update as expected, try a manual refresh.`
          );
        }
      }

      if (invalid) {
        invalidate(
          `[InSpatial Hot Reload] Export "${key}" changed outside hot boundaries. Requesting a full reload.`
        );
      }
    }
  }
}

function onDispose(this: any, data: HotModuleData): void {
  data[KEY_HOTWRAP] = this;
}

export function setup({
  data,
  current,
  accept,
  dispose,
  invalidate,
}: SetupOptions): void {
  if (data?.[KEY_HOTWRAP]) {
    applyHotUpdate.call(data[KEY_HOTWRAP], current, invalidate);
  }
  dispose(onDispose.bind(current));
  accept();
}
