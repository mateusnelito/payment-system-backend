const AUTHORIZATION_URL = 'https://util.devi.tools/api/v2/authorize';

interface authorizationResponseData {
  status: 'success' | 'fail';
  data: {
    authorization: Boolean;
  };
}

export async function authorizeTransaction() {
  try {
    const response = await fetch(AUTHORIZATION_URL);
    const { data } = (await response.json()) as authorizationResponseData;

    return data.authorization;
  } catch (err) {
    throw new Error(`Error authorizing transaction.\n ${err}`);
  }
}
