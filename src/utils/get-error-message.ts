type ErrorWithResponseMessage = {
  response?: {
    data?: {
      errors?: {
        email?: unknown[];
      };
      message?: unknown;
    };
  };
};

export function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const data = (error as ErrorWithResponseMessage).response?.data;
    const message = data?.message;
    const emailError = data?.errors?.email?.[0];

    if (typeof message === "string" && message.length > 0) {
      return message;
    }

    if (typeof emailError === "string" && emailError.length > 0) {
      return emailError;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
