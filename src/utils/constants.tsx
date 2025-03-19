import { env } from '../env';

export const VERSION = process.env.REACT_APP_VERSION;

// Common URLs
export const { NODE_ENV } = process.env;
export const IS_DEV = NODE_ENV !== 'production';
export const USE_LOCAL_DATA = true;

export const SPACER_HEADER = 70;
export const SPACER_FOOTER = 0;
export const SPACER = 50;

export const fullHeight = () => `calc(100vh - ${SPACER_HEADER + SPACER_FOOTER + SPACER}px)`;
