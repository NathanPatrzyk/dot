export type ActionState<T = undefined> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};
