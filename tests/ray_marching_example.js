import {length2, length3, max, min, mix3, normalize3, pow, pow2x, smoothstep3, vec2, vec3} from './functions.js';
import {Vec4} from '../src/math.js';
import {
    lightAngleAt,
    lightIntensityAt,
    NUMBER_OF_STEPS,
    RayMarcherScene,
    RayMarchingShader,
    sdSphere
} from './raymarcher.js';
import {noised} from './noise.js';

const DISPLACEMENT_VALUE    = 0.1;
const DISPLACEMENT_OFFSET   = 0.5;
const SPHERE_RADIUS         = 1;
const NUMBER_OF_OCTAVES     = 11;
const FIRST_LIGHT_POSITION  = vec3(-0.5, 0.5, SPHERE_RADIUS + 2);
const SECOND_LIGHT_POSITION = vec3(0.5, -2, SPHERE_RADIUS + 1);
const CAMERA_ORIGIN         = vec3(0, 0, -3.0);


/**
 * @param {Vec3} x
 * @param {number} H
 * @param {number} numOctaves
 * @returns {*}
 */
const fbm = (x, H, numOctaves) => {
    const G = pow2x(-H);
    let f   = 1;
    let a   = 1;
    let t   = 0;
    for (let i = 0; i < numOctaves; i++) {
        t += a * noised(x.multiplyScalar(f)).x;
        f *= 2;
        a *= G;
    }
    return t;
};

/**
 * @param {Vec3} position
 * @returns {number}
 */
const map = position => {
    return fbm(position, 1.0, NUMBER_OF_OCTAVES) - DISPLACEMENT_OFFSET;
};

/**
 * @param {Vec3} position
 * @param {number} t
 * @returns {Vec3}
 */
export const calculateNormal = (position, t) => {
    const eps = vec2(0.005 * t, 0);
    return normalize3(vec3(
        map(position.add(vec3(eps.x, eps.y, eps.y)))
        - map(position.subtract(vec3(eps.x, eps.y, eps.y))),
        map(position.add(vec3(eps.y, eps.x, eps.y)))
        - map(position.subtract(vec3(eps.y, eps.x, eps.y))),
        map(position.add(vec3(eps.y, eps.y, eps.x)))
        - map(position.subtract(vec3(eps.y, eps.y, eps.x)))
    ));
};

/**
 * @param {Vec3} origin
 * @param {Vec3} lightDirection
 * @param {number} radius
 * @param {number} displacementValue
 * @returns {number}
 */
export const shadowRay = (origin, lightDirection, radius, displacementValue) => {

    let t               = 0;
    let shadowHardness  = 10;
    let closestDistance = 1;

    let position, pointOnSphere, spherePosition, distance;
    for (let i = 0; i < 8; ++i) {

        position = origin.add(lightDirection.multiplyScalar(t)).add(normalize3(origin).divideScalar(shadowHardness));

        pointOnSphere = normalize3(position).multiplyScalar(radius);

        spherePosition = radius + map(pointOnSphere) * displacementValue;

        distance = length3(position) - spherePosition;

        closestDistance = min(closestDistance, distance);

        if (distance < 0.0) {
            break;
        }

        t += 0.08;
    }
    return smoothstep3(0, 1, closestDistance * shadowHardness);
};

export class Scene extends RayMarcherScene
{
    /**
     * @type {Vec3}
     */
    pointOnSphere = vec3();

    /**
     * @param {Vec3} position
     * @returns {number}
     */
    distanceAt(position)
    {
        const boundingDistance = sdSphere(position, vec3(0, 0, 0), SPHERE_RADIUS + 1);
        if (boundingDistance > SPHERE_RADIUS) {
            return SPHERE_RADIUS;
        }

        this.pointOnSphere   = normalize3(position).multiplyScalar(SPHERE_RADIUS);
        const spherePosition = SPHERE_RADIUS + map(this.pointOnSphere) * DISPLACEMENT_VALUE;

        return length3(position) - spherePosition;
    }

    /**
     * @param position
     * @returns {Vec4}
     */
    colorAt(position)
    {
        const normal = mix3(
            calculateNormal(this.pointOnSphere, 0.1),
            calculateNormal(this.pointOnSphere, 10),
            .5
        );

        //return Vec4.fromVec3(normalToRGB(n), 1);

        let lightIntensity = lightIntensityAt(position, normal, FIRST_LIGHT_POSITION);

        // shadow
        if (lightIntensity > 0.1) {
            lightIntensity *= shadowRay(position, FIRST_LIGHT_POSITION, SPHERE_RADIUS, DISPLACEMENT_VALUE);
        }

        // specular
        lightIntensity += pow(lightIntensity, 15) / 500;

        let color = vec3(0.4, 0.5, 0.6).multiplyScalar(lightIntensity);

        // secondary light
        color = color.add(
            vec3(0.4, 0.5, 0.7).multiplyScalar(lightAngleAt(normal, SECOND_LIGHT_POSITION) * 0.15)
        );

        // lava incandescence
        color = color.add(
            vec3(1.5, 0.25, 0.15).multiplyScalar(
                pow(max(0, -map(this.pointOnSphere)), 3) * 2 * max(0, 1 - normal.z)
            )
        );

        // inverse ambient occ
        color = color.add(vec3(1, 0.25, 0.2).multiplyScalar(pow(this.rayCount / NUMBER_OF_STEPS, 3)));

        return Vec4.fromVec3(color, 1);
    }

    /**
     * @param {Vec2} uv
     * @param {number} minDistance
     * @returns {Vec4}
     */
    background(uv, minDistance)
    {
        let sky = vec3(0, 0, 0);

        const halo = (1 - length2(uv.multiplyScalar(0.7)));

        sky = sky.multiplyScalar(halo);

        const distance = pow(0.6 - minDistance, 3) * 3;

        sky = sky.add(vec3(1, 0.25, 0.2).multiplyScalar(distance));

        return Vec4.fromVec3(sky, distance);
    }
}

export default class RayMarchingExampleShader extends RayMarchingShader
{
    /**
     * @param {number} width
     * @param {number} height
     */
    constructor(width, height)
    {
        super(new Scene(), width, height);
    }

    /**
     * @returns {Vec3}
     */
    origin()
    {
        return CAMERA_ORIGIN;
    }
}