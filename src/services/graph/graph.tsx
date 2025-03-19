export async function getMsEntraProfilePicture(accessToken: string) {
  const headers = new Headers();
  if (accessToken) {
    try {
      const bearer = `Bearer ${accessToken}`;
      headers.append('Authorization', bearer);

      const options = {
        method: 'GET',
        headers
      };

      const stream = await fetch(
        'https://graph.microsoft.com/v1.0/me/photos/48x48/$value',
        options
      );
      const blob = await stream.blob();
      const url = URL.createObjectURL(blob);
      return url;
    } catch (error) {
      /* eslint-disable no-console */
      console.error('Error fetching MS Graph data:', error);
      return null;
    }
  }
  return null;
}
