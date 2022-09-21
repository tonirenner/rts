import {Vec2} from '../src/math.js';

/**
 * @param {number} a
 * @param {number} b
 *
 * @returns {number}
 */
export const mod = (a, b) => {
    return a % b;
};

/**
 * @param {Vec2} a
 * @param {Vec2} b
 *
 * @returns {Vec2}
 */
export const mod2 = (a, b) => {
    return new Vec2(a.x % b.x, a.y % b.y);
};

/**
 * @param {number} x
 *
 * @returns {number}
 */
export const sin = x => {
    return Math.sin(x);
};

/**
 * @param {number} v
 *
 * @returns {number}
 */
export const cos = v => {
    return Math.cos(v);
};

/**
 * @param {Vec2} v
 *
 * @returns {Vec2}
 */
export const sin2 = v => {
    v.x = sin(v.x);
    v.y = sin(v.y);
    return v;
};

/**
 * @param {Vec2} v
 *
 * @returns {Vec2}
 */
export const cos2 = v => {
    v.x = cos(v.x);
    v.y = cos(v.y);
    return v;
};

/**
 * @param {number} x
 *
 * @returns {number}
 */
export const fract = x => {
    return x - Math.floor(x);
};

/**
 * @param {Vec2} v
 *
 * @returns {Vec2}
 */
export const fract2 = v => {
    v.x = fract(v.x);
    v.x = fract(v.y);
    return v;
};

/**
 * @param {number} x
 * @param {number} min
 * @param {number} max
 *
 * @returns {number}
 */
export const clamp = (x, min, max) => {
    return Math.max(x, Math.min(min, max));
};

/**
 * @param {number} x
 *
 * @returns {number}
 */
export const abs = (x) => {
    return Math.abs(x);
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} a
 *
 * @returns {number}
 */
export const mix = (x, y, a) => {
    return x * (1 - a) + y * a;
};

/**
 * @param {number} a
 * @param {number} b
 *
 * @returns {number}
 */
export const max = (a, b) => {
    return Math.max(a, b);
};

/**
 * @param {number} a
 * @param {number} b
 *
 * @returns {number}
 */
export const min = (a, b) => {
    return Math.min(a, b);
};

/**
 * @param {Vec2} a
 * @param {Vec2} b
 *
 * @returns {Vec2}
 */
export const max2 = (a, b) => {
    return a.max(b);
};

/**
 * @param {Vec2} a
 * @param {Vec2} b
 *
 * @returns {Vec2}
 */
export const min2 = (a, b) => {
    return a.min(b);
};

/**
 * @param {Vec2} a
 * @param {Vec2} b
 * @returns {number}
 */
export const dot = (a, b) => {
    return a.dot(b);
};

/**
 * @param {Vec2} v
 *
 * @returns {number}
 */
export const length = v => {
    return v.length();
};

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @param {number} a
 * @returns {string}
 */
export const rgba = (r, g, b, a) => {
    r = clamp(r * 255, 0, 255) | 0;
    g = clamp(g * 255, 0, 255) | 0;
    b = clamp(b * 255, 0, 255) | 0;

    return `rgba(${r},${g},${b},${a.toFixed(2)})`;
};