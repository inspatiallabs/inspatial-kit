# World-Class Engineered Product Development - Fusion Test Driven Development (Fusion TDD)

1. **Deep Context Understanding & Reasoning**

   - **Objective:** Absorb all relevant background, user requirements, domain specifics, and constraints.
   - **Action:** Analyze provided context, ask clarifying questions if needed, and construct a knowledge base that informs every subsequent step.

2. **Idea Generation**

   - **Objective:** Brainstorm multiple approaches, architectures, and potential solutions.
   - **Action:** Use creative and logical thinking to produce a diverse set of ideas without bias.

3. **Critique Generation**

   - **Objective:** Identify strengths, weaknesses, and potential risks in each idea.
   - **Action:** Perform a thorough critical analysis to filter out impractical or risky options.

4. **Thought Refinement**

   - **Objective:** Refine and consolidate the best ideas into a clear, coherent plan.
   - **Action:** Iterate on the chosen concepts, improving clarity, feasibility, and alignment with project goals.

5. **Comparative Analysis**

   - **Objective:** Compare the refined ideas against industry best practices, similar products, and potential technical challenges.
   - **Action:** Assess trade-offs, scalability, performance, and maintainability to choose the optimal solution.

6. **Spec Generation**

   - **Objective:** Produce a detailed and precise specification that outlines functional requirements, user scenarios, and technical constraints.
   - **Action:** Document the specs clearly and comprehensively, ensuring all stakeholders understand the expectations.

7. **SLO (Service Level Objectives) Definition & Update**

- **Objective:** Define or update Service Level Objectives for performance, reliability, and quality metrics
- **Action:** Establish measurable targets (response times, availability, error rates, throughput) that align with business requirements and user expectations

8. TDD Consolidation

- **Objective**: Analyze, consolidate, and complete the test suite to ensure comprehensive coverage
- **Action:**

  **Scenario A**: No Existing Tests

  - Proceed directly to Generate Tests (step 9)

  **Scenario B**: Existing Tests Present
  **Phase 1**: Current State Analysis
  ```terminal # Run existing tests and collect coverage
  deno test --coverage=coverage_baseline --allow-all --reporter=verbose

      # Generate coverage analysis
      deno coverage coverage_baseline --include="src/" --exclude="test/"
      deno coverage coverage_baseline --html --output=coverage_report/

  ````

   **Phase 2:** Test Quality Assessment
   - Analyze what failing tests are actually trying to accomplish
   - Preserve all original test intentions
   - Apply working patterns if established
   - Document & Debug implementation issues vs test pattern issues

   **Phase 3:** Coverage Gap Clear Success/Failure Analysis
   ```terminal
   # Generate detailed coverage report
   deno coverage coverage_profile --html --output=coverage_report/
   ```

   - Map existing test coverage against the specification requirements
   - Identify untested functions/methods from coverage report
   - Find Missing edge cases and error conditions and branch coverage in conditional logic
   - Locate untested error handling paths
   - Check integration point coverage

   **Phase 4:** Fill Coverage Gaps
   - Write additional tests for uncovered functions
   - Add branch condition tests for missed conditionals
   - Create error scenario tests for exception paths
   - Add SLO performance validation tests
   - Ensure integration coverage between components

   **Phase 5:** Coverage Gap Clear Success/Failure Analysis
   ```terminal
   # Re-run with enhanced test suite
   deno test --coverage=coverage_enhanced --allow-all

   # Compare coverage improvement
   deno coverage coverage_enhanced --include="src/"
   deno coverage coverage_enhanced --diff=coverage_baseline
   ```

  **Scenario C**: Existing Tests with Good Coverage
   ```terminal
   # Quick coverage validation
   deno test --coverage=coverage_check --allow-all
   deno coverage coverage_check --include="src/" --threshold=85
  ````

  - If threshold met: Minimal adjustments, proceed to implementation
  - If threshold not met: Apply Scenario B gap-filling process

9. **Generate Tests via FUSION-TDD**

   - **Objective:** Create tests that capture all specified behaviors before any implementation code is written.
   - **Action:**
     - Write high-level behavior tests (BDD style) for acceptance criteria.
     - Develop unit tests (TDD style) for individual components.
     - Include detailed specification-driven tests for critical business logic.
     - Add golden master tests to ensure legacy behavior preservation.
     - Develop outside-in tests to verify end-to-end integration.
     - Ensure all tests are written with InSpatial Test module.
     - Verify tests fail appropriately (red phase) before moving to implementation.

10. **Generate Implementation**

- **Objective:** Develop the codebase that fulfills the specs and passes the previously written tests.
- **Action:** Implement the solution strictly guided by making the existing tests pass (green phase), ensuring modularity, readability, and maintainability.

11. **Refactor Phase**

- **Objective:** Improve code quality without changing functionality.
- **Action:** Clean up implementation while ensuring all tests continue to pass.

12. **Test Pass?**
    - **Decision:**
      - **Yes:** If all tests pass, the implementation is considered complete.
      - **No:** If any tests fail, analyze the failure, adjust tests if specifications were misunderstood, if spec is not misunderstood then refine the implementation.

**### Red-Green-Refactor Loop (Steps 8, 9, 10, 11)**

- **Continuous Improvement:**

  - Maintain the strict TDD cycle: Write failing test (red) → Make test pass with minimal code (green) → Refactor
  - Use small, incremental steps to build functionality
  - Allow test failures to guide implementation decisions
  - Update tests if expectation issues identified, else flag for implementation fixes
  - Never write implementation code without a failing test first
  - Refine test expectation if the failure is due to written test in accordance with working test pattern
  - Update both tests and code until every test passes without exceptions
  - Use feedback from failing tests to drive improvements in both specs and implementation

  - In the instance of stubborn failing output run isolated debug tests
  - If it's passing, then check and update the original failing tests expectations
  - Delete/Clean up the isolated debug tests afterwards

  - Always ensure tests are written with InSpatial Test module
  - Prioritize test creation before any implementation work begins
  - Focus on making tests pass with the simplest possible solution before optimizing

**IMPORTANT:** All tests must be written with InSpatial Test module and implementation must never precede test creation. The test-first discipline is essential to maintain throughout the entire development process.

<!-- // ======================================================
// TESTING PATTERN
// ======================================================

/**
 * # Test Naming Pattern
 * - Use descriptive test names
 * - Append "Test" to test file names
 * - Structure: "should [expected behavior] when [condition]"
 */
// Example in user-class.test.ts:
// import { test, describe, it, expect, assert, mockFn}
//
// describe('UserClass', () => {
//   it('should return the correct name when getName is called', () => {
//     const user = new UserClass('Ben');
//     expect(user.getName()).toBe('Ben');
//   });
// }); --> -->
