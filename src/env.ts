/* eslint-disable @typescript-eslint/no-explicit-any */

/* DON'T EDIT THIS FILE DIRECTLY

Run: "make dev-local-env" to update it
*/

declare global {
  interface Window {
    env: any;
  }
}

type EnvType = {
  REACT_APP_MSENTRA_CLIENT_ID: string;
  REACT_APP_MSENTRA_REDIRECT_URI: string;
  REACT_APP_MSENTRA_TENANT_ID: string;
};
export const env: EnvType = {
  ...process.env,
  ...window.env,
  ...(typeof Cypress !== 'undefined' ? Cypress.env() : {})
};
