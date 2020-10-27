// @see https://30secondsofcode.org/type#isnil
export const isNil = val => val === undefined || val === null;

export const isEmptyHash = val =>
  Object.keys(val).length === 0 && val.constructor === Object;

// @see https://30secondsofcode.org/type#isempty
export const isEmpty = val => val == null || !(Object.keys(val) || val).length;

// @see https://30secondsofcode.org/type#isobject
export const isObject = obj => obj === Object(obj);

export function getHostname() {
  return window.location.hostname;
}
