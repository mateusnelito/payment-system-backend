import HttpStatusCodes from '../utils/http-status-codes.util';

const AUTHORIZATION_URL = 'https://util.devi.tools/api/v2/authorize';

interface authorizationResponseData {
  status: 'success' | 'fail';
  data: {
    authorization: boolean;
  };
}

export async function authorizeTransaction() {
  try {
    const response = await fetch(AUTHORIZATION_URL);
    const { data } = (await response.json()) as authorizationResponseData;

    // Check for unexpected status codes (anything other than 200 or 403)
    if (
      ![HttpStatusCodes.OK, HttpStatusCodes.FORBIDDEN].includes(response.status)
    ) {
      throw new Error(
        `Unexpected response status: ${response.status}. Expected 200 (OK) or 403 (Forbidden).`
      );
    }

    // Ensure the authorization field is boolean
    if (typeof data.authorization !== 'boolean') {
      throw new Error(
        'Invalid response: "authorization" field should be a boolean.'
      );
    }

    return data.authorization;
  } catch (err) {
    throw new Error(`Transaction authorization failed: ${err}`);
  }
}
