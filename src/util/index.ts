import { ErrorTypes } from './types';

export function validateFormData<T extends Record<string, string>>(
	formData: T,
	errors: ErrorTypes<T>
): string | null {
	for (const key in formData) {
		const value = formData[key];

		const isEmpty = value === '';

		if (isEmpty && Object.keys(errors).includes(key)) {
			if ((key === 'classroom' || key === 'subject') && formData.isNewStudent) {
				continue;
			}
			return errors[key];
		}
	}

	return null;
}
