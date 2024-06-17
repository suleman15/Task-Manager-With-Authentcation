import { ApiError } from "../utils/Error.js";
import { ZodError } from "zod";

/**
 * middleware to validate the user provided data by using Joi
 * @param {object} schema - validate data based on provided schema
 * @return {function} If validation error send response to user otherwise control pass the next controller
 */
export const validateData = (schema) => {
  return (req, _, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const validationErrorMessage = result.error || "Enter valid data!";
      next(new ApiError(400, validationErrorMessage));
    } else {
      req.body = result.data; // Attach validated data to the request body
      next(); // Pass control to the next middleware/controller
    }
  };
};

export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation error",
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};

export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    let err = error;
    if (err instanceof ZodError) {
      const validationErrorMessage = err.issues[0].message;
      next(new ApiError(400, validationErrorMessage));
    }
  }
};
