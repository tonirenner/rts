import {Vec2, Vec3} from '../src/math.js';

/**
 * @param {number} x
 * @param {number} y
 *
 * @returns {Vec2}
 */
export const vec2 = (x = 0, y = 0) => {
    return new Vec2(x, y);
};

/**
 * @param {number} s
 *
 * @returns {Vec2}
 */
export const vec2s = (s = 0) => {
    return Vec2.fromScalar(s);
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 *
 * @returns {Vec3}
 */
export const vec3 = (x = 0, y = 0, z = 0) => {
    return new Vec3(x, y, z);
};

/**
 * @param {number} s
 *
 * @returns {Vec3}
 */
export const vec3s = (s = 0) => {
    return Vec3.fromScalar(s);
};

/**
 * @param {number} x
 * @param {number} y
 *
 * @returns {number}
 */
export const pow = (x, y) => {
    return Math.pow(x, y);
};

/**
 * @param {Vec2} a
 * @param {Vec2} b
 *
 * @returns {Vec2}
 */
export const pow2 = (a, b) => {
    return new Vec2(pow(a.x, b.x), pow(a.y, b.y));
};

/**
 * @param {Vec3} a
 * @param {Vec3} b
 *
 * @returns {Vec3}
 */
export const pow3 = (a, b) => {
    return new Vec3(pow(a.x, b.x), pow(a.y, b.y), pow(a.z, b.z));
};

/**
 * @param {number} x
 *
 * @returns {number}
 */
export const floor = x => {
    return Math.floor(x);
};

/**
 * @param {Vec2} v
 *
 * @returns {Vec2}
 */
export const floor2 = v => {
    return new Vec2(floor(v.x), floor(v.y));
};

/**
 * @param {Vec3} v
 *
 * @returns {Vec3}
 */
export const floor3 = v => {
    return new Vec3(floor(v.x), floor(v.y), floor(v.z));
};

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
 * @param {Vec3} a
 * @param {Vec3} b
 *
 * @returns {Vec3}
 */
export const mod3 = (a, b) => {
    return new Vec3(a.x % b.x, a.y % b.y, a.z % b.z);
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
    return new Vec2(sin(v.x), sin(v.y));
};

/**
 * @param {Vec2} v
 *
 * @returns {Vec2}
 */
export const cos2 = v => {
    return new Vec2(cos(v.x), cos(v.y));
};

/**
 * @param {Vec3} v
 *
 * @returns {Vec3}
 */
export const sin3 = v => {
    return new Vec3(sin(v.x), sin(v.y), sin(v.z));
};

/**
 * @param {Vec3} v
 *
 * @returns {Vec3}
 */
export const cos3 = v => {
    return new Vec3(cos(v.x), cos(v.y), cos(v.z));
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
    return new Vec2(fract(v.x), fract(v.y));
};

/**
 * @param {Vec3} v
 *
 * @returns {Vec3}
 */
export const fract3 = v => {
    return new Vec3(fract(v.x), fract(v.y), fract(v.z));
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
export const dot2 = (a, b) => {
    return a.dot(b);
};

/**
 * @param {Vec3} a
 * @param {Vec3} b
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
export const length2 = v => {
    return v.length();
};

/**
 * @param {Vec3} v
 *
 * @returns {number}
 */
export const length3 = v => {
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
    a = clamp(a, 0.0, 1.0);

    return `rgba(${r},${g},${b},${a.toFixed(2)})`;
};