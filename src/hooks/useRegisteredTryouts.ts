"use client";

/**
 * In full API mode, tryout registration is handled via the POST /tryouts/{id}/enroll endpoint.
 * This hook provides minimal utility functions for compatibility.
 */
export function useRegisteredTryouts() {
  const registerTryout = (_tryoutId: string) => {
    // Registration is handled via API (useEnrollTryout mutation)
    return;
  };

  const checkIsRegistered = (_tryoutId: string): boolean => {
    // In backend mode, check via my-tryouts API
    return false; // Will be overridden by actual API data
  };

  return { registeredIds: [] as string[], registerTryout, checkIsRegistered };
}
