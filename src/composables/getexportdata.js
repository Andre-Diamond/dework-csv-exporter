import axios from 'axios';

export async function useGetExportData(workspace) {
  const query = `
  query GetWorkspaceTasksQuery {
    getWorkspace(id: "${workspace}") {
      id
      tasks {
        id
        name
        assignees {
          id
          username
        }
        createdAt
        creator {
          id
          username
        }
        doneAt
        dueDate
        status
        storyPoints
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
