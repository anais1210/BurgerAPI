import { Types } from "mongoose";

export class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
  }
}

export const validate = {
  required: (value: any, field: string) => {
    if (value === undefined || value === null || value === "") {
      throw new ValidationError(field, `${field} is required`);
    }
    return value;
  },

  string: (value: any, field: string, opts?: { min?: number; max?: number }) => {
    if (typeof value !== "string") {
      throw new ValidationError(field, `${field} must be a string`);
    }
    if (opts?.min && value.length < opts.min) {
      throw new ValidationError(field, `${field} must be at least ${opts.min} characters`);
    }
    if (opts?.max && value.length > opts.max) {
      throw new ValidationError(field, `${field} must be at most ${opts.max} characters`);
    }
    return value;
  },

  number: (value: any, field: string, opts?: { min?: number; max?: number }) => {
    const num = Number(value);
    if (isNaN(num)) {
      throw new ValidationError(field, `${field} must be a number`);
    }
    if (opts?.min !== undefined && num < opts.min) {
      throw new ValidationError(field, `${field} must be at least ${opts.min}`);
    }
    if (opts?.max !== undefined && num > opts.max) {
      throw new ValidationError(field, `${field} must be at most ${opts.max}`);
    }
    return num;
  },

  objectId: (value: any, field: string) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new ValidationError(field, `${field} must be a valid ID`);
    }
    return value;
  },

  array: (value: any, field: string, opts?: { min?: number }) => {
    if (!Array.isArray(value)) {
      throw new ValidationError(field, `${field} must be an array`);
    }
    if (opts?.min && value.length < opts.min) {
      throw new ValidationError(field, `${field} must have at least ${opts.min} items`);
    }
    return value;
  },
};
