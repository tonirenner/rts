import Shader from './shader.js';
import {dot3, length3, max, min, normalize3, rgba4, vec3, vec4} from './functions.js';
import {Vec2, Vec4} from '../src/math.js';

export const NUMBER_OF_STEPS        = 32;
export const MINIMUM_HIT_DISTANCE   = 0.001;
export const MAXIMUM_TRACE_DISTANCE = 1000;
export const SMALL_STEP             = vec3(MINIMUM_HIT_DISTANCE, 0, 0);

/**
 * @param {Vec3} position
 * @param {Vec3} center
 * @param {number} radius
 * @returns {number}
 */
export const sdSphere = (position, center, radius) => {
    return length3(position.subtract(center)) - radius;
};

/**
 * @param {RayMarcherScene} scene
 * @param {Vec3} position
 * @returns {Vec3}
 */
export const calculateNormal = (scene, position) => {
    return normalize3(vec3(
        scene.distanceAt(position.add(vec3(SMALL_STEP.x, SMALL_STEP.y, SMALL_STEP.y)))
        - scene.distanceAt(position.subtract(vec3(SMALL_STEP.x, SMALL_STEP.y, SMALL_STEP.y))),
        scene.distanceAt(position.add(vec3(SMALL_STEP.y, SMALL_STEP.x, SMALL_STEP.y)))
        - scene.distanceAt(position.subtract(vec3(SMALL_STEP.y, SMALL_STEP.x, SMALL_STEP.y))),
        scene.distanceAt(position.add(vec3(SMALL_STEP.y, SMALL_STEP.y, SMALL_STEP.x)))
        - scene.distanceAt(position.subtract(vec3(SMALL_STEP.y, SMALL_STEP.y, SMALL_STEP.x)))
    ));
};

/**
 * @param {Vec3} normal
 * @returns {Vec3}
 */
export const normalToRGB = normal => {
    return normal.multiplyScalar(0.5).addScalar(0.5);
};

/**
 * @param {Vec3} position
 * @param {Vec3} lightPosition
 * @returns {Vec3}
 */
export const lightDirectionAt = (position, lightPosition) => {
    return normalize3(position.subtract(lightPosition));
};

/**
 * @param {Vec3} normal
 * @param {Vec3} directionToLight
 * @returns {number}
 */
export const lightAngleAt = (normal, directionToLight) => {
    return max(0, dot3(normal, directionToLight));
};

/**
 * @param {Vec3} position
 * @param {Vec3} normal
 * @param {Vec3} lightPosition
 * @returns {number}
 */
export const lightIntensityAt = (position, normal, lightPosition) => {
    return lightAngleAt(normal, lightDirectionAt(position, lightPosition));
};

export class RayMarcherScene
{
    /** @type {number} */
    rayCount;

    /**
     * @param {Vec3} position
     * @returns {number}
     */
    distanceAt(position)
    {
        return 0;
    }

    /**
     * @param position
     * @returns {Vec4}
     */
    colorAt(position)
    {
        return vec4();
    }

    /**
     * @param {Vec2} uv
     * @param {number} minDistance
     * @returns {Vec4}
     */
    background(uv, minDistance)
    {
        return vec4();
    }
}

export class RayMarcher
{
    /**
     * @param {RayMarcherScene} scene
     * @param {Vec2} uv
     * @param {Vec3} origin
     * @param {Vec3} direction
     * @returns {Vec4}
     */
    shade(scene, uv, origin, direction)
    {
        scene.rayCount = 1;

        let position;
        let totalDistanceTraveled = 0;
        let minDistance           = 1;
        let distanceToClosest;

        for (let i = 0; i < NUMBER_OF_STEPS; i++) {
            position          = origin.addScalar(totalDistanceTraveled).multiply(direction);
            distanceToClosest = scene.distanceAt(position);
            minDistance       = min(minDistance, distanceToClosest);

            if (distanceToClosest < MINIMUM_HIT_DISTANCE) {
                scene.rayCount = i;

                return scene.colorAt(position);
            }

            if (totalDistanceTraveled > MAXIMUM_TRACE_DISTANCE) {
                break;
            }

            totalDistanceTraveled += distanceToClosest;
        }

        return scene.background(uv, minDistance);
    }
}

export class RayMarchingShader extends Shader
{
    /** @type RayMarcher */
    marcher;

    /** @type RayMarcherScene */
    scene;

    /**
     * @param {RayMarcherScene} scene
     * @param {number} width
     * @param {number} height
     */
    constructor(scene, width, height)
    {
        super(width, height);

        this.marcher = new RayMarcher();
        this.scene   = scene;
    }

    /**
     * @returns {Vec3}
     */
    origin()
    {
        return vec3(0, 0, -5);
    }

    /**
     * @param {Vec2} coordinates
     * @returns {string}
     */
    shade(coordinates)
    {
        const uv = this.uv(coordinates)
                       .multiplyScalar(2)
                       .subtractScalar(1);

        return rgba4(
            this.marcher.shade(
                this.scene,
                uv,
                this.origin(),
                vec3(uv.x, -uv.y, -1)
            )
        );
    }
}