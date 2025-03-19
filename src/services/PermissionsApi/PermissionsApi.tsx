import { PERMISSIONS_API_URI } from '../../utils/constants';

/**
 * Attaches a given access token to a MS Graph API call. Returns information about the user
 * @param accessToken
 */
export async function loadUserPermissions(accessToken: string) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers
  };

  return (
    fetch(PERMISSIONS_API_URI, options)
      .then((response) => response.json())
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error))
  );
}
