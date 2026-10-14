<template>
  <teleport to="body">
    <div v-if="visible" class="ct-overlay" @click.self="close">
      <div ref="card" class="ct-card" role="dialog" aria-modal="true" aria-labelledby="ct-title">
        <div class="ct-header">
          <div class="ct-icon" aria-hidden="true">
            <i class="bi bi-people-fill"></i>
          </div>
          <div>
            <h2 id="ct-title" class="ct-title">Create Team</h2>
            <p class="ct-sub">Add a team alongside the four standard teams.</p>
          </div>
          <button type="button" class="ct-close" aria-label="Close" @click="close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <form class="ct-body" @submit.prevent="submit">
          <label class="ct-label" for="ct-team-name">Team name</label>
          <input
            id="ct-team-name"
            ref="nameInput"
            v-model="name"
            class="ct-input"
            type="text"
            maxlength="80"
            placeholder="Enter team name"
            autocomplete="off"
          />
          <p class="ct-hint">
            This team covers the full report. If Slack or Microsoft Teams is connected, a channel is created automatically.
          </p>
          <div class="ct-actions">
            <button type="button" class="ct-cancel" @click="close">Cancel</button>
            <button type="submit" class="ct-save" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              {{ saving ? "Creating..." : "Create" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script>
import Swal from "sweetalert2";
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "CreateCustomTeamModal",
  emits: ["created"],
  data() {
    return {
      visible: false,
      saving: false,
      name: "",
    };
  },
  created() {
    this._pausedModals = [];
    this._guardFocus = (event) => {
      const card = this.$refs.card;
      if (!this.visible || !card?.contains(event.target)) return;
      event.stopPropagation();
    };
  },
  beforeUnmount() {
    this.releaseParentFocus();
  },
  methods: {
    open() {
      this.name = "";
      this.saving = false;
      this.visible = true;
      document.addEventListener("focusin", this._guardFocus, true);
      this.$nextTick(() => {
        this.pauseBootstrapFocus();
        this.$refs.nameInput?.focus();
      });
    },
    close() {
      if (this.saving) return;
      this.visible = false;
      this.releaseParentFocus();
    },
    pauseBootstrapFocus() {
      this._pausedModals = [];
      document.querySelectorAll(".modal.show").forEach((el) => {
        const instance = window.bootstrap?.Modal?.getInstance(el);
        if (!instance?._focustrap?.deactivate) return;
        instance._focustrap.deactivate();
        this._pausedModals.push(instance);
      });
    },
    releaseParentFocus() {
      document.removeEventListener("focusin", this._guardFocus, true);
      (this._pausedModals || []).forEach((instance) => {
        try {
          instance._focustrap?.activate();
        } catch {
          /* modal already closed */
        }
      });
      this._pausedModals = [];
    },
    async submit() {
      const name = this.name.trim();
      if (!name) {
        Swal.fire({
          icon: "warning",
          title: "Enter a team name",
          confirmButtonColor: "#0f696e",
        });
        return;
      }
      this.saving = true;
      const res = await useAuthStore().createCustomTeam(name);
      this.saving = false;
      if (!res.status || !res.data) {
        Swal.fire({
          icon: res.httpStatus === 400 ? "warning" : "error",
          title: "Could not create team",
          text: res.message || "Try a different name.",
          confirmButtonColor: "#0f696e",
        });
        return;
      }
      this.visible = false;
      this.releaseParentFocus();
      this.$emit("created", res.data);
    },
  },
};
</script>

<style scoped>
.ct-overlay {
  position: fixed;
  inset: 0;
  z-index: 20000;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.ct-card {
  width: min(440px, 100%);
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  font-family: Inter, sans-serif;
}

.ct-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 20px 12px;
}

.ct-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #e0f2f1;
  color: #0f696e;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
}

.ct-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}

.ct-sub {
  margin: 2px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.ct-close {
  margin-left: auto;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #f1f5f9;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ct-body {
  padding: 4px 20px 20px;
}

.ct-label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
}

.ct-input {
  width: 100%;
  height: 42px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  color: #1e293b;
}

.ct-input:focus {
  outline: none;
  border-color: #0f696e;
  box-shadow: 0 0 0 3px rgba(15, 105, 110, 0.15);
}

.ct-hint {
  margin: 10px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: #64748b;
}

.ct-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.ct-cancel,
.ct-save {
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
}

.ct-cancel {
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.ct-save {
  background: #0f696e;
  color: #ffffff;
  border: none;
}

.ct-save:disabled {
  opacity: 0.65;
}
</style>
