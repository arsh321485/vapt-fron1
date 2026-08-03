<template>
  <div class="admin-project-field">
    <div v-if="projects.length" class="admin-project-select-wrap">
      <select
        v-model="activeProjectId"
        class="admin-project-select"
        @change="onActiveProjectChange"
      >
        <option v-for="project in projects" :key="project.id" :value="project.id">
          {{ project.name }}
        </option>
      </select>
    </div>

    <div class="admin-project-input-wrap">
      <input
        v-model="projectInput"
        type="text"
        class="admin-project-input"
        :class="{ 'admin-project-input--with-icon': showInputIcon }"
        placeholder="Enter project name"
        @input="onProjectInput"
        @keyup.enter="saveProject"
      />
      <button
        v-if="showInputIcon"
        type="button"
        class="admin-project-inline-btn"
        :class="{
          'admin-project-inline-btn--save': saveIconState === 'save',
          'admin-project-inline-btn--saving': saveIconState === 'saving',
          'admin-project-inline-btn--success': saveIconState === 'success',
        }"
        :disabled="saveIconState === 'saving' || saveIconState === 'success'"
        @click="saveProject"
      >
        <span v-if="saveIconState === 'saving'" class="spinner-border spinner-border-sm"></span>
        <i v-else-if="saveIconState === 'success'" class="bi bi-check-circle-fill"></i>
        <i v-else class="bi bi-floppy"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';

const STORAGE_PREFIX = 'vaptfix_admin_projects';
const SUCCESS_RESET_MS = 1200;

function buildStorageKey(adminId) {
  return adminId ? `${STORAGE_PREFIX}_${adminId}` : STORAGE_PREFIX;
}

export default {
  name: 'AdminProjectField',
  data() {
    return {
      authStore: useAuthStore(),
      projects: [],
      activeProjectId: '',
      projectInput: '',
      saveIconState: 'save',
      successResetTimer: null,
    };
  },
  computed: {
    storageKey() {
      const adminId =
        this.authStore.user?.admin_id ||
        this.authStore.user?.id ||
        this.authStore.user?._id ||
        localStorage.getItem('adminId') ||
        '';
      return buildStorageKey(adminId);
    },
    showInputIcon() {
      return Boolean(this.projectInput.trim()) || this.saveIconState === 'success';
    },
  },
  mounted() {
    this.loadProjects();
  },
  beforeUnmount() {
    this.clearSuccessResetTimer();
  },
  methods: {
    loadProjects() {
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (!raw) {
          this.projects = [];
          this.activeProjectId = '';
          this.projectInput = '';
          return;
        }
        const parsed = JSON.parse(raw);
        this.projects = Array.isArray(parsed.projects) ? parsed.projects : [];
        this.activeProjectId = parsed.activeProjectId || this.projects[0]?.id || '';
        this.projectInput = '';
      } catch {
        this.projects = [];
        this.activeProjectId = '';
        this.projectInput = '';
      }
    },
    persistProjects() {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          activeProjectId: this.activeProjectId,
          projects: this.projects,
        }),
      );
      localStorage.setItem('activeProjectName', this.getActiveProjectName());
    },
    getActiveProjectName() {
      return this.projects.find(p => p.id === this.activeProjectId)?.name || '';
    },
    onActiveProjectChange() {
      this.projectInput = '';
      this.saveIconState = 'save';
      this.clearSuccessResetTimer();
      this.persistProjects();
      this.$emit('project-change', {
        id: this.activeProjectId,
        name: this.getActiveProjectName(),
        projects: [...this.projects],
      });
    },
    onProjectInput() {
      if (this.saveIconState === 'success') {
        this.saveIconState = 'save';
      }
      this.clearSuccessResetTimer();
    },
    clearSuccessResetTimer() {
      if (this.successResetTimer) {
        clearTimeout(this.successResetTimer);
        this.successResetTimer = null;
      }
    },
    resetInputAfterSave() {
      this.clearSuccessResetTimer();
      this.successResetTimer = setTimeout(() => {
        this.projectInput = '';
        this.saveIconState = 'save';
        this.successResetTimer = null;
      }, SUCCESS_RESET_MS);
    },
    async saveProject() {
      const name = this.projectInput.trim();
      if (!name || this.saveIconState === 'saving' || this.saveIconState === 'success') return;

      this.saveIconState = 'saving';
      await new Promise(r => setTimeout(r, 300));

      const existing = this.projects.find(
        p => p.name.toLowerCase() === name.toLowerCase(),
      );

      if (existing) {
        this.activeProjectId = existing.id;
        this.persistProjects();
        this.saveIconState = 'success';
        this.resetInputAfterSave();
        this.$emit('project-saved', {
          id: existing.id,
          name: existing.name,
          projects: [...this.projects],
          isNew: false,
        });
        return;
      }

      const newProject = {
        id: `proj_${Date.now()}`,
        name,
        createdAt: new Date().toISOString(),
      };
      this.projects.push(newProject);
      this.activeProjectId = newProject.id;
      this.persistProjects();
      this.saveIconState = 'success';
      this.resetInputAfterSave();

      this.$emit('project-saved', {
        id: newProject.id,
        name: newProject.name,
        projects: [...this.projects],
        isNew: true,
      });
    },
  },
};
</script>

<style scoped>
.admin-project-field {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.admin-project-select-wrap {
  position: relative;
}

.admin-project-select,
.admin-project-input {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  height: 38px;
}

.admin-project-select {
  min-width: 150px;
  max-width: 180px;
  padding: 0 28px 0 12px;
  font-weight: 500;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.admin-project-input-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.admin-project-input {
  min-width: 180px;
  max-width: 220px;
  padding: 0 12px;
  font-weight: 400;
  outline: none;
}

.admin-project-input--with-icon {
  padding-right: 36px;
}

.admin-project-input:focus,
.admin-project-select:focus {
  border-color: #94a3b8;
}

.admin-project-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.admin-project-inline-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  padding: 0;
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s, color 0.15s, transform 0.15s;
}

.admin-project-inline-btn--save {
  background: #e0f2f1;
  color: #0f696e;
}

.admin-project-inline-btn--save:hover {
  background: #ccfbf1;
  color: #0d5a5e;
  transform: translateY(-50%) scale(1.05);
}

.admin-project-inline-btn--save .bi-floppy {
  font-size: 0.9rem;
}

.admin-project-inline-btn--saving {
  cursor: default;
  color: #64748b;
}

.admin-project-inline-btn--success {
  cursor: default;
  color: #16a34a;
}

.admin-project-inline-btn--success .bi-check-circle-fill {
  font-size: 1rem;
}

.admin-project-inline-btn:disabled {
  cursor: default;
}

@media (max-width: 768px) {
  .admin-project-field {
    width: 100%;
  }

  .admin-project-select,
  .admin-project-input-wrap {
    flex: 1;
    min-width: 0;
  }

  .admin-project-input {
    width: 100%;
    max-width: none;
  }
}
</style>
