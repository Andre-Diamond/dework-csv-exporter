import axios from 'axios';

export async function useGetWorkspaceSlug(organization) {
    const query = `
    query GetOrganizationDetailsQuery {
        getOrganization(id: "${organization}") {
        id
        slug
        name
        workspaces {
          id
          name
          slug
        }
      }
    }
  `;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': import.meta.env.VITE_DEWORK_AUTH,
  };

  try {
    const response = await axios.post('https://api.deworkxyz.com/graphql?op=GetOrganizationDetailsQuery', {
      query,
    }, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}