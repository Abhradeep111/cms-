export async function withApiFallback<T>(
  operation: string,
  request: () => Promise<T>,
  getFallback: () => T,
): Promise<T> {
  try {
    return await request();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[API fallback] ${operation} failed; using static data. ${message}`);
    return getFallback();
  }
}

export function readApiData<T>(response: unknown, operation: string): T {
  if (
    typeof response !== 'object' ||
    response === null ||
    !('data' in response) ||
    response.data === undefined
  ) {
    throw new Error(`${operation} returned an invalid response envelope`);
  }

  return response.data as T;
}

export function requireRecord(
  value: unknown,
  operation: string,
): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${operation} returned an invalid object`);
  }

  return value as Record<string, unknown>;
}

export function requireArray<T>(value: unknown, operation: string): T[] {
  if (!Array.isArray(value)) {
    throw new Error(`${operation} returned an invalid collection`);
  }

  return value as T[];
}

export function logApiReadFailure(operation: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`[API fallback] ${operation} failed. ${message}`);
}
