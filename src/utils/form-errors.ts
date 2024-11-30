import { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from '@/types/common';

export function handleApiFormErrors<T extends FieldValues>(
  apiError: ApiError,
  setError: UseFormSetError<T>
): void {
  if (apiError.response?.data.errors) {
    Object.entries(apiError.response.data.errors).forEach(
      ([field, messages]) => {
        setError(field as Path<T>, {
          type: 'manual',
          message: messages[0],
        });
      }
    );
  }
}
