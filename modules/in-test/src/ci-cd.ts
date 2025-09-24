/**
 * CI/CD Environment Utilities for InSpatial
 *
 * Provides specialized utilities for continuous integration and deployment environments.
 *
 * @module ci-cd
 * @since 0.7.0
 */

import { env, detectEnvironment, type EnvironmentInfo } from "@in/vader";

/**
 * Skip a test when running in CI environment
 */
export function skipInCI(reason: string): boolean {
  if (env.isCI()) {
    console.log(`⏭️ Skipping test in CI: ${reason}`);
    return true;
  }
  return false;
}

/**
 * Only run a test when in CI environment
 */
export function onlyInCI(reason: string): boolean {
  if (!env.isCI()) {
    console.log(`⏭️ Skipping test outside CI: ${reason}`);
    return true;
  }
  return false;
}

/**
 * Skip a test in specific environments
 */
export function skipInEnvironments(
  environments: string[],
  reason: string
): boolean {
  const currentEnv = env.getMode();

  if (environments.includes(currentEnv)) {
    console.log(`⏭️ Skipping test in ${currentEnv} environment: ${reason}`);
    return true;
  }
  return false;
}

/**
 * Only run a test in specific environments
 */
export function onlyInEnvironments(
  environments: string[],
  reason: string
): boolean {
  const currentEnv = env.getMode();

  if (!environments.includes(currentEnv)) {
    console.log(
      `⏭️ Skipping test outside allowed environments (${environments.join(
        ", "
      )}): ${reason}`
    );
    return true;
  }
  return false;
}

/**
 * Skip a test on specific platforms
 */
export function skipOnPlatforms(platforms: string[], reason: string): boolean {
  const currentPlatform = detectEnvironment().platform || "unknown";

  if (platforms.includes(currentPlatform)) {
    console.log(`⏭️ Skipping test on ${currentPlatform} platform: ${reason}`);
    return true;
  }
  return false;
}

/**
 * Only run a test on specific platforms
 */
export function onlyOnPlatforms(platforms: string[], reason: string): boolean {
  const currentPlatform = detectEnvironment().platform || "unknown";

  if (!platforms.includes(currentPlatform)) {
    console.log(
      `⏭️ Skipping test on ${currentPlatform} platform, only runs on: ${platforms.join(
        ", "
      )} - ${reason}`
    );
    return true;
  }
  return false;
}

/**
 * Skip a test on specific runtime types
 */
export function skipOnRuntimes(
  runtimes: EnvironmentInfo["type"][],
  reason: string
): boolean {
  const info = detectEnvironment();

  if (runtimes.includes(info.type)) {
    console.log(`⏭️ Skipping test on ${info.type} runtime: ${reason}`);
    return true;
  }
  return false;
}

/**
 * Only run a test on specific runtime types
 */
export function onlyOnRuntimes(
  runtimes: EnvironmentInfo["type"][],
  reason: string
): boolean {
  const info = detectEnvironment();

  if (!runtimes.includes(info.type)) {
    console.log(
      `⏭️ Skipping test on ${info.type} runtime, only runs on: ${runtimes.join(
        ", "
      )} - ${reason}`
    );
    return true;
  }
  return false;
}

/**
 * Skip a test when specific environment variables are missing
 */
export function skipWithoutEnvVars(envVars: string[], reason: string): boolean {
  const missingVars = envVars.filter((varName) => !env.get(varName));

  if (missingVars.length > 0) {
    console.log(
      `⏭️ Skipping test due to missing environment variables: ${missingVars.join(
        ", "
      )} - ${reason}`
    );
    return true;
  }
  return false;
}

/**
 * Skip a test when running in specific CI providers
 */
export function skipInCIProviders(
  providers: string[],
  reason: string
): boolean {
  const currentProvider = env.getCICDProvider();

  for (const provider of providers) {
    if (env.isCICDProvider(provider)) {
      console.log(`⏭️ Skipping test in ${currentProvider}: ${reason}`);
      return true;
    }
  }
  return false;
}

/**
 * Only run a test in specific CI providers
 */
export function onlyInCIProviders(
  providers: string[],
  reason: string
): boolean {
  if (!env.isCI()) {
    console.log(`⏭️ Skipping test outside CI: ${reason}`);
    return true;
  }

  const currentProvider = env.getCICDProvider();

  for (const provider of providers) {
    if (env.isCICDProvider(provider)) {
      return false; // Don't skip, we're in an allowed provider
    }
  }

  console.log(
    `⏭️ Skipping test in ${currentProvider}, only runs in: ${providers.join(
      ", "
    )} - ${reason}`
  );
  return true;
}
