import type { ContactFormData } from "./types";

export interface ValidationErrors {
  [key: string]: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(
  data: Partial<ContactFormData>
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (data.name.length > 100) {
    errors.name = "Name must be less than 100 characters";
  }

  if (!data.organisation || data.organisation.trim().length < 2) {
    errors.organisation = "Organisation must be at least 2 characters";
  } else if (data.organisation.length > 200) {
    errors.organisation = "Organisation must be less than 200 characters";
  }

  if (!data.role || data.role.trim().length < 2) {
    errors.role = "Role must be at least 2 characters";
  } else if (data.role.length > 100) {
    errors.role = "Role must be less than 100 characters";
  }

  if (!data.email || !EMAIL_REGEX.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (data.phone && (data.phone.length < 8 || data.phone.length > 20)) {
    errors.phone = "Phone number must be between 8 and 20 characters";
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  } else if (data.message.length > 2000) {
    errors.message = "Message must be less than 2000 characters";
  }

  return errors;
}

export function hasErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
