import { ZodFastifySchemaValidationError } from 'fastify-type-provider-zod';

// Function to format validation errors in detail
export function formatZodValidationErrors(
  errors: ZodFastifySchemaValidationError[]
) {
  // Initialize an object to store formatted errors
  const formattedErrors: Record<string, any> = {};

  // Iterate over each error in the ZodError object
  for (const error of errors) {
    const {
      params: { issue },
    } = error;

    // Join the error path into a dot-separated string
    const dottedPath = issue.path.join('.');

    // Checks if the error path is nested (contains a dot)
    if (dottedPath.includes('.')) {
      // Retrieve the original path, in individual parts
      const { path } = issue;

      // Use reduce to create or access the structure nested in the errors object
      path.reduce((acc, key, idx) => {
        // If we are in the last part of the path, we add the error message
        if (idx === path.length - 1) {
          // Initialize the current key as an array if it doesn't already exist
          acc[key] = acc[key] || [];
          // Add the error message to the array
          acc[key].push(issue.message);
        } else {
          // Initialize the current key as an object if it does not already exist
          acc[key] = acc[key] || {};
        }
        // Returns the updated accumulator for the next iteration
        return acc[key];
      }, formattedErrors); // Pass the formatted errors object as the initial accumulator
    } else {
      // If the path is not nested, add the error message directly
      formattedErrors[dottedPath] = formattedErrors[dottedPath] || [];
      formattedErrors[dottedPath].push(issue.message);
    }
  }

  // Returns the formatted error object
  return formattedErrors;
}
