export type PickFrom<T, K extends [...(keyof T)[]]> = {
  [P in K[number]]: T[P];
};
