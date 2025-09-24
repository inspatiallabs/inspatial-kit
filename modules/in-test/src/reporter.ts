/**
 * Test reporting utilities for generating comprehensive test reports
 *
 * @module reporter
 */

import {
  env,
  escapeHtml as escHtml,
  escapeXml as escXml,
  createOrUpdateTextFile,
} from "@in/vader";

/**
 * Individual test result
 */
export interface TestResult {
  name: string;
  status: "passed" | "failed" | "skipped";
  duration: number;
  error?: string;
  suite?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Test suite summary
 */
export interface TestSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  successRate: number;
}

/**
 * Coverage information
 */
export interface CoverageInfo {
  lines: number;
  functions: number;
  branches: number;
  statements: number;
  linesPercent: number;
  functionsPercent: number;
  branchesPercent: number;
  statementsPercent: number;
}

/**
 * Complete test report
 */
export interface TestReport {
  summary: TestSummary;
  results: TestResult[];
  coverage?: CoverageInfo;
  timestamp: string;
  environment: {
    runtime: string;
    platform: string;
    version: string;
    ci: boolean;
  };
  metadata?: Record<string, any>;
}

/**
 * Test reporter for generating comprehensive test reports
 *
 * @example
 * ```typescript
 * import { TestReporter } from "@inspatial/kit/test";
 *
 * const reporter = new TestReporter();
 *
 * // Add test results
 * reporter.addResult({
 *   name: "User authentication should work",
 *   status: "passed",
 *   duration: 45.2,
 *   suite: "Authentication"
 * });
 *
 * reporter.addResult({
 *   name: "Database connection should handle errors",
 *   status: "failed",
 *   duration: 123.7,
 *   error: "Connection timeout after 5000ms",
 *   suite: "Database"
 * });
 *
 * // Generate and save reports
 * const report = reporter.generateReport();
 * await reporter.saveReport(report, "html");
 * await reporter.saveReport(report, "json");
 * ```
 */
export class TestReporter {
  private results: TestResult[] = [];
  private startTime = Date.now();
  private coverage?: CoverageInfo;
  private metadata: Record<string, any> = {};

  /**
   * Add a test result to the report
   *
   * @param result - Test result to add
   */
  addResult(result: TestResult): void {
    this.results.push(result);
  }

  /**
   * Add multiple test results
   *
   * @param results - Array of test results to add
   */
  addResults(results: TestResult[]): void {
    this.results.push(...results);
  }

  /**
   * Set coverage information
   *
   * @param coverage - Coverage information
   */
  setCoverage(coverage: CoverageInfo): void {
    this.coverage = coverage;
  }

  /**
   * Set metadata for the report
   *
   * @param metadata - Metadata to include in the report
   */
  setMetadata(metadata: Record<string, any>): void {
    this.metadata = { ...this.metadata, ...metadata };
  }

  /**
   * Generate a complete test report
   *
   * @returns Complete test report
   */
  generateReport(): TestReport {
    const passed = this.results.filter((r) => r.status === "passed").length;
    const failed = this.results.filter((r) => r.status === "failed").length;
    const skipped = this.results.filter((r) => r.status === "skipped").length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    const successRate =
      this.results.length > 0 ? (passed / this.results.length) * 100 : 0;
    const runtimeInfo = env.getRuntime?.();

    return {
      summary: {
        total: this.results.length,
        passed,
        failed,
        skipped,
        duration: totalDuration,
        successRate,
      },
      results: this.results,
      coverage: this.coverage,
      timestamp: new Date().toISOString(),
      environment: {
        runtime: runtimeInfo?.name || "unknown",
        platform: runtimeInfo?.platform || "unknown",
        version: runtimeInfo?.version || "unknown",
        ci: env.isCI(),
      },
      metadata: this.metadata || {},
    };
  }

