import axios from 'axios';

export async function useGetDeworkData(workspace) {
  const query = `
  query GetWorkspaceTasksQuery {
    getWorkspace(id: "${workspace}") {
      id
      tasks(filter: { statuses: [IN_REVIEW] }) {
        id
        status
        tags {
          id
          label
          color
        }
        workspaceId
      }
    }
  }
`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': import.meta.env.VITE_DEWORK_AUTH,
  };

  try {
    const response = await axios.post('https://api.deworkxyz.com/graphql?op=GetWorkspaceTasksQuery', {
      query,
    }, {
      headers,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
