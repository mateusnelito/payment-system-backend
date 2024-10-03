import { ZodError } from 'zod';

export default function formatZodErrors(errors: ZodError) {
  const formattedErrors: Record<string, any> = {};

  for (const issue of errors.issues) {
    const path = issue.path.join('.');

    if (path.includes('.')) {
      const paths = path.split('.');

      paths.reduce((acc, key, idx) => {
        if (idx === paths.length - 1) {
          acc[key] = acc[key] || [];
          acc[key].push(issue.message);
        } else {
          acc[key] = acc[key] || {};
        }
        return acc[key];
      }, formattedErrors);
    } else {
      formattedErrors[path] = formattedErrors[path] || [];
      formattedErrors[path].push(issue.message);
    }
  }
  return formattedErrors;
}
