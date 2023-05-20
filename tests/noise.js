import {floor3, fract3, rand3, vec3, vec4} from './functions.js';

// https://iquilezles.org/articles/morenoise/

/**
 * @param {Vec3} x
 * @returns {Vec4}
 */
export const noised = x => {
    const p = floor3(x);
    const w = fract3(x);

    // u  = w * w * w * (w * (w * 6.0 - 15) + 10);
    const u = w.multiply(w).multiply(w).multiply(w).multiply(
        w.multiply(w.multiplyScalar(6).subtractScalar(15)).addScalar(10)
    );

    // du = 30.0 * w * w * (w * (w - 2) + 1)
    const du = w.multiply(w).multiplyScalar(30).multiply(
        w.multiply(w.subtractScalar(2)).addScalar(1)
    );

    //console.log(p, w, u, du);

    const a = rand3(p.add(vec3(0, 0, 0)));
    const b = rand3(p.add(vec3(1, 0, 0)));
    const c = rand3(p.add(vec3(0, 1, 0)));
    const d = rand3(p.add(vec3(1, 1, 0)));
    const e = rand3(p.add(vec3(0, 0, 1)));
    const f = rand3(p.add(vec3(1, 0, 1)));
    const g = rand3(p.add(vec3(0, 1, 1)));
    const h = rand3(p.add(vec3(1, 1, 1)));

    //console.log(a, b, c, d, e, f, g, h);

    const k0 = a;
    const k1 = b - a;
    const k2 = c - a;
    const k3 = e - a;
    const k4 = a - b - c + d;
    const k5 = a - c - e + g;
    const k6 = a - b - e + f;
    const k7 = -a + b + c - d + e - f - g + h;

    //console.log(k0, k1, k2, k3, k4, k5, k6, k7);

    const noise = -1 + 2 * (k0 + k1 * u.x
                  + k2 * u.y
                  + k3 * u.z
                  + k4 * u.x * u.y
                  + k5 * u.y * u.z
                  + k6 * u.z * u.x
                  + k7 * u.x * u.y * u.z);

    //console.log(noise);

    const derivates = du.multiplyScalar(2)
                        .multiply(vec3(
                            k1 + k4 * u.y + k6 * u.z + k7 * u.y * u.z,
                            k2 + k5 * u.z + k4 * u.x + k7 * u.z * u.x,
                            k3 + k6 * u.x + k5 * u.y + k7 * u.x * u.y
                        ));

    //console.log(du.multiplyScalar(2));
    //console.log(k1 + k4 * u.y + k6 * u.z + k7 * u.y * u.z);
    //console.log(k2 + k5 * u.z + k4 * u.x + k7 * u.z * u.x);
    //console.log(k3 + k6 * u.x + k5 * u.y + k7 * u.x * u.y);
    //console.log(derivates);

    return vec4(
        noise,
        derivates.x,
        derivates.y,
        derivates.z
    );
};