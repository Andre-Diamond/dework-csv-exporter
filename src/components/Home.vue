<script setup>
import { ref, onMounted, computed } from "vue";
import { useGetDeworkData } from "../composables/getdeworkdata";
import { useGetWorkspaceSlug } from "../composables/getworkspaceslug";
import { useGetWorkspaceTasks } from "../composables/getworkspacetasks";

const orgACE = 'd1ce833b-ab25-4a3b-a0a1-2fbc2077b8cc'


const loaded = ref(false)

let ACE = ref({
  ACEAMainProject: { id: '65345970-fcb3-4962-be04-c1a3276157bd', name: '', slug: '', tasks: [] },
  ACEDeworkPerformance: { id: 'ebe3b549-07c7-4d90-8ebe-357b7fbda528', name: '', slug: '', tasks: [] },
  ACEDeworkcsvExport: { id: '1ae5c92e-c40b-4854-8e87-1107de83d249', name: '', slug: '', tasks: [] },
});

let ACESlug = ref()

onMounted(async () => {
  await getDework();
});

function updateObjectWithSlugs(object, slugs) {
  slugs.data.getOrganization.workspaces.forEach(workspace => {
    Object.keys(object).forEach(key => {
      if (object[key].id === workspace.id) {
        object[key].name = workspace.name;
        object[key].slug = workspace.slug;
      }
    });
  });
}

async function getACEWorkspaces() {
  for (const key in ACE.value) {
    const tasks = await useGetDeworkData(ACE.value[key].id);
    ACE.value[key].tasks = tasks.data.getWorkspace.tasks;
  }
}

async function getDework() {
  loaded.value = false;
  const ACESlugs = await useGetWorkspaceSlug(orgACE);
  ACESlug.value = ACESlugs.data.getOrganization;
  updateObjectWithSlugs(ACE.value, ACESlugs);
  await getTasks();
  loaded.value = true;
}
async function getTasks() {
  await getACEWorkspaces();
}
function countAuditedTasks(tasks) {
  return tasks.filter(task => {
    return task.tags.some(tag => tag.label.toLowerCase().includes('audited'));
  }).length;
}

function countNonAuditedTasks(tasks) {
  return tasks.filter(task => {
    return !task.tags.some(tag => tag.label.toLowerCase().includes('audited'));
  }).length;
}

const isAuditedTasksLoaded = (workspace) => {
  return countAuditedTasks(workspace.tasks) > 0;
};
function hasNonAuditedTasks(workspace) {
  return countNonAuditedTasks(workspace.tasks) > 0;
}
const isWorkspaceReady = computed(() => {
  return (workspace) => {
    return !hasNonAuditedTasks(workspace);
  };
});

function openLink(id) {
  let workspaceSlug = '';
  let organizationSlug = '';
  for ( let i in ACESlug.value.workspaces) {
    if (ACESlug.value.workspaces[i].id == id) {
      organizationSlug = ACESlug.value.slug
      workspaceSlug = ACESlug.value.workspaces[i].slug
    }
  }
  window.open(`https://app.dework.xyz/${organizationSlug}/${workspaceSlug}/view/board`, "_blank");
}

async function exportData(id) {
  let workspaceSlug = '';
  let workspaceName = '';
  let organizationSlug = '';
  for ( let i in ACESlug.value.workspaces) {
    if (ACESlug.value.workspaces[i].id == id) {
      organizationSlug = ACESlug.value.slug
      workspaceSlug = ACESlug.value.workspaces[i].slug
      workspaceName = ACESlug.value.workspaces[i].name
    }
  }
  const tasks = await useGetWorkspaceTasks(id);
  let csvContent = '"Name","Link","Tags","Story Points","Status","Assignees","Wallet Address","Reward","Due Date","Activities"\n';
  
  for (let task of tasks.data.getWorkspace.tasks) {
      let name = task.name || '';
      let link = `https://app.dework.xyz/${organizationSlug}/${task.workspace.slug}?taskId=${task.id}`; 
      let tags = task.tags.map(t => t.label).join(',') || ''; 
      let storyPoints = task.storyPoints || '';
      let status = task.status || '';
      let assignees = task.assignees.map(a => a.username).join(',') || ''; 
      let walletAddress = ''; 
      let reward = ''; 
      let dueDate = task.dueDate || '';
      let creator = task.creator.username; 
      let createdAt = new Date(task.createdAt).toLocaleString("en-US", {month: "long", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true});
      let activities = `${creator} created on ${createdAt}`;
  
      if(task.doneAt) {
          let doneAt = new Date(task.doneAt).toLocaleString("en-US", {month: "long", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true});
          activities += `, Task completed on ${doneAt}`;
      }
      activities = activities.replace(/(\d{4}) at/g, "$1");
  
      csvContent += `"${name}","${link}","${tags}","${storyPoints}","${status}","${assignees}","${walletAddress}","${reward}","${dueDate}","${activities}"\n`;
  }

  // Convert the CSV content to a Blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create a link element
  const link = document.createElement("a");

  // Add link to the body
  document.body.appendChild(link);

  // Set link attributes
  link.href = URL.createObjectURL(blob);
  link.type = "text/csv";
  link.download = `${workspaceName}-tasks-list.csv`;
  link.click();

  // Remove link after download
  setTimeout(() => {
    document.body.removeChild(link);
  }, 0);
}

</script>

<template>
  <div class="main">
    <div>
      <table>
        <thead>
          <tr>
            <th>Workspace</th>
            <th class="centered">Audited</th>
            <th class="centered">Not Audited</th>
            <th>Status</th> 
            <th>Link</th>
            <th>Export</th>
          </tr>
        </thead>
        <tbody>
          <tr>Automate, Educate, Communicate (Samples)</tr> 
          <tr v-for="(workspace, key) in ACE" :key="'ACE-' + key">
            <td>{{ workspace.name }}</td>
            <td class="centered">{{ countAuditedTasks(workspace.tasks) }}</td>
            <td class="centered">{{ countNonAuditedTasks(workspace.tasks) }}</td>
            <td :class="{
              'green-text': isAuditedTasksLoaded(workspace),
              'red-text': !isWorkspaceReady(workspace)
            }">{{ isWorkspaceReady(workspace) ? 'All Audited' : 'Not Audited' }}</td>
            <td><button @click="openLink(workspace.id)">Open Board</button></td>
            <td><button @click="exportData(workspace.id)">Export csv</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style>
.main {
  display: flex;
  justify-content: center; 
  align-items: center; 
}

.centered {
  text-align: center;
}

table {
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding-left: 8px;
  padding-right: 8px;
  font-size: 12px; 
}

.green-text {
  color: green;
}
.red-text {
  color: red;
}
</style>