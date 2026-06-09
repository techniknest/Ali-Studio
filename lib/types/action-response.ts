export type ActionResponse<T = void> =
  | { success: true; data?: T; id?: string }
  | { success: false; error: string; statusCode?: number };

export function successResponse<T>(data?: T, id?: string): ActionResponse<T> {
  return { success: true, data, id };
}

export function errorResponse(error: string | Error, statusCode = 500): ActionResponse<never> {
  const message = error instanceof Error ? error.message : error;
  return { success: false, error: message, statusCode };
}
