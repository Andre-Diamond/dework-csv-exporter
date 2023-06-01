<script setup>
import { ref, onMounted, computed } from "vue";
import { useGetDeworkData } from "../composables/getdeworkdata";
import { useGetWorkspaceSlug } from "../composables/getworkspaceslug";
import { useGetWorkspaceTasks } from "../composables/getworkspacetasks";

const orgSwarm = '67bd2c66-8ee8-4e2e-a22b-6cdc5d805a85'
const orgSNET = '5c29434c-e830-442b-b9f5-d2fb00ee7b34'

const loaded = ref(false)

let snet = ref({
  snetAmbassadorTeamTasks: { id: '42a619c8-6df7-452a-b7a5-376a07253e45', name: '', slug: '', tasks: [] },
  snetStrategyGuild: { id: '1917f12b-23e5-4858-a21f-b468bfc4510d', name: '', slug: '', tasks: [] },
  snetMarketingGuild: { id: 'ce409c08-64f8-4f4e-9996-27f8ac3b5974', name: '', slug: '', tasks: [] },
  snetTreasuryGuild: { id: '49a07d41-6717-40ca-9b24-a28a40885a4b', name: '', slug: '', tasks: [] },
  snetProcessGuild: { id: 'ecb72d11-022f-4f0f-b6ee-177a48097cf8', name: '', slug: '', tasks: [] },
  snetEducationGuild: { id: 'bb5ee1ff-fee2-4894-ab99-dc7e7350c15d', name: '', slug: '', tasks: [] },
  snetTranslationWorkgroup: { id: 'd88291a1-7741-4177-aac4-87813f72cade', name: '', slug: '', tasks: [] },
  snetVideoWorkgroup: { id: '727308db-3066-4e6e-a54f-639b1f436a87', name: '', slug: '', tasks: [] },
  snetWritersWorkgroup: { id: '080753af-e1d3-40a8-a5e5-21c2c6b065c7', name: '', slug: '', tasks: [] },
  snetArchivalWorkgroup: { id: '7107f180-35ed-42ce-88b7-eb720a99191b', name: '', slug: '', tasks: [] },
  snetDeworkPBL: { id: 'ba6a27c8-e153-400b-b103-1f4da4be7d6d', name: '', slug: '', tasks: [] },
  snetOnboardingWorkgroup: { id: '6bb3faf0-d1d4-4845-aea6-ed3884d89d3e', name: '', slug: '', tasks: [] },
  snetGovernanceWorkgroup: { id: 'f41e5190-3701-440f-b7bc-b4ec030e431a', name: '', slug: '', tasks: [] },
  snetAiSandbox: { id: '41bcf73e-3bc9-4582-97e8-2c836a979d90', name: '', slug: '', tasks: [] },
  snetDeepFundingTownHall: { id: '06a9a413-2fa8-4619-b1c0-25debbf4d496', name: '', slug: '', tasks: [] },
  snetDeepFundingCommunity: { id: '11f9023d-3134-4525-aedb-e69f506306de', name: '', slug: '', tasks: [] },
  snetDeepFundingXAmbassador: { id: 'c294c052-31b1-4c3f-9c2b-9d6eeea0ada6', name: '', slug: '', tasks: [] },
});

let swarm = ref({
  swarmMainProjects: { id: 'a27a9088-25c4-4286-9684-9641bd817bb0', name: '', slug: '', tasks: [] },
  swarmBountyBoard: { id: '6767c971-7dd6-438c-874c-facee8d0d7ce', name: '', slug: '', tasks: [] },
  swarmLabsGeneral: { id: 'e1fdeeea-15cd-4039-9e8f-89f55f5d377d', name: '', slug: '', tasks: [] },
  swarmPress: { id: 'de10bc5f-56bf-4ff6-95a6-ec963777b4b5', name: '', slug: '', tasks: [] },
  swarmATHnew: { id: '14e889ba-f591-435c-8e9e-b214f72c14f2', name: '', slug: '', tasks: [] },
  swarmSnet: { id: '75412cbc-dabe-4f6b-9cf2-41bde61553c6', name: '', slug: '', tasks: [] },
  swarmVeterans: { id: 'fa90afaf-ec66-4f35-990c-e2524adbaa55', name: '', slug: '', tasks: [] },
});

