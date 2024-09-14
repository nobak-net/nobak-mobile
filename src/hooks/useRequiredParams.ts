// hooks/useRequiredParams.ts
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import navigation from '../utils/Navigation';

interface UseRequiredParamsOptions {
  onError?: (missingParams: string[]) => void;
}

export function useRequiredParams<T extends Record<string, string | string[]>>(
  requiredParams: (keyof T)[],
  options?: UseRequiredParamsOptions
): { [K in keyof T]: string | string[] } {
  const params = useLocalSearchParams();

  const missingParams = requiredParams.filter((key) => params[key as string] === undefined);

  useEffect(() => {
    if (missingParams.length > 0) {
      if (options?.onError) {
        options.onError(missingParams as string[]);
      } else {
        // Default action: navigate back
        navigation.back();
      }
    }
  }, [missingParams]);

  // Build a new object with required parameters asserted as present
  const result = {} as { [K in keyof T]: string | string[] };

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      result[key as keyof T] = params[key]!; // Assert that the value is present
    }
  }

  // At this point, required parameters are present, and result has the correct type
  return result;
}