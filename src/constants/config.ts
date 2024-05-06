export const IS_DEV = process?.env?.ENV === "dev" ? true : false;
export const IS_PRODUCTION = !IS_DEV;
export const HEADLESS = !!IS_DEV;
export const DEV_TARGET = "Paul Dupont";