let snetWorkspaces = {};
let swarmWorkspaces = {};
let lastRefresh = 0;
let snetSlug = ref();
let swarmSlug = ref()

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

async function getsnetWorkspaces() {
  for (const key in snet.value) {
    const tasks = await useGetDeworkData(snet.value[key].id);
    snet.value[key].tasks = tasks.data.getWorkspace.tasks;
    //console.log("key", key)
  }
}

async function getswarmWorkspaces() {
  for (const key in swarm.value) {
    const tasks = await useGetDeworkData(swarm.value[key].id);
    swarm.value[key].tasks = tasks.data.getWorkspace.tasks;
    //console.log("key", key)
  }
}

async function getDework() {
  loaded.value = false;
  localStorage.removeItem("snetWorkspaces");
  localStorage.removeItem("swarmWorkspaces");
  const snetSlugs = await useGetWorkspaceSlug(orgSNET);
  const swarmSlugs = await useGetWorkspaceSlug(orgSwarm);
  swarmSlug.value = swarmSlugs.data.getOrganization;
  snetSlug.value = snetSlugs.data.getOrganization;
  updateObjectWithSlugs(snet.value, snetSlugs);
  updateObjectWithSlugs(swarm.value, swarmSlugs);
  //console.log(snetSlugs, swarmSlugs)
  //console.log(snet.value, swarm.value);
  localStorage.setItem("snetWorkspaces", JSON.stringify(snet.value));
  localStorage.setItem("swarmWorkspaces", JSON.stringify(swarm.value));
  await getTasks();
  loaded.value = true;
}
async function getTasks() {
  //console.log("Getting tasks...")
  await getswarmWorkspaces();
  await getsnetWorkspaces();
  localStorage.setItem("snetWorkspaces", JSON.stringify(snet.value));
  localStorage.setItem("swarmWorkspaces", JSON.stringify(swarm.value));
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
  for ( let i in swarmSlug.value.workspaces) {
    if (swarmSlug.value.workspaces[i].id == id) {
      organizationSlug = swarmSlug.value.slug
      workspaceSlug = swarmSlug.value.workspaces[i].slug
    }
  }
  for ( let i in snetSlug.value.workspaces) {
    if (snetSlug.value.workspaces[i].id == id) {
      organizationSlug = snetSlug.value.slug
      workspaceSlug = snetSlug.value.workspaces[i].slug
    }
  }
  window.open(`https://app.dework.xyz/${organizationSlug}/${workspaceSlug}/view/board`, "_blank");
  //console.log('Open link for workspace ID:', id, swarmSlug.value, workspaceSlug, organizationSlug);
}

async function exportData(id) {
  let workspaceSlug = '';
  let workspaceName = '';
  let organizationSlug = '';
  for ( let i in swarmSlug.value.workspaces) {
    if (swarmSlug.value.workspaces[i].id == id) {
      organizationSlug = swarmSlug.value.slug
      workspaceSlug = swarmSlug.value.workspaces[i].slug
      workspaceName = swarmSlug.value.workspaces[i].name
    }
  }
  for ( let i in snetSlug.value.workspaces) {
    if (snetSlug.value.workspaces[i].id == id) {
      organizationSlug = snetSlug.value.slug
      workspaceSlug = snetSlug.value.workspaces[i].slug
      workspaceName = snetSlug.value.workspaces[i].name
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
      let creator = task.creator.username; // Assuming creator is an object with a username property
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
  
  //console.log('Export data for workspace ID:', id, organizationSlug, workspaceSlug, tasks.data.getWorkspace.tasks);
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
            <th>Status</th> <!-- New column -->
            <th>Link</th>
            <th>Export</th>
          </tr>
        </thead>
        <tbody>
          <tr>Swarm</tr> 
          <tr v-for="(workspace, key) in swarm" :key="'swarm-' + key">
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
          <tr>SNET</tr>
          <tr v-for="(workspace, key) in snet" :key="'snet-' + key">
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
  justify-content: center; /* align horizontal */
  align-items: center; /* align vertical */
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
  font-size: 12px; /* Adjust the font size as needed */
}

.green-text {
  color: green;
}
.red-text {
  color: red;
}
</style>