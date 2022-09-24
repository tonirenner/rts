import Shader from './shader.js';
import {cos, floor2, fract, length2, pow, rgba, sin, vec2, vec2s} from './functions.js';
import {Vec2, Vec3} from '../src/math.js';

/**
 * @param {Vec2} position
 *
 * @returns {number}
 */
const noise2d = position => {
    const x = cos(position.x * 37);
    const y = cos(position.y * 57);
    return fract(415.92653 * (x + y));
};

/**
 * @param {Vec2} position
 * @param {number} threshold
 * @returns {number}
 * @constructor
 */
const NoiseField = (position, threshold) => {
    const noise = noise2d(position);
    if (noise < threshold) {
        return 0;
    }

    return pow((noise - threshold) / (1 - threshold), 6.0);
};

const StarField = (position, threshold) => {
    const fx  = fract(position.x);
    const fy  = fract(position.y);
    const fp  = floor2(position);
    const nf1 = NoiseField(fp, threshold);
    const nf2 = NoiseField(fp.add(new Vec2(0, 1)), threshold);
    const nf3 = NoiseField(fp.add(new Vec2(1, 0)), threshold);
    const nf4 = NoiseField(fp.add(new Vec2(1, 1)), threshold);

    return nf1 * (1 - fx) * (1 - fy)
           + nf2 * (1 - fx) * fy
           + nf3 * fx * (1 - fy)
           + nf4 * fx * fy;
};


export default class StarsShader extends Shader
{
    /** @type {number} */
    density = 0.22;

    /** @type {number} */
    spin = 5;

    /** @type {Vec2} */
    offset = new Vec2(0.2, -0.06);

    color = new Vec3(0.1, 0.1, 0.22);

    /**
     * @param {Vec2} coordinates
     * @returns {string}
     */
    shade(coordinates)
    {
        const uv = this.uv(coordinates);

        const position = uv.multiplyScalar(2).subtract(vec2s(1));
        const angle    = this.spin * Math.atan2(position.y, position.x);

        const samplePos = (vec2(cos(angle), sin(angle)))
            .multiplyScalar(0.5 * length2(position))
            .add(vec2s(0.5))
            .multiplyScalar(this.resolution.y);

        const color = this.color.multiplyScalar(uv.y)
                          .addScalar(StarField(samplePos.add(this.offset), 1.2 - this.density));

        return rgba(color.x, color.y, color.z, 1);
    }
}