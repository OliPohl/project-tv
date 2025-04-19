export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerpVec2 = (a: number[], b: number[], t: number) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];