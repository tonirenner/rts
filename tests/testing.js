import Shader from './shader.js';
import {clamp, distance2, exp3, rgba, vec2, vec3, vec4} from './functions.js';
import {Vec2, Vec4} from '../src/math.js';

/**
 * @param {number} k
 * @returns {Vec3}
 */
const blackBodyColor = k => {
    const color = vec3(1, 3.375, 8)
        .divide(
            exp3(vec3(1, 1.5, 2)
                     .multiplyScalar(19e3)
                     .divideScalar(k)
                     .subtractScalar(1))
        );
    return color.divideScalar(Math.max(color.x, color.y, color.z));
};

/**
 * @param {Vec2} uv
 * @param {Vec2} position
 * @param {number} radius
 * @returns {number}
 */
const distanceToCenter = (uv, position, radius) => {
    return distance2(position, uv) - radius;
};

/**
 * @param {number} distance
 * @param {Vec3} color
 */
const distanceColor = (distance, color) => {
    return vec4(color.x, color.y, color.z, 1 - clamp(distance, 0, 1));
};

/**
 * @param {number} distance
 * @param {number} strength
 * @returns {number}
 */
const distanceGlow = (distance, strength) => {
    return clamp(1 / distance, 0, 1) * strength;
};

export default class TestShader extends Shader
{
    /** @type {Vec3} */
    blackBodyColor = blackBodyColor(6200);

    /**
     * @param {Vec2} coordinates
     * @returns {string}
     */
    shade(coordinates)
    {
        const uv     = coordinates;
        const radius = 100;
        const center = vec2(300, 300);

        const distance = distanceToCenter(uv, center, radius);
        const glow     = distanceGlow(distance, 8);
        const color    = distanceColor(distance, this.blackBodyColor)
            .add(Vec4.fromVec3(this.blackBodyColor, 1).multiplyScalar(glow));

        return rgba(color.x, color.y, color.z, color.w);
    }
}