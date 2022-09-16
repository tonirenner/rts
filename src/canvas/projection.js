export default class Projection
{
    /**
     * @param {number} width
     * @param {number} height
     * @returns {DOMMatrix}
     */
    matrix(width, height)
    {
        const sx = 1;
        const sy = -1;
        const tx = width / 2;
        const ty = height / 2;

        return new DOMMatrix([
                                 sx, 0,
                                 0, sy,
                                 tx, ty
                             ]);
    }
}