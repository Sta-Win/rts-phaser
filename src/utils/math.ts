export class MathUtils {

    /** 
     * For a given triangle with points been A, B, C and the longest side is AC, return the length of AC.
     * @param x1 Aˣ
     * @param y1 Aʸ
     * @param x2 Cˣ
     * @param y2 Cʸ
     * @returns the distance in pixel between A and C
     */
    static pythagore(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(((y1 - y2) ** 2) + ((x1 - x2) ** 2));
    }

}