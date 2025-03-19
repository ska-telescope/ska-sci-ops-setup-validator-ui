'use strict';

// This is needed so that we can have separate output directories for
// unit and e2e tests. Without it, the reports will override each other
// and the Gitlab artifacts be incomplete and unpredictable
let COVERAGE_OUTPUT_DIR = process.env.COVERAGE_OUTPUT_DIR || './build/reports';

module.exports = {
  all: true,
  'check-coverage': true,
  exclude: ['**/*.cy.{js,jsx,ts,tsx}'],
  reporter: ['cobertura', 'html', 'text'],
  'report-dir': COVERAGE_OUTPUT_DIR,
  'temp-dir': COVERAGE_OUTPUT_DIR + '/.nyc_output',
  extension: ['.js', '.cjs', '.mjs', '.ts', '.tsx', '.jsx'],
  include: ['src/components/**/*.{js,jsx,ts,tsx}'],
  branches: 75,
  lines: 75,
  functions: 75,
  statements: 75,
};