  /**
   * Generate HTML report
   *
   * @param report - Test report to convert to HTML
   * @returns HTML string
   */
  generateHTML(report: TestReport): string {
    const statusColor =
      report.summary.successRate >= 90
        ? "green"
        : report.summary.successRate >= 70
        ? "orange"
        : "red";

    const suiteGroups = this.groupResultsBySuite(report.results);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Report</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5; 
        }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .summary-item { text-align: center; }
        .summary-number { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .summary-label { color: #666; font-size: 0.9em; }
        .status-green { color: #28a745; }
        .status-orange { color: #fd7e14; }
        .status-red { color: #dc3545; }
        .suite { background: white; margin-bottom: 20px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .suite-header { background: #e9ecef; padding: 15px; font-weight: bold; border-bottom: 1px solid #dee2e6; }
        .test-result { padding: 15px; border-bottom: 1px solid #f1f3f4; }
        .test-result:last-child { border-bottom: none; }
        .test-name { font-weight: 500; margin-bottom: 5px; }
        .test-meta { display: flex; gap: 15px; font-size: 0.9em; color: #666; }
        .test-error { background: #fff5f5; border: 1px solid #fed7d7; border-radius: 4px; padding: 10px; margin-top: 10px; font-family: monospace; font-size: 0.9em; color: #c53030; white-space: pre-wrap; }
        .passed { border-left: 4px solid #28a745; }
        .failed { border-left: 4px solid #dc3545; }
        .skipped { border-left: 4px solid #fd7e14; }
        .coverage { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .coverage-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; }
        .coverage-item { text-align: center; }
        .coverage-bar { width: 100%; height: 8px; background: #e9ecef; border-radius: 4px; overflow: hidden; margin: 5px 0; }
        .coverage-fill { height: 100%; transition: width 0.3s ease; }
        .environment { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .env-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .tag { background: #e9ecef; color: #495057; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; margin-right: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Test Report</h1>
            <p>Generated on ${new Date(report.timestamp).toLocaleString()}</p>
        </div>
        
        <div class="summary">
            <h2>Summary</h2>
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-number">${report.summary.total}</div>
                    <div class="summary-label">Total Tests</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number status-green">${
                      report.summary.passed
                    }</div>
                    <div class="summary-label">Passed</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number status-red">${
                      report.summary.failed
                    }</div>
                    <div class="summary-label">Failed</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number status-orange">${
                      report.summary.skipped
                    }</div>
                    <div class="summary-label">Skipped</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number status-${statusColor}">${report.summary.successRate.toFixed(
      1
    )}%</div>
                    <div class="summary-label">Success Rate</div>
                </div>
                <div class="summary-item">
                    <div class="summary-number">${report.summary.duration.toFixed(
                      0
                    )}ms</div>
                    <div class="summary-label">Total Duration</div>
                </div>
            </div>
        </div>

        ${report.coverage ? this.generateCoverageHTML(report.coverage) : ""}
        
        <h2>Test Results</h2>
        ${Object.entries(suiteGroups)
          .map(
            ([suiteName, tests]) => `
            <div class="suite">
                <div class="suite-header">${suiteName}</div>
                ${tests
                  .map(
                    (result) => `
                    <div class="test-result ${result.status}">
                        <div class="test-name">${result.name}</div>
                        <div class="test-meta">
                            <span><strong>Status:</strong> ${result.status.toUpperCase()}</span>
                            <span><strong>Duration:</strong> ${result.duration.toFixed(
                              2
                            )}ms</span>
                            ${
                              result.tags
                                ? `<span><strong>Tags:</strong> ${result.tags
                                    .map(
                                      (tag) => `<span class="tag">${tag}</span>`
                                    )
                                    .join("")}</span>`
                                : ""
                            }
                        </div>
                        ${
                          result.error
                            ? `<div class="test-error">${escHtml(
                                result.error
                              )}</div>`
                            : ""
                        }
                    </div>
                `
                  )
                  .join("")}
            </div>
        `
          )
          .join("")}

        <div class="environment">
            <h2>Environment</h2>
            <div class="env-grid">
                <div><strong>Runtime:</strong> ${
                  report.environment.runtime
                }</div>
                <div><strong>Platform:</strong> ${
                  report.environment.platform
                }</div>
                <div><strong>Version:</strong> ${
                  report.environment.version
                }</div>
                <div><strong>CI:</strong> ${
                  report.environment.ci ? "Yes" : "No"
                }</div>
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Generate coverage HTML section
   */
  private generateCoverageHTML(coverage: CoverageInfo): string {
    return `
        <div class="coverage">
            <h2>Coverage</h2>
            <div class="coverage-grid">
                <div class="coverage-item">
                    <div><strong>Lines</strong></div>
                    <div class="coverage-bar">
                        <div class="coverage-fill" style="width: ${
                          coverage.linesPercent
                        }%; background-color: ${this.getCoverageColor(
      coverage.linesPercent
    )};"></div>
                    </div>
                    <div>${coverage.linesPercent.toFixed(1)}%</div>
                </div>
                <div class="coverage-item">
                    <div><strong>Functions</strong></div>
                    <div class="coverage-bar">
                        <div class="coverage-fill" style="width: ${
                          coverage.functionsPercent
                        }%; background-color: ${this.getCoverageColor(
      coverage.functionsPercent
    )};"></div>
                    </div>
                    <div>${coverage.functionsPercent.toFixed(1)}%</div>
                </div>
                <div class="coverage-item">
                    <div><strong>Branches</strong></div>
                    <div class="coverage-bar">
                        <div class="coverage-fill" style="width: ${
                          coverage.branchesPercent
                        }%; background-color: ${this.getCoverageColor(
      coverage.branchesPercent
    )};"></div>
                    </div>
                    <div>${coverage.branchesPercent.toFixed(1)}%</div>
                </div>
                <div class="coverage-item">
                    <div><strong>Statements</strong></div>
                    <div class="coverage-bar">
                        <div class="coverage-fill" style="width: ${
                          coverage.statementsPercent
                        }%; background-color: ${this.getCoverageColor(
      coverage.statementsPercent
    )};"></div>
                    </div>
                    <div>${coverage.statementsPercent.toFixed(1)}%</div>
                </div>
            </div>
        </div>`;
  }

  /**
   * Generate JUnit XML report
   *
   * @param report - Test report to convert to JUnit XML
   * @returns JUnit XML string
   */
  generateJUnitXML(report: TestReport): string {
    const suiteGroups = this.groupResultsBySuite(report.results);

    return `<?xml version="1.0" encoding="UTF-8"?>
<testsuites name="InSpatial Test Results" tests="${
      report.summary.total
    }" failures="${report.summary.failed}" skipped="${
      report.summary.skipped
    }" time="${(report.summary.duration / 1000).toFixed(3)}">
${Object.entries(suiteGroups)
  .map(([suiteName, tests]) => {
    const suitePassed = tests.filter((t) => t.status === "passed").length;
    const suiteFailed = tests.filter((t) => t.status === "failed").length;
    const suiteSkipped = tests.filter((t) => t.status === "skipped").length;
    const suiteDuration = tests.reduce((sum, t) => sum + t.duration, 0);

    return `  <testsuite name="${escXml(suiteName)}" tests="${
      tests.length
    }" failures="${suiteFailed}" skipped="${suiteSkipped}" time="${(
      suiteDuration / 1000
    ).toFixed(3)}">
${tests
  .map(
    (test) => `    <testcase name="${escXml(test.name)}" classname="${escXml(
      suiteName
    )}" time="${(test.duration / 1000).toFixed(3)}">
${
  test.status === "failed"
    ? `      <failure message="${escXml(test.error || "Test failed")}">${escXml(
        test.error || ""
      )}</failure>`
    : ""
}
${test.status === "skipped" ? `      <skipped/>` : ""}
    </testcase>`
  )
  .join("\n")}
  </testsuite>`;
  })
  .join("\n")}
</testsuites>`;
  }

  /**
   * Save report to file
   *
   * @param report - Test report to save
   * @param format - Output format (json, html, junit)
   * @param filename - Optional custom filename
   */
  async saveReport(
    report: TestReport,
    format: "json" | "html" | "junit" = "json",
    filename?: string
  ): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    let content: string;
    let extension: string;
    let defaultName: string;

    switch (format) {
      case "html":
        content = this.generateHTML(report);
        extension = "html";
        defaultName = `test-report-${timestamp}.html`;
        break;
      case "junit":
        content = this.generateJUnitXML(report);
        extension = "xml";
        defaultName = `test-results-${timestamp}.xml`;
        break;
      default:
        content = JSON.stringify(report, null, 2);
        extension = "json";
        defaultName = `test-report-${timestamp}.json`;
    }

    const finalFilename = filename || defaultName;

    try {
      await createOrUpdateTextFile(finalFilename, content);

      console.log(`📊 Test report saved: ${finalFilename}`);
      return finalFilename;
    } catch (error) {
      console.error("Failed to save test report:", error);
      throw error;
    }
  }

  /**
   * Group test results by suite
   */
  private groupResultsBySuite(
    results: TestResult[]
  ): Record<string, TestResult[]> {
    const groups: Record<string, TestResult[]> = {};

    for (const result of results) {
      const suite = result.suite || "Default";
      if (!groups[suite]) {
        groups[suite] = [];
      }
      groups[suite].push(result);
    }

    return groups;
  }

  /**
   * Get coverage color based on percentage
   */
  private getCoverageColor(percent: number): string {
    if (percent >= 80) return "#28a745";
    if (percent >= 60) return "#fd7e14";
    return "#dc3545";
  }

  /**
   * Common entity escaping used by HTML/XML escapers
   */
  // Escapers consolidated to util/escape.ts

  /**
   * Clear all results and reset the reporter
   */
  clear(): void {
    this.results = [];
    this.coverage = undefined;
    this.metadata = {};
    this.startTime = Date.now();
  }

  /**
   * Get current results count
   */
  get resultCount(): number {
    return this.results.length;
  }
}
