<template>
  <div class="av-mode-root">
    <!-- Left: vulnerability list -->
    <div class="av-left">
      <div class="av-left-header left-panel-header">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h2 class="av-left-title assets-title">All Vulnerabilities</h2>
          <span class="av-count-badge assets-count-badge">{{ filteredVulns.length }} Vulns</span>
        </div>
        <div class="d-flex gap-3 mb-3">
          <i
            class="bi bi-trash action-icon"
            :class="{ 'text-muted': activeAction !== '' && activeAction !== 'delete' }"
            title="Remove assets for selected vulnerabilities"
            role="button"
            @click.stop="handleDeleteClick"
          ></i>
          <i
            class="bi bi-eye-slash action-icon"
            :class="{ 'text-muted': activeAction !== '' && activeAction !== 'hold' }"
            title="Hold mitigation"
            role="button"
            @click.stop="toggleHoldMode"
          ></i>
        </div>
        <div class="av-search-box">
          <i class="bi bi-search av-search-icon"></i>
          <input
            v-model="vulnQuery"
            type="text"
            class="av-search-input"
            placeholder="Search vulnerabilities..."
          />
        </div>
      </div>

      <div class="av-vuln-list asset-list-scroll" :class="{ 'av-vuln-list--loading': loading }">
        <div
          v-for="item in filteredVulns"
          :key="item._key"
          class="asset-item-new"
          :class="{ 'asset-item-active': selectedKey === item._key && !showCheckboxes && !showHoldCheckboxes }"
          @click="selectVulnFromList(item)"
        >
          <div class="av-list-item-primary d-flex align-items-start gap-2">
            <input
              v-if="showCheckboxes"
              type="checkbox"
              v-model="item.selected"
              class="form-check-input flex-shrink-0 mt-1"
              @click.stop
            />
            <input
              v-if="showHoldCheckboxes"
              type="checkbox"
              v-model="item.selected"
              class="form-check-input flex-shrink-0 mt-1"
              @click.stop
            />
            <span class="asset-ip av-vuln-list-name">{{ item.vul_name }}</span>
          </div>
          <div class="d-flex align-items-center gap-2 flex-wrap av-list-item-badges">
            <span class="sev-badge" :class="'sev-' + (item.severity?.toLowerCase() || '')">{{ item.severity }}</span>
            <span :class="getStatusBadgeClass(item.status)">
              <span :class="getStatusDotClass(item.status)"></span>
              {{ getStatusLabel(item.status) }}
            </span>
          </div>
          <div class="d-flex gap-2 flex-wrap">
            <span class="vuln-chip">
              {{ item.assets.length }} asset{{ item.assets.length === 1 ? '' : 's' }}
            </span>
          </div>
        </div>
        <p v-if="!filteredVulns.length" class="av-empty-list">No vulnerabilities found.</p>
      </div>

      <!-- Mitigation on Hold (same APIs as All Assets) -->
      <div v-if="showHeld && heldAssets.length" class="mitigation-hold-section">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h3 class="hold-title">Mitigation on hold</h3>
          <i
            class="bi bi-eye text-muted"
            style="cursor:pointer;font-size:0.95rem;"
            title="Unhold"
            role="button"
            @click="toggleUnholdMode"
          ></i>
        </div>
        <div v-for="(held, i) in heldAssets" :key="held.asset || i" class="hold-item">
          <div>
            <div class="d-flex align-items-center gap-2">
              <input
                v-if="showUnholdCheckboxes"
                v-model="held.selected"
                type="checkbox"
                class="form-check-input"
                @click.stop
              />
              <p class="hold-ip mb-0">{{ held.asset }}</p>
            </div>
            <p class="hold-sub">{{ held.member_type || 'Awaiting resolution' }}</p>
          </div>
          <span
            v-if="getHeldPrioritySeverity(held)"
            class="sev-badge"
            :class="'sev-' + getHeldPrioritySeverity(held).toLowerCase()"
          >
            {{ getHeldPrioritySeverity(held) }}
          </span>
        </div>
      </div>

      <!-- Delete Modal (same layout as All Assets #deleteModal) -->
      <div class="modal fade assets-action-modal" id="avDeleteModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Delete</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="cancelDelete"></button>
            </div>
            <div class="modal-body">Are you sure you want to delete the selected assets?</div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelDelete">Cancel</button>
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="confirmDelete">OK</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hold Modal (same layout as All Assets #holdConfirmModal) -->
      <div class="modal fade assets-action-modal assets-hold-modal" id="avHoldConfirmModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body"><p>Do you want to hold to mitigation?</p></div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelHold">No</button>
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="confirmHold">Yes</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: same layout as All Assets (title header + tabs in body card + scroll) -->
    <div ref="avRightScroll" class="av-right assets-right-panel">
      <template v-if="selectedVuln">
        <FixPanelHeaderAlerts
          :python-visible="showPythonAlert"
          :verified-visible="showVerifiedAlert"
          @close-python="$emit('close-python-alert')"
          @close-verified="$emit('close-verified-alert')"
          @open-python-guide="openPythonGuideFromAlert"
        />
        <div class="right-panel-header">
          <h1 class="asset-detail-title mb-0">{{ selectedVuln.vul_name }}</h1>
          <div class="detail-tabs">
            <button
              type="button"
              class="detail-tab"
              :class="{ 'detail-tab-active': activeDetailTab === 'vulnerabilities' }"
              @click="activeDetailTab = 'vulnerabilities'"
            >
              Vulnerabilities ({{ panelVulns.length }})
            </button>
            <button
              type="button"
              class="detail-tab"
              :class="{ 'detail-tab-active': activeDetailTab === 'exceptions' }"
              @click="onSupportRequestsTabClick"
            >
              Support Requests
              <span
                v-if="supportRequestCount > 0"
                class="badge rounded-circle bg-danger ms-1"
                style="font-size:11px;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;"
              >
                {{ supportRequestCount }}
              </span>
            </button>
          </div>
        </div>
      </template>

      <div class="av-right-scroll right-panel-scroll">
        <div class="av-right-inner">
        <div v-if="activeDetailTab === 'vulnerabilities'">
        <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap vuln-filter-bar">
          <div class="d-flex gap-2 flex-wrap align-items-center">
            <button class="sev-pill" :class="{ 'sev-pill-active': activeFilters.includes('All') }" @click="setSeverityFilter('All')">All</button>
            <button class="sev-pill sev-pill-critical" :class="{ 'sev-pill-active': activeFilters.includes('Critical') }" @click="setSeverityFilter('Critical')">Critical</button>
            <button class="sev-pill sev-pill-high" :class="{ 'sev-pill-active': activeFilters.includes('High') }" @click="setSeverityFilter('High')">High</button>
            <button class="sev-pill sev-pill-medium" :class="{ 'sev-pill-active': activeFilters.includes('Medium') }" @click="setSeverityFilter('Medium')">Medium</button>
            <button class="sev-pill sev-pill-low" :class="{ 'sev-pill-active': activeFilters.includes('Low') }" @click="setSeverityFilter('Low')">Low</button>
          </div>
          <div class="d-flex align-items-center gap-2 flex-wrap">
            <button
              type="button"
              class="vr-tab-btn"
              :class="{ 'vr-tab-active': statusFilter.length === 0 }"
              @click="toggleStatusTab('all')"
            >
              All
              <span class="vr-tab-count">{{ statusCountAll }}</span>
            </button>
            <button
              type="button"
              class="vr-tab-btn"
              :class="{ 'vr-tab-active-open': statusFilter.includes('open') }"
              @click="toggleStatusTab('open')"
            >
              Open
              <span class="vr-tab-count">{{ statusCountOpen }}</span>
            </button>
            <button
              type="button"
              class="vr-tab-btn"
              :class="{ 'vr-tab-active-closed': statusFilter.includes('closed') }"
              @click="toggleStatusTab('closed')"
            >
              Closed
              <span class="vr-tab-count">{{ statusCountClosed }}</span>
            </button>
          </div>
        </div>

        <h3 class="section-label mb-3">Active Threats</h3>

        <div v-if="loading" class="text-center py-4">
          <span class="spinner-border spinner-border-sm text-primary"></span>
        </div>
        <p v-else-if="!panelVulns.length" class="av-empty-threats">
          No vulnerabilities found. Try clearing severity filters or your search.
        </p>

        <div v-else class="d-flex flex-column gap-3">
          <div
            v-for="(v, i) in panelVulns"
            :key="v._key"
            class="vuln-accordion-item"
            :class="{ 'vuln-accordion-item--expanded': expandedVulnIndex === i }"
            :ref="'vuln-' + v._key"
          >
            <div class="vuln-accordion-header" role="button" @click="toggleAccordion(i)">
              <div class="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
                <i
                  class="bi bi-exclamation-triangle-fill vuln-icon flex-shrink-0"
                  :class="{
                    'vuln-icon-critical': v.severity === 'Critical',
                    'vuln-icon-high': v.severity === 'High',
                    'vuln-icon-medium': v.severity === 'Medium',
                    'vuln-icon-low': v.severity === 'Low',
                  }"
                ></i>
                <div class="vuln-name-row">
                  <span class="vuln-name" :title="v.vul_name">{{ v.vul_name }}</span>
                  <span class="sev-badge" :class="'sev-' + (v.severity?.toLowerCase() || '')">{{ v.severity }}</span>
                  <span :class="getStatusBadgeClass(v.status)">
                    <span :class="getStatusDotClass(v.status)"></span>{{ getStatusLabel(v.status) }}
                  </span>
                  <span :class="getVulnTeamChipClass(v.assigned_team, v.vul_name)" style="font-size:0.68rem; padding:2px 8px;">
                    {{ getVulnTeamLabel(v.assigned_team, v.vul_name) }}
                  </span>
                </div>
              </div>
              <div class="d-flex align-items-center gap-3 flex-shrink-0 vuln-accordion-actions">
                <FixAvailableIndicator
                  :severity="v.severity"
                  :asset-ip="v.assets?.[0]"
                  :asset-index="panelVulnDemoIndex(v)"
                />
                <button
                  type="button"
                  class="vuln-download-icon-btn"
                  :class="{ 'vuln-download-icon-btn--disabled': isVulnAutomationNo(v, i) }"
                  :disabled="isVulnAutomationNo(v, i)"
                  :title="isVulnAutomationNo(v, i) ? 'Script not available — automation not possible' : 'Download fix'"
                  :aria-label="isVulnAutomationNo(v, i) ? 'Script download not available' : 'Download fix'"
                  @click.stop="!isVulnAutomationNo(v, i) && downloadAutomationScript()"
                >
                  <i class="bi bi-download"></i>
                </button>
                <i class="bi text-muted" :class="expandedVulnIndex === i ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </div>
            </div>
            <div v-show="expandedVulnIndex === i" class="vuln-accordion-expand">
              <div class="vuln-accordion-body">
                <div class="av-description-block">
                  <div class="av-db-label">DESCRIPTION</div>
                  <p class="av-db-text">{{ getDisplayDescription(v.description, v._key) }}</p>
                  <button
                    v-if="(v.description || '').length > descriptionPreviewLimit"
                    type="button"
                    class="av-read-more"
                    @click="toggleDescription(v._key)"
                  >
                    {{ isDescriptionExpanded(v._key) ? 'Read less' : 'Read more' }}
                  </button>
                </div>

                <div class="av-detail-tabs">
                  <button
                    type="button"
                    class="av-dtab"
                    :class="{ active: currentVulnTab === 'affected' }"
                    @click="setVulnDetailTab('affected')"
                  >
                    🎯 Affected Assets
                  </button>
                  <button
                    type="button"
                    class="av-dtab"
                    :class="{ active: currentVulnTab === 'auto' }"
                    @click="setVulnDetailTab('auto')"
                  >
                    <span class="av-dtab-emoji" aria-hidden="true">🤖</span>
                    Automated Fix
                  </button>
                  <button
                    type="button"
                    class="av-dtab"
                    :class="{ active: currentVulnTab === 'manual' }"
                    @click="setVulnDetailTab('manual')"
                  >
                    <span class="av-dtab-emoji" aria-hidden="true">📋</span>
                    Manual Fix
                  </button>
                </div>

                <div class="av-detail-tab-content">
                  <div v-if="currentVulnTab === 'affected'" class="av-affected-tab">
                    <div class="av-assets-table-card">
                      <table class="av-assets-table">
                        <thead>
                          <tr>
                            <th>IP</th>
                            <th>Steps complete</th>
                            <th>Send for verification</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-if="!affectedAssetsTableRowsFor(v).length">
                            <td colspan="3" class="av-assets-empty">No affected assets for this vulnerability.</td>
                          </tr>
                          <tr v-for="asset in affectedAssetsTableRowsFor(v)" :key="asset.ip">
                            <td class="av-assets-ip">{{ asset.ip }}</td>
                            <td>
                              <div class="av-assets-steps-cell">
                                <div class="av-assets-progress-track">
                                  <div class="av-assets-progress-fill" :style="{ width: (asset.progress || 0) + '%' }"></div>
                                </div>
                                <span class="av-assets-steps-text">{{ asset.stepsCompleted }}/{{ asset.totalSteps }}</span>
                              </div>
                            </td>
                            <td>
                              <button
                                type="button"
                                class="av-assets-verify-btn"
                                :disabled="asset.stepsCompleted < asset.totalSteps"
                                @click="sendForVerification(asset)"
                              >
                                <i class="bi bi-send" aria-hidden="true"></i> Send for verification
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div v-if="affectedAssetsTableRowsFor(v).length" class="av-assets-table-footer">
                        Showing {{ affectedAssetsTableRowsFor(v).length }} asset{{ affectedAssetsTableRowsFor(v).length === 1 ? '' : 's' }}
                      </div>
                    </div>
                  </div>

                  <div v-else-if="currentVulnTab === 'auto'" class="av-auto-tab">
                    <AutomationNotSafeBanner v-if="isVulnAutomationNo(v, i)" />
                    <AutomatedFixPanel
                      v-else
                      :key="v._key + '-' + i"
                      :severity="v.severity"
                      :asset-ip="v.assets?.[0]"
                      :asset-index="panelVulnDemoIndex(v)"
                      :can-automate="canAutomate"
                      :must-manual="mustManual"
                      :recommended-text="recommendedText"
                      @view-code="showCodeModal = true"
                    />
                  </div>

                  <div v-else-if="currentVulnTab === 'manual'" class="av-manual-tab">
                    <div v-for="asset in v.assets" :key="asset" class="av-asset-section">
                      <div class="av-asset-label">
                        <span class="av-asset-os-lbl">{{ assetMetaFor(v, asset).os }}</span>
                      </div>
                      <ManualRemediationStepsPanel :is-user="isUser" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- Support Requests Tab -->
        <div v-else-if="activeDetailTab === 'exceptions'">
          <div v-if="loadingSupportRequests" class="text-center py-4">
            <span class="spinner-border spinner-border-sm text-primary"></span>
          </div>
          <div v-else-if="!supportRequestsForVuln.length" class="sr-empty">
            <i class="bi bi-inbox me-2"></i>No support requests raised for this vulnerability.
          </div>
          <div v-else>
            <div
              v-for="(req, i) in supportRequestsForVuln"
              :key="req._id || req.id || i"
              class="support-req-item"
            >
              <div class="d-flex align-items-center gap-3 flex-wrap">
                <div class="sr-index-circle">{{ i + 1 }}</div>
                <div>
                  <p class="sr-vul-name mb-0">{{ req.vul_name }}</p>
                  <p v-if="req.host_name" class="sr-host-name mb-0">{{ req.host_name }}</p>
                </div>
              </div>
              <button
                type="button"
                class="btn-view-requests"
                data-bs-toggle="modal"
                :data-bs-target="isUser ? '#avUserSupportModal' : '#avAdminSupportModal'"
                @click="openSupportRequestModal(req)"
              >
                <i class="bi bi-eye me-1"></i>View raised requests
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>

    <!-- Support request detail modals -->
    <div class="modal fade" id="avAdminSupportModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content sr-modal-content">
          <div class="modal-header sr-modal-header">
            <div>
              <h5 class="modal-title sr-modal-title">
                <i class="bi bi-headset me-2"></i>Issues Raised for Support
              </h5>
              <p class="sr-modal-sub mb-0">{{ selectedSupportRequest?.vul_name }}</p>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4" v-if="selectedSupportRequest">
            <p class="sr-section-label mb-3">Steps requested for support</p>
            <div v-if="selectedSupportRequest.step_requested" class="d-flex flex-wrap gap-2 mb-4">
              <span
                v-for="(step, si) in selectedSupportRequest.step_requested.split(',')"
                :key="si"
                class="sr-step-pill"
              >
                {{ step.trim() }}: review
              </span>
            </div>
            <div v-else class="text-muted small mb-4">No steps specified.</div>
            <p class="sr-section-label mb-2">Description</p>
            <textarea
              class="sr-textarea"
              rows="4"
              :value="selectedSupportRequest.description || ''"
              readonly
            ></textarea>
          </div>
          <div class="modal-footer sr-modal-footer">
            <button type="button" class="sr-btn-close" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="avUserSupportModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content sr-modal-content">
          <div class="modal-header sr-modal-header">
            <div>
              <h5 class="modal-title sr-modal-title">
                <i class="bi bi-headset me-2"></i>Issues Raised for Support
              </h5>
              <p class="sr-modal-sub mb-0">{{ selectedSupportRequest?.vul_name }}</p>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4" v-if="selectedSupportRequest">
            <p class="sr-section-label mb-2">Vulnerability</p>
            <p class="fw-semibold mb-3" style="font-size:15px;">{{ selectedSupportRequest.vul_name }}</p>
            <p class="sr-section-label mb-2">Steps Requested</p>
            <div class="d-flex flex-wrap gap-2 mb-4">
              <template v-if="selectedSupportRequest.step_number">
                <span class="sr-step-pill">Step {{ selectedSupportRequest.step_number }}</span>
              </template>
              <template v-else-if="selectedSupportRequest.step_requested === 'all'">
                <span class="sr-step-pill">All Steps</span>
              </template>
              <template v-else-if="selectedSupportRequest.step_requested">
                <span
                  v-for="step in selectedSupportRequest.step_requested.split(',')"
                  :key="step"
                  class="sr-step-pill"
                >Step {{ step.trim() }}</span>
              </template>
              <template v-else>
                <span class="text-muted small">No step specified</span>
              </template>
            </div>
            <p class="sr-section-label mb-2">Description</p>
            <textarea class="sr-textarea" rows="4" :value="selectedSupportRequest.description || ''" readonly></textarea>
          </div>
          <div class="modal-footer sr-modal-footer">
            <button type="button" class="sr-btn-close" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Code Modal -->
    <PythonInstallGuideModal
      v-model="showPythonModal"
      :severity="pythonGuideSeverity"
    />

    <div v-if="showCodeModal" class="code-modal-backdrop" @click.self="showCodeModal = false">
      <div class="code-modal-box">
        <div class="code-modal-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="bi bi-file-earmark-code" style="font-size: 1.2rem; color: #6366f1;"></i>
            <h3 class="code-modal-title">tls_config_auto_fixer.py</h3>
          </div>
          <button class="code-modal-close" @click="showCodeModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="code-modal-body">
          <div class="code-header-badge">Python 3.7+</div>
          <pre class="code-block"><code>{{ automationCode }}</code></pre>
        </div>
        <div class="code-modal-footer">
          <button class="code-copy-btn" @click="copyCodeToClipboard">
            <i class="bi bi-clipboard"></i>
            {{ codeCopied ? 'Copied!' : 'Copy to Clipboard' }}
          </button>
          <button class="code-close-btn" @click="showCodeModal = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/authStore';
import ManualRemediationStepsPanel from '@/components/assets/ManualRemediationStepsPanel.vue';
import AutomatedFixPanel from '@/components/assets/AutomatedFixPanel.vue';
import PythonInstallGuideModal from '@/components/assets/PythonInstallGuideModal.vue';
import FixAvailableIndicator from '@/components/assets/FixAvailableIndicator.vue';
import AutomationNotSafeBanner from '@/components/assets/AutomationNotSafeBanner.vue';
import FixPanelHeaderAlerts from '@/components/assets/FixPanelHeaderAlerts.vue';
import { isAutomationNotAvailable, matchesVulnStatusFilter } from '@/utils/assetVulnerabilities';

const DESC_LIMIT = 280;

export default {
  name: 'AssetsVulnerabilitiesMode',
  components: {
    ManualRemediationStepsPanel,
    AutomatedFixPanel,
    PythonInstallGuideModal,
    FixAvailableIndicator,
    AutomationNotSafeBanner,
    FixPanelHeaderAlerts,
  },
  props: {
    isUser: {
      type: Boolean,
      default: false,
    },
    showPythonAlert: {
      type: Boolean,
      default: false,
    },
    showVerifiedAlert: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close-python-alert', 'close-verified-alert'],
  data() {
    return {
      authStore: useAuthStore(),
      loading: false,
      vulnQuery: '',
      activeFilters: ['All'],
      statusFilter: [],
      selectedKey: null,
      expandedVulnIndex: null,
      currentVulnTab: 'auto',
      expandedDescriptions: {},
      descriptionPreviewLimit: DESC_LIMIT,
      pythonGuideSeverity: 'Medium',
      affectedAssetsData: [
        {
          ip: '210.14.23.65',
          status: 'In Progress',
          statusClass: 'status-progress',
          stepsCompleted: 2,
          totalSteps: 4,
          progress: 50,
          steps: [
            { name: 'Identify vulnerability location', completed: true },
            { name: 'Backup current configuration', completed: true },
            { name: 'Apply security patch', completed: false },
            { name: 'Verify fix implementation', completed: false },
          ],
        },
        {
          ip: '192.168.1.100',
          status: 'Pending',
          statusClass: 'status-pending',
          stepsCompleted: 0,
          totalSteps: 4,
          progress: 0,
          steps: [
            { name: 'Identify vulnerability location', completed: false },
            { name: 'Backup current configuration', completed: false },
            { name: 'Apply security patch', completed: false },
            { name: 'Verify fix implementation', completed: false },
          ],
        },
        {
          ip: '172.16.0.50',
          status: 'Completed',
          statusClass: 'status-completed',
          stepsCompleted: 4,
          totalSteps: 4,
          progress: 100,
          steps: [
            { name: 'Identify vulnerability location', completed: true },
            { name: 'Backup current configuration', completed: true },
            { name: 'Apply security patch', completed: true },
            { name: 'Verify fix implementation', completed: true },
          ],
        },
      ],
      activeDetailTab: 'vulnerabilities',
      showCheckboxes: false,
      showHoldCheckboxes: false,
      showUnholdCheckboxes: false,
      activeAction: '',
      heldAssets: [],
      showHeld: false,
      supportRequestsForVuln: [],
      supportRequestCount: 0,
      loadingSupportRequests: false,
      selectedSupportRequest: null,
      showCodeModal: false,
      showPythonModal: false,
      codeCopied: false,
      automationCode: `import paramiko\nimport requests\nimport subprocess\nimport re\nfrom datetime import import datetime\n\nclass TLSConfigurator:\n    def __init__(self, host, username, password):\n        self.host = host\n        self.username = username\n        self.password = password\n        self.ssh_client = paramiko.SSHClient()\n        self.log = []\n\n    def connect(self):\n        """Establish SSH connection to target host"""\n        self.ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())\n        try:\n            self.ssh_client.connect(self.host, username=self.username, password=self.password)\n            self.log_action("SSH connection established")\n            return True\n        except Exception as e:\n            self.log_action(f"Connection failed: {str(e)}")\n            return False`,
    };
  },
  computed: {
    rawRows() {
      if (this.isUser) {
        return this.authStore.cachedUserVulnRegister || [];
      }
      return this.authStore.vulnerabilityRows || [];
    },
    reportId() {
      return this.isUser ? this.authStore.userLatestReportId : this.authStore.latestReportId;
    },
    groupedVulns() {
      const map = new Map();
      const sevCounters = { critical: 0, high: 0, medium: 0, low: 0 };
      const sevPrefix = { critical: 'C', high: 'H', medium: 'M', low: 'L' };
      this.rawRows.forEach((row, index) => {
        const name = String(row.vul_name || row.plugin_name || row.vulnerability_name || '').trim();
        const key = name.toLowerCase() || `row-${row.id || index}`;
        const asset = row.asset || row.host_name || '';
        const sevKey = String(row.severity || row.risk_factor || 'medium').toLowerCase();
        const bucket = sevKey === 'critical' || sevKey === 'high' || sevKey === 'medium' || sevKey === 'low' ? sevKey : 'medium';
        if (!map.has(key)) {
          sevCounters[bucket] = (sevCounters[bucket] || 0) + 1;
          const prefix = sevPrefix[bucket] || 'V';
          map.set(key, {
            _key: key,
            displayId: `${prefix}${sevCounters[bucket]}`,
            id: row.id,
            vul_name: name || 'Unnamed vulnerability',
            severity: row.severity || row.risk_factor || 'Medium',
            status: row.status || 'open',
            description: row.description || '',
            cvss_score: row.cvss_score ?? row.cvss ?? null,
            cve: row.cve || row.cve_id || '',
            exposure: row.exposure || '',
            first_observation: row.first_observation,
            assets: asset ? [asset] : [],
            rows: [row],
            selected: false,
          });
        } else {
          const g = map.get(key);
          if (asset && !g.assets.includes(asset)) g.assets.push(asset);
          g.rows.push(row);
          if (!g.description && row.description) g.description = row.description;
          if (!g.cve && (row.cve || row.cve_id)) g.cve = row.cve || row.cve_id;
          if ((g.cvss_score == null || g.cvss_score === '') && (row.cvss_score ?? row.cvss)) {
            g.cvss_score = row.cvss_score ?? row.cvss;
          }
        }
      });
      return Array.from(map.values());
    },
    vulnsAfterSearch() {
      let list = [...this.groupedVulns];
      const q = this.vulnQuery.trim().toLowerCase();
      if (q) {
        list = list.filter(v =>
          v.vul_name.toLowerCase().includes(q) ||
          v.assets.some(a => a.toLowerCase().includes(q)) ||
          String(v.cve || '').toLowerCase().includes(q)
        );
      }
      return list;
    },
    vulnsForStatusCounts() {
      let list = this.vulnsAfterSearch;
      if (!this.activeFilters.includes('All')) {
        list = list.filter(v => this.activeFilters.includes(this.canonSeverity(v.severity)));
      }
      return list;
    },
    statusCountAll() {
      return this.vulnsForStatusCounts.length;
    },
    statusCountOpen() {
      return this.vulnsForStatusCounts.filter(v => matchesVulnStatusFilter(v, ['open'])).length;
    },
    statusCountClosed() {
      return this.vulnsForStatusCounts.filter(v => matchesVulnStatusFilter(v, ['closed'])).length;
    },
    filteredVulns() {
      let list = this.vulnsForStatusCounts;
      list = list.filter(v => matchesVulnStatusFilter(v, this.statusFilter));
      const rank = { critical: 0, high: 1, medium: 2, low: 3 };
      list.sort((a, b) => {
        const ar = rank[String(a.severity).toLowerCase()] ?? 9;
        const br = rank[String(b.severity).toLowerCase()] ?? 9;
        return ar - br || a.vul_name.localeCompare(b.vul_name);
      });
      return list;
    },
    selectedVuln() {
      if (!this.selectedKey) return null;
      return this.filteredVulns.find(v => v._key === this.selectedKey) || null;
    },
    panelVulns() {
      if (!this.selectedKey) return [];
      const vuln = this.filteredVulns.find(v => v._key === this.selectedKey);
      return vuln ? [vuln] : [];
    },
    canAutomate() {
      return [
        'Detect affected services and versions across listed assets',
        'Apply network-level controls where appropriate (firewall rules)',
        'Run post-remediation verification scans from the scanner',
      ];
    },
    mustManual() {
      return [
        'Validate business impact before applying patches in production',
        'Coordinate maintenance window and application owner sign-off',
        'Review remediation steps for environment-specific configuration',
      ];
    },
    recommendedText() {
      return 'Use automation for detection and verification where possible. Perform configuration changes and patching manually per the remediation timeline, with staging validation first.';
    },
  },
  watch: {
    filteredVulns(list) {
      if (!list.length) {
        this.selectedKey = null;
        this.expandedVulnIndex = null;
        return;
      }
      const idx = list.findIndex(v => v._key === this.selectedKey);
      if (idx === -1) {
        this.selectVulnFromList(list[0]);
      }
    },
  },
  async mounted() {
    await Promise.all([this.loadVulnerabilities(), this.loadHeldAssets()]);
  },
  methods: {
    getHeldPrioritySeverity(held) {
      const s = held?.severity_counts || {};
      if ((s.critical ?? 0) > 0) return 'Critical';
      if ((s.high ?? 0) > 0) return 'High';
      if ((s.medium ?? 0) > 0) return 'Medium';
      if ((s.low ?? 0) > 0) return 'Low';
      return '';
    },
    getSelectedVulnItems() {
      return this.filteredVulns.filter(v => v.selected);
    },
    collectAssetIpsFromVulns(vulns) {
      const ips = new Set();
      vulns.forEach(v => {
        (v.assets || []).forEach(ip => {
          if (ip) ips.add(String(ip).trim());
        });
      });
      return [...ips];
    },
    clearVulnSelections() {
      this.groupedVulns.forEach(v => { v.selected = false; });
    },
    showModal(id) {
      const el = document.getElementById(id);
      if (el && typeof bootstrap !== 'undefined') {
        bootstrap.Modal.getOrCreateInstance(el).show();
      }
    },
    handleDeleteClick() {
      if (this.activeAction === 'hold') return;
      this.activeAction = 'delete';
      if (!this.showCheckboxes) {
        this.showCheckboxes = true;
        return;
      }
      const selected = this.getSelectedVulnItems();
      if (selected.length > 0) {
        this.showModal('avDeleteModal');
      } else {
        this.showCheckboxes = false;
        this.resetActions();
      }
    },
    cancelDelete() {
      this.clearVulnSelections();
      this.showCheckboxes = false;
      this.resetActions();
    },
    async confirmDelete() {
      const ips = this.collectAssetIpsFromVulns(this.getSelectedVulnItems());
      if (!ips.length) {
        this.cancelDelete();
        return;
      }
      const reportId = this.isUser ? this.authStore.userLatestReportId : this.authStore.latestReportId;
      for (const ip of ips) {
        if (this.isUser) {
          if (!reportId) continue;
          await this.authStore.deleteUserAsset(ip, reportId);
        } else {
          await this.authStore.deleteAsset(ip);
        }
      }
      await this.reloadAfterAssetActions();
      this.showCheckboxes = false;
      this.resetActions();
    },
    toggleHoldMode() {
      if (this.activeAction === 'delete') return;
      this.activeAction = 'hold';
      if (this.showHoldCheckboxes) {
        const selected = this.getSelectedVulnItems();
        if (selected.length > 0) {
          this.showModal('avHoldConfirmModal');
        } else {
          this.showHoldCheckboxes = false;
          this.resetActions();
        }
        return;
      }
      this.showHoldCheckboxes = true;
    },
    cancelHold() {
      this.clearVulnSelections();
      this.showHoldCheckboxes = false;
      this.resetActions();
    },
    async confirmHold() {
      const ips = this.collectAssetIpsFromVulns(this.getSelectedVulnItems());
      if (!ips.length) {
        this.cancelHold();
        return;
      }
      for (const ip of ips) {
        const res = this.isUser
          ? await this.authStore.holdUserAsset(ip)
          : await this.authStore.holdAsset(ip);
        if (!res?.status) continue;
        if (!this.isUser && res.heldAsset) {
          const a = res.heldAsset;
          const exists = this.heldAssets.some(h => h.asset === a.asset);
          if (!exists) {
            this.heldAssets.push({
              asset: a.asset,
              ip: a.asset,
              member_type: a.member_type,
              severity_counts: a.severity_counts,
              host_information: a.host_information,
              selected: false,
            });
          }
          const idx = this.authStore.assetRows?.findIndex(x => x.asset === ip);
          if (idx !== undefined && idx !== -1) {
            this.authStore.assetRows.splice(idx, 1);
          }
        }
      }
      await this.reloadAfterAssetActions();
      this.showHoldCheckboxes = false;
      this.resetActions();
    },
    async toggleUnholdMode() {
      if (this.activeAction === 'hold' || this.activeAction === 'delete') return;
      this.activeAction = 'unhold';
      if (!this.showUnholdCheckboxes) {
        this.showUnholdCheckboxes = true;
        return;
      }
      const selected = this.heldAssets.filter(a => a.selected);
      if (!selected.length) {
        this.resetActions();
        return;
      }
      for (const item of selected) {
        const ip = item.asset || item.ip;
        const res = this.isUser
          ? await this.authStore.unholdUserAsset(ip)
          : await this.authStore.unholdAsset(ip);
        if (!res?.status) continue;
        if (!this.isUser && res.restoredAsset) {
          const a = res.restoredAsset;
          this.authStore.assetRows?.unshift({
            asset: a.asset,
            name: a.host_information?.['DNS Name'] || '',
            severity_counts: a.severity_counts,
            host_information: a.host_information,
            isInternal: true,
            held: false,
            selected: false,
          });
        }
      }
      await this.reloadAfterAssetActions();
      this.resetActions();
    },
    resetActions() {
      this.showCheckboxes = false;
      this.showHoldCheckboxes = false;
      this.showUnholdCheckboxes = false;
      this.activeAction = '';
      this.clearVulnSelections();
      this.heldAssets.forEach(a => { a.selected = false; });
    },
    async loadHeldAssets() {
      const res = this.isUser
        ? await this.authStore.fetchUserHeldAssets(true)
        : await this.authStore.fetchHeldAssets();
      if (res.status && res.assets?.length) {
        this.heldAssets = res.assets.map(a => ({
          asset: a.asset,
          ip: a.asset,
          member_type: a.member_type,
          name: a.host_information?.['DNS Name'] || '',
          severity_counts: a.severity_counts,
          host_information: a.host_information,
          selected: false,
        }));
        this.showHeld = true;
        if (!this.isUser && Array.isArray(this.authStore.assetRows)) {
          this.authStore.assetRows = this.authStore.assetRows.filter(
            a => !this.heldAssets.some(h => h.asset === a.asset),
          );
        }
      } else {
        this.showHeld = false;
        this.heldAssets = [];
      }
    },
    async reloadAfterAssetActions() {
      if (this.isUser) {
        await this.authStore.fetchUserAssets(true);
      } else {
        await this.authStore.fetchAssets(true);
      }
      await this.loadVulnerabilities();
      await this.loadHeldAssets();
    },
    async loadVulnerabilities() {
      this.loading = true;
      if (this.isUser) {
        await this.authStore.fetchUserVulnerabilityRegister(true);
      } else {
        await this.authStore.fetchVulnerabilityRegister(true);
      }
      this.loading = false;
      if (this.filteredVulns.length) {
        this.selectVulnFromList(this.filteredVulns[0]);
      }
    },
    canonSeverity(sev) {
      const s = String(sev || '').trim().toLowerCase();
      if (s === 'critical') return 'Critical';
      if (s === 'high') return 'High';
      if (s === 'medium') return 'Medium';
      if (s === 'low') return 'Low';
      const raw = String(sev || '').trim();
      return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    },
    setSeverityFilter(type) {
      this.expandedVulnIndex = null;
      if (type === 'All') {
        this.activeFilters = ['All'];
        return;
      }
      const filters = this.activeFilters.filter(f => f !== 'All');
      const idx = filters.indexOf(type);
      if (idx === -1) {
        filters.push(type);
      } else {
        filters.splice(idx, 1);
      }
      this.activeFilters = filters.length === 0 ? ['All'] : filters;
    },
    toggleStatusTab(status) {
      this.expandedVulnIndex = null;
      if (status === 'all') {
        this.statusFilter = [];
        return;
      }
      const idx = this.statusFilter.indexOf(status);
      if (idx === -1) {
        this.statusFilter.push(status);
      } else {
        this.statusFilter.splice(idx, 1);
      }
    },
    panelVulnDemoIndex(v) {
      const idx = this.filteredVulns.findIndex(x => x._key === v._key);
      return idx >= 0 ? idx % 3 : 0;
    },
    selectVulnFromList(item) {
      if (this.showCheckboxes || this.showHoldCheckboxes) return;
      const idx = this.filteredVulns.findIndex(v => v._key === item._key);
      if (idx < 0) return;
      this.selectedKey = item._key;
      this.expandedVulnIndex = null;
      this.currentVulnTab = 'auto';
      this.activeDetailTab = 'vulnerabilities';
      this.supportRequestsForVuln = [];
      this.supportRequestCount = 0;
      this.$nextTick(() => this.scrollToAccordion(item._key));
    },
    openSupportRequestModal(req) {
      this.selectedSupportRequest = req;
    },
    async refreshSupportRequestsForVuln() {
      const vuln = this.selectedVuln;
      if (!vuln?.assets?.length) {
        this.supportRequestsForVuln = [];
        this.supportRequestCount = 0;
        return;
      }
      this.loadingSupportRequests = true;
      const targetName = String(vuln.vul_name || '').trim().toLowerCase();
      const seen = new Set();
      const merged = [];
      for (const host of vuln.assets) {
        const res = this.isUser
          ? await this.authStore.getUserSupportRequestsByHost(host)
          : await this.authStore.getSupportRequestsByHost(host);
        if (!res.status || !Array.isArray(res.data)) continue;
        for (const req of res.data) {
          const id = req._id || req.id || `${host}-${req.vul_name}-${req.requested_at}`;
          if (seen.has(id)) continue;
          const reqName = String(req.vul_name || '').trim().toLowerCase();
          if (targetName && reqName && reqName !== targetName) continue;
          seen.add(id);
          merged.push({ ...req, host_name: req.host_name || host });
        }
      }
      this.supportRequestsForVuln = merged;
      this.supportRequestCount = merged.length;
      this.loadingSupportRequests = false;
    },
    async onSupportRequestsTabClick() {
      this.activeDetailTab = 'exceptions';
      await this.refreshSupportRequestsForVuln();
    },
    toggleAccordion(index) {
      const isOpening = this.expandedVulnIndex !== index;
      this.expandedVulnIndex = this.expandedVulnIndex === index ? null : index;
      const item = this.panelVulns[index];
      if (item) {
        this.selectedKey = item._key;
      }
      if (isOpening && item) {
        this.$nextTick(() => this.scrollToAccordion(item._key));
      }
    },
    scrollToAccordion(refKey) {
      const element = this.$refs['vuln-' + refKey];
      const el = Array.isArray(element) ? element[0] : element;
      if (el?.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },
    setVulnDetailTab(tab) {
      this.currentVulnTab = tab;
    },
    getStatusLabel(status) {
      const normalized = String(status || '').toLowerCase();
      if (normalized === 'closed' || normalized === 'resolved') return 'Closed';
      return 'Open';
    },
    getStatusBadgeClass(status) {
      return this.getStatusLabel(status) === 'Closed' ? 'status-closed-badge' : 'status-open-badge';
    },
    getStatusDotClass(status) {
      return this.getStatusLabel(status) === 'Closed' ? 'status-dot-closed' : 'status-dot-open';
    },
    getVulnTeamLabel(assignedTeam, vulnName) {
      // 1st priority: use real assigned_team from API data
      const t = String(assignedTeam || '').trim();
      if (t) return t;
      // 2nd priority: keyword fallback from vulnerability name
      const n = String(vulnName || '').toLowerCase();
      if (/inject|xss|csrf|cross.site|sql|rce|buffer.overflow|deseri|privilege|ldap|xxe|ssrf|code.execut|authentication|session.hijack/.test(n))
        return 'Architectural Flaws';
      if (/deprecat|outdated|end.of.life|eol|obsolete|unsupported/.test(n))
        return 'Patch Management';
      if (/missing|hsts|header|cors|cookie|misconfigur|config|default.password|weak.password|policy|setting/.test(n))
        return 'Configuration Management';
      if (/tls|ssl|protocol|cipher|encrypt|certif|port|network|dns|smtp|ftp|firewall|vpn/.test(n))
        return 'Network Security';
      return 'Patch Management';
    },
    getVulnTeamChipClass(assignedTeam, vulnName) {
      const team = this.getVulnTeamLabel(assignedTeam, vulnName);
      if (team === 'Architectural Flaws')      return 'rt-team-chip rt-team-architectural';
      if (team === 'Network Security')         return 'rt-team-chip rt-team-network';
      if (team === 'Configuration Management') return 'rt-team-chip rt-team-configuration';
      if (team === 'Patch Management')         return 'rt-team-chip rt-team-patch';
      return 'rt-team-chip rt-team-default';
    },
    isDescriptionExpanded(key) {
      return !!this.expandedDescriptions[key];
    },
    toggleDescription(key) {
      this.expandedDescriptions = {
        ...this.expandedDescriptions,
        [key]: !this.expandedDescriptions[key],
      };
    },
    getDisplayDescription(description, key) {
      const fullText = this.cleanText(description) || 'No description available for this vulnerability.';
      if (this.isDescriptionExpanded(key) || fullText.length <= this.descriptionPreviewLimit) {
        return fullText;
      }
      return `${fullText.slice(0, this.descriptionPreviewLimit).trimEnd()}...`;
    },
    isVulnAutomationNo(v, index) {
      return isAutomationNotAvailable(v.assets?.[0], index % 3, v.severity);
    },
    openPythonGuide(v) {
      this.pythonGuideSeverity = v?.severity || 'Medium';
      this.showPythonModal = true;
    },
    openPythonGuideFromAlert() {
      this.openPythonGuide(this.selectedVuln || { severity: 'Medium' });
    },
    affectedAssetsTableRowsFor(vuln) {
      if (!vuln) return [];
      const ips = [...new Set((vuln.assets || []).filter(Boolean))];
      if (!ips.length) return [];
      const mockByIp = Object.fromEntries(this.affectedAssetsData.map(a => [a.ip, a]));
      return ips.map(ip => {
        if (mockByIp[ip]) return mockByIp[ip];
        return {
          ip,
          status: 'Pending',
          statusClass: 'status-pending',
          stepsCompleted: 0,
          totalSteps: 4,
          progress: 0,
        };
      });
    },
    cleanText(text) {
      if (!text) return '';
      return String(text)
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .trim();
    },
    sevClass(sev) {
      const s = String(sev || '').toLowerCase();
      if (s === 'critical') return 'sev-c';
      if (s === 'high') return 'sev-h';
      if (s === 'medium') return 'sev-m';
      return 'sev-l';
    },
    statusLabel(status) {
      const n = String(status || 'open').toLowerCase();
      if (n === 'closed' || n === 'resolved') return 'Closed';
      if (n === 'overdue') return 'Overdue';
      return 'Open';
    },
    statusClass(status) {
      const n = String(status || 'open').toLowerCase();
      if (n === 'closed' || n === 'resolved') return 'status-open';
      if (n === 'overdue') return 'status-overdue';
      return 'status-open';
    },
    statusDetailClass(status) {
      const n = String(status || 'open').toLowerCase();
      if (n === 'closed' || n === 'resolved') return 'ds-open';
      return 'ds-overdue';
    },
    assetMetaFor(vuln, asset) {
      const row = vuln?.rows?.find(r => (r.asset || r.host_name) === asset) || {};
      const port = row.port || row.service_port || row.protocol_port || '';
      const os = row.operating_system || row.os || row.platform || 'Linux';
      return { port, os };
    },
    sendForVerification(asset) {
      if (asset.stepsCompleted < asset.totalSteps) return;
      Swal.fire({
        icon: 'info',
        title: 'Verification request',
        text: `Remediation for ${asset.ip} will be sent for verification. You will be notified once it is reviewed.`,
        confirmButtonText: 'OK',
      });
      asset.status = 'Under Verification';
      asset.statusClass = 'status-verification';
    },
    copyCodeToClipboard() {
      navigator.clipboard.writeText(this.automationCode).then(() => {
        this.codeCopied = true;
        setTimeout(() => {
          this.codeCopied = false;
        }, 2000);
      });
    },
    downloadAutomationScript() {
      const blob = new Blob([this.automationCode], { type: 'text/x-python' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'automation_script.py';
      a.click();
      URL.revokeObjectURL(url);
    },
  },
};
</script>

<style scoped>
.av-mode-root {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1;
  align-items: stretch;
  overflow: hidden;
}

.av-left {
  width: 33%;
  min-width: 300px;
  max-width: 380px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  align-self: stretch;
  flex-shrink: 0;
}

.av-left-header {
  padding: 12px 14px 10px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.av-left-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.av-count-badge,
.assets-count-badge {
  font-size: 0.68rem;
  font-weight: 700;
  background: #f1f5f9;
  border-radius: 20px;
  padding: 2px 10px;
  color: #475569;
}

.av-left .action-icon {
  font-size: 0.95rem;
  cursor: pointer;
  color: #64748b;
  transition: color 0.15s;
}

.av-left .action-icon:hover {
  color: #241447;
}

.av-left .mitigation-hold-section {
  flex-shrink: 0;
  background: #f2f3f6;
  padding: 14px 16px;
  border-top: 1px solid rgba(203, 196, 208, 0.2);
  max-height: 220px;
  overflow-y: auto;
}

.av-left .mitigation-hold-section::-webkit-scrollbar {
  width: 3px;
}

.av-left .mitigation-hold-section::-webkit-scrollbar-thumb {
  background: #cbc4d0;
  border-radius: 10px;
}

.av-left .hold-title {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin: 0;
}

.av-left .hold-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 9px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border-left: 3px solid #7a7580;
}

.av-left .hold-ip {
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
}

.av-left .hold-sub {
  font-size: 0.62rem;
  color: #64748b;
  margin: 0;
}

.av-filter-pills {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.av-pill {
  border: none;
  border-radius: 50px;
  padding: 5px 14px;
  font-size: 0.68rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.av-pill-inactive {
  background: #f2f3f6;
  color: #49454f;
}

.av-pill-inactive:hover {
  background: #e7e8eb;
}

.av-pill-all {
  background: #241447;
  color: #fff;
}

.av-pill-critical {
  background: #f8dede !important;
  color: #b42318 !important;
}

.av-pill-high {
  background: #fee2e2 !important;
  color: #dc2626 !important;
}

.av-pill-medium {
  background: #f7e4bf;
  color: #f59e0b;
}

.av-pill-low {
  background: #cfead8;
  color: #1f7a57;
}

.av-search-box { position: relative; }

.av-search-icon {
  position: absolute;
  left: 9px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: #94a3b8;
}

.av-search-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  padding: 7px 10px 7px 30px;
  font-size: 0.75rem;
  color: #1e293b;
  background: #f8fafc;
  outline: none;
}

.av-search-input:focus {
  border-color: #94a3b8;
  background: #fff;
}

.av-vuln-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 6px 0;
}

.av-vuln-item {
  padding: 11px 16px;
  cursor: pointer;
  border-left: 3px solid transparent;
  border-bottom: 1px solid #f8fafc;
  transition: all 0.15s;
}

.av-vuln-item:hover {
  background: #f8fafc;
  border-left-color: #cbd5e1;
}

.av-vuln-item.active {
  background: #f0fdf4;
  border-left-color: #10b981;
}

.av-vi-top {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.av-vi-id {
  font-size: 0.62rem;
  font-weight: 700;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 1px 6px;
  color: #475569;
  font-family: monospace;
}

.av-vi-sev {
  font-size: 0.56rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 3px;
}

.sev-c, .av-vi-sev.sev-c { background: #f8dede !important; color: #b42318 !important; }
.sev-h, .av-vi-sev.sev-h { background: #fee2e2 !important; color: #dc2626 !important; }
.sev-m, .av-vi-sev.sev-m { background: #fef3c7 !important; color: #f59e0b !important; }
.sev-l, .av-vi-sev.sev-l { background: #ccfbf1 !important; color: #0f766e !important; }

.av-vi-status {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
}

.status-overdue { background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }
.status-open { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }

.av-vi-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.3;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.av-vi-meta {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}

.av-vi-cve {
  font-size: 0.62rem;
  font-family: monospace;
  color: #6366f1;
  background: #f5f3ff;
  padding: 1px 5px;
  border-radius: 3px;
}

.av-vi-hosts {
  font-size: 0.62rem;
  color: #64748b;
}

.av-loading,
.av-empty-list {
  padding: 24px 16px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.8rem;
}

.av-right,
.av-right.assets-right-panel {
  flex: 1;
  min-width: 0;
  align-self: stretch;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f9fc;
  overflow: hidden;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* .av-right uses .assets-right-panel — header/scroll spacing in main.css */

.av-right-inner {
  max-width: 100%;
}

.asset-detail-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.3;
  margin: 0;
}

.av-empty-threats {
  font-size: 0.8rem;
  color: #94a3b8;
  padding: 8px 0 16px;
  margin: 0;
}

.av-empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  padding: 24px;
  text-align: center;
}

.av-empty-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  opacity: 0.4;
}

.av-empty-text {
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 0 4px;
}

.av-empty-sub {
  font-size: 0.75rem;
  margin: 0;
  max-width: 320px;
}

.av-detail {
  display: flex;
  flex-direction: column;
  min-height: min-content;
  height: auto;
  flex: 0 0 auto;
}

.av-detail-header {
  background: #fff;
  padding: 18px 22px 14px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.av-dh-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.av-dh-id {
  font-size: 0.75rem;
  font-weight: 700;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  color: #475569;
  font-family: monospace;
}

.av-detail-sev {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.av-detail-sev.sev-c { background: #f8dede !important; color: #b42318 !important; }
.av-detail-sev.sev-h { background: #fee2e2 !important; color: #dc2626 !important; }
.av-detail-sev.sev-m { background: #fef3c7 !important; color: #f59e0b !important; }
.av-detail-sev.sev-l { background: #ccfbf1 !important; color: #0f766e !important; }

.av-detail-status {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
  text-transform: uppercase;
}

.ds-overdue { background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; }
.ds-open { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }

.av-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.av-dh-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.3;
  margin: 0;
  flex: 1;
  min-width: 200px;
}

.av-description-block {
  background: #fff;
  padding: 14px 22px;
  border-bottom: 1px solid #f1f5f9;
}

.av-db-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 6px;
}

.av-db-text {
  font-size: 13px;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #374151;
  line-height: 1.65;
  margin: 0;
  white-space: pre-line;
}

.av-read-more {
  background: transparent;
  border: none;
  padding: 0;
  margin-top: 4px;
  color: #0f696e;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.av-affected-block {
  background: #fff;
  padding: 10px 22px 14px;
  border-bottom: 1px solid #e2e8f0;
}

.av-aab-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 6px;
}

.av-aab-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.av-asset-chip {
  font-size: 0.75rem;
  font-family: monospace;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #86efac;
  border-radius: 5px;
  padding: 3px 10px;
  font-weight: 500;
}

.av-detail-tabs {
  display: flex;
  background: #fff;
  padding: 0 22px;
  border-bottom: 2px solid #e2e8f0;
  flex-shrink: 0;
}

.av-dtab {
  padding: 12px 16px;
  border: none;
  background: transparent;
  font-size: 0.8rem;
  font-weight: 400;
  color: #64748b;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  margin-bottom: -2px;
}

.av-dtab.active {
  color: #0f172a;
  border-bottom-color: #0f172a;
}

.av-dtab:hover:not(.active) {
  color: #1e293b;
  background: #f8fafc;
}

.av-detail-tab-content {
  padding: 14px 20px 28px;
  flex: 0 0 auto;
  min-height: 0;
  height: auto;
  background: #f8fafc;
  box-sizing: border-box;
}

.av-detail-tab-content:has(.av-auto-tab) {
  padding: 14px 20px 28px;
}

.av-detail-tab-content:has(.av-auto-tab) .av-auto-tab {
  padding: 0;
  min-height: 0;
  height: auto;
}

.av-detail-tab-content:has(.av-manual-tab),
.av-detail-tab-content:has(.av-affected-tab) {
  padding: 14px 20px 28px;
}

.av-detail-tab-content:has(.av-manual-tab) .av-manual-tab,
.av-detail-tab-content:has(.av-auto-tab) .av-auto-tab,
.av-detail-tab-content:has(.av-affected-tab) .av-affected-tab {
  padding: 0;
  min-height: 0;
  height: auto;
}

.av-detail-tab-content:has(.av-manual-tab) .av-asset-section:last-child {
  margin-bottom: 0;
}

.av-assess-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px 18px;
  margin-bottom: 14px;
}

.av-assess-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.av-assess-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.av-assess-sub {
  font-size: 0.68rem;
  color: #94a3b8;
}

.av-feas-badge {
  border: 1px solid;
  border-radius: 8px;
  padding: 7px 12px;
  text-align: center;
  flex-shrink: 0;
}

.av-feas-level {
  font-size: 0.8rem;
  font-weight: 700;
  display: block;
  line-height: 1;
}

.av-feas-pct {
  font-size: 0.68rem;
  display: block;
  margin-top: 2px;
}

.av-progress-track {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}

.av-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s;
}

.av-assess-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 900px) {
  .av-assess-grid {
    grid-template-columns: 1fr;
  }
}

.av-assess-col {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px 14px;
  border: 1px solid #f1f5f9;
}

.col-head {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.green-head {
  background: #d1fae5;
  color: #065f46;
}
.red-head {
  background: #fee2e2;
  color: #991b1b;
}

.av-can-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.av-can-item,
.av-cant-item {
  display: flex;
  gap: 7px;
  font-size: 0.75rem;
  color: #374151;
  padding: 4px 0;
  line-height: 1.45;
  border-bottom: 1px solid #f8fafc;
}

.av-can-dot { color: #16a34a; font-weight: 700; flex-shrink: 0; width: 14px; }
.av-cant-dot { color: #dc2626; font-weight: 700; flex-shrink: 0; width: 14px; }

.av-action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 14px;
  justify-content: flex-end;
}

.av-btn-outline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border: 2px solid #0284c7;
  background: #fff;
  color: #0284c7;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.av-btn-outline:hover {
  background: #f0f9ff;
  border-color: #0369a1;
  color: #0369a1;
}

.av-btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border: none;
  background: #0c4a6e;
  color: #fff;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.av-btn-primary:hover {
  background: #075985;
}

.av-recommended-box {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px 14px;
}

.av-rec-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1e40af;
  margin-bottom: 6px;
}

.av-rec-text {
  font-size: 0.78rem;
  color: #1e3a8a;
  line-height: 1.5;
  margin: 0;
}

/* Code Modal */
.code-modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.code-modal-box { background: #fff; border-radius: 12px; width: 90%; max-width: 900px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
.code-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e5e7eb; }
.code-modal-title { font-size: 1rem; font-weight: 600; color: #1f2937; margin: 0; }
.code-modal-close { background: none; border: none; font-size: 1.2rem; color: #6b7280; cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: all 0.2s; }
.code-modal-close:hover { background: #f3f4f6; color: #1f2937; }
.code-modal-body { flex: 1; overflow: auto; padding: 0; position: relative; }
.code-header-badge { position: absolute; top: 12px; right: 12px; background: #1e293b; color: #94a3b8; padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; z-index: 1; }
.code-block { background: #1e293b; color: #e2e8f0; padding: 20px; margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 0.85rem; line-height: 1.6; overflow-x: auto; white-space: pre; }
.code-block::-webkit-scrollbar { height: 8px; }
.code-block::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
.code-modal-footer { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-top: 1px solid #e5e7eb; background: #f9fafb; }
.code-copy-btn { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #0ea5e9; color: #fff; border: none; border-radius: 6px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.code-copy-btn:hover { background: #0284c7; }
.code-close-btn { padding: 8px 16px; background: #fff; color: #6b7280; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.code-close-btn:hover { background: #f9fafb; color: #1f2937; }

.av-manual-tab {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.av-manual-global-error,
.av-asset-error {
  font-size: 0.78rem;
  color: #991b1b;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 10px;
}

.av-no-steps {
  font-size: 0.78rem;
  color: #64748b;
  margin: 0 0 8px;
}

.av-asset-section {
  margin-bottom: 20px;
}

.av-asset-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.av-asset-ip-badge {
  font-family: monospace;
  font-size: 0.82rem;
  font-weight: 700;
  background: #0f172a;
  color: #fff;
  padding: 3px 10px;
  border-radius: 5px;
}

.av-asset-port {
  font-family: monospace;
  font-size: 0.75rem;
  color: #64748b;
}

.av-asset-os-lbl {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #94a3b8;
}

.av-step-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  margin-bottom: 10px;
  overflow: hidden;
}

.av-step-head {
  background: #f8fafc;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}

.av-step-head:hover {
  background: #f1f5f9;
}

.av-step-card-open .av-step-head {
  border-bottom-color: #f1f5f9;
}

.av-step-chevron {
  flex-shrink: 0;
  font-size: 0.85rem;
  color: #64748b;
  margin-left: auto;
}

.av-step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #0f172a;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.av-step-title {
  font-size: 0.82rem;
  font-weight: 600;
  flex: 1;
  color: #1e293b;
}

.av-step-content {
  padding: 12px 14px;
}

.av-field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;
}

.av-field-grid-bottom {
  margin-top: 10px;
  margin-bottom: 0;
}

@media (max-width: 700px) {
  .av-field-grid {
    grid-template-columns: 1fr;
  }
}

.av-field {
  background: #f8fafc;
  border-radius: 6px;
  padding: 7px 10px;
  border: 1px solid #f1f5f9;
}

.av-field-full {
  grid-column: 1 / -1;
}

.av-fl {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.av-fv {
  font-size: 0.75rem;
  color: #1e293b;
  line-height: 1.5;
}

.av-fv-mono {
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.68rem;
  color: #4c1d95;
}

.av-fv-pretext {
  white-space: pre-line;
}

.av-cmd-wrap {
  margin-bottom: 10px;
}

.av-cmd-lbl {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.av-cmd-block {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #0f172a;
  border-radius: 7px;
  padding: 10px 14px;
}

.av-cmd-pre {
  flex: 1;
  background: transparent;
  color: #e2e8f0;
  padding: 0;
  overflow-x: auto;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.68rem;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}

.av-cmd-pre code {
  font-family: inherit;
  color: inherit;
}

.av-filepath-wrap {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.av-filepath-text {
  flex: 1;
  padding-right: 4px;
  word-break: break-all;
}

.av-field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 2px;
}

.av-copy-icon-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 2px 4px;
  cursor: pointer;
  line-height: 1;
  transition: opacity 0.15s, color 0.15s;
}

.av-copy-icon-path {
  color: #7c3aed;
  font-size: 0.9rem;
}

.av-copy-icon-path:hover {
  color: #5b21b6;
}

.av-copy-icon-cmd {
  color: #94a3b8;
  font-size: 0.95rem;
  margin-top: 2px;
}

.av-copy-icon-cmd:hover {
  color: #e2e8f0;
}

.av-copy-icon-verify {
  color: #64748b;
  font-size: 0.85rem;
}

.av-copy-icon-verify:hover {
  color: #334155;
}

.av-tools-row {
  margin-top: 10px;
  margin-bottom: 10px;
}

.av-tools-fl {
  margin-bottom: 4px;
}

.av-tool-pill {
  display: inline-block;
  font-size: 0.68rem;
  font-family: monospace;
  padding: 2px 7px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  margin: 2px 3px 2px 0;
}

.av-consideration {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 9px 12px;
}

.av-consideration-text {
  margin-top: 4px;
  font-size: 0.75rem;
  color: #92400e;
  line-height: 1.55;
  white-space: pre-line;
}

/* Affected Assets tab — table rows (register-style) */
.av-affected-tab {
  padding: 0;
}

.av-assets-table-card {
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(203, 196, 208, 0.25);
}

.av-assets-table {
  width: 100%;
  border-collapse: collapse;
}

.av-assets-table thead tr {
  background: #f2f3f6;
}

.av-assets-table thead th {
  padding: 14px 20px;
  font-size: 11px;
  font-weight: 700;
  color: #241447;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: left;
  border: none;
  white-space: nowrap;
}

.av-assets-table tbody tr {
  border-top: 1px solid rgba(203, 196, 208, 0.15);
  transition: background 0.15s;
}

.av-assets-table tbody tr:hover {
  background: #f8f9fc;
}

.av-assets-table tbody td {
  padding: 14px 20px;
  font-size: 13px;
  color: #191c1e;
  vertical-align: middle;
  border: none;
}

.av-assets-ip {
  font-weight: 600;
  font-family: ui-monospace, 'Courier New', monospace;
  color: #241447;
}

.av-assets-steps-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
}

.av-assets-progress-track {
  flex: 1;
  min-width: 100px;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.av-assets-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #16a34a 0%, #22c55e 100%);
  border-radius: 999px;
  transition: width 0.25s ease;
}

.av-assets-steps-text {
  font-size: 12px;
  font-weight: 700;
  color: #0f696e;
  white-space: nowrap;
}

.av-assets-verify-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 999px;
  border: 1px solid #0f696e;
  background: #ffffff;
  color: #0f696e;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
}

.av-assets-verify-btn:hover:not(:disabled) {
  background: #f0fdfa;
  color: #0d5a5e;
}

.av-assets-verify-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  border-color: #cbd5e1;
  color: #94a3b8;
}

.av-assets-empty {
  text-align: center;
  color: #64748b;
  padding: 28px 20px !important;
}

.av-assets-table-footer {
  padding: 12px 20px;
  font-size: 12px;
  color: #64748b;
  border-top: 1px solid rgba(203, 196, 208, 0.15);
  background: #ffffff;
}

/* legacy affected-asset card styles (unused) */
.av-affected-tab-legacy {
  padding: 20px;
}

.affected-asset-card {
  background: #020617;
  border: 1px solid #1f2937;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.affected-asset-card:hover {
  box-shadow: 0 6px 20px rgba(90, 68, 255, 0.15);
  border-color: rgba(90, 68, 255, 0.3);
}

.affected-asset-header {
  background: linear-gradient(135deg, rgb(90, 68, 255) 0%, #764ba2 100%);
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.affected-asset-ip {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

.affected-asset-status {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.status-progress {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid #fbbf24;
}

.status-pending {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.status-completed {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid #22c55e;
}

.status-verification {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.affected-asset-body {
  padding: 28px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  color: #9ca3af;
  font-size: 13px;
  margin-bottom: 6px;
  display: block;
  font-weight: 500;
}

.form-control {
  background: #020617;
  border: 1px solid #1f2937;
  color: #fff;
  height: 46px;
  border-radius: 10px;
  font-size: 0.9rem;
  padding: 0 14px;
  width: 100%;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;
}

.form-control::placeholder {
  color: #6b7280;
}

.form-control:focus {
  background: #020617;
  border-color: rgb(90, 68, 255);
  box-shadow: 0 0 0 3px rgba(90, 68, 255, 0.1);
  outline: none;
  color: #fff;
}

.steps-progress {
  background: #0f172a;
  padding: 18px;
  border-radius: 10px;
  border: 1px solid #1f2937;
}

.progress {
  height: 28px;
  background-color: #1f2937;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
  transition: width 0.4s ease;
}

.steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.steps-list li {
  padding: 12px 0;
  font-size: 0.85rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #1f2937;
  transition: all 0.2s;
}

.steps-list li:last-child {
  border-bottom: none;
}

.steps-list li.step-completed {
  color: #e5e7eb;
  font-weight: 500;
}

.steps-list li i {
  font-size: 1.1rem;
  flex-shrink: 0;
}

/* All Assets–style confirm modals (do not use global .btn-primary gradient here) */
.assets-action-modal .modal-body p {
  margin: 0;
}

.assets-action-modal .modal-footer {
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
}

.assets-action-modal .modal-footer .btn {
  width: auto;
  min-width: auto;
  height: auto;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  border-radius: 0.375rem;
  transform: none;
  box-shadow: none;
  display: inline-block;
}

.assets-hold-modal .modal-footer .btn-primary {
  background-color: #0d6efd;
  border: 1px solid #0d6efd;
  background-image: none;
  color: #fff;
}

.assets-hold-modal .modal-footer .btn-primary:hover {
  background-color: #0b5ed7;
  border-color: #0a58ca;
  transform: none;
  box-shadow: none;
}

.assets-hold-modal .modal-footer .btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
}

.assets-hold-modal .modal-footer .btn-secondary:hover {
  background-color: #5c636a;
  border-color: #565e64;
  color: #fff;
}

.assets-action-modal .modal-footer .btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: #fff;
}

.assets-action-modal .modal-footer .btn-danger:hover {
  background-color: #bb2d3b;
  border-color: #b02a37;
  color: #fff;
}

/* Match Assets tab list + accordion */
.asset-list-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 0;
}

.asset-item-new {
  padding: 10px 14px;
  border-bottom: 1px solid #f8fafc;
  border-left: 3px solid transparent;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.asset-item-new:hover {
  background: #f8fafc;
  border-left-color: #cbd5e1;
}

.asset-item-active {
  background: #f0fdf4;
  border-left-color: #10b981 !important;
}

.asset-item-active:hover {
  background: #f0fdf4;
}

.asset-item-top {
  margin-bottom: 3px;
}

.asset-ip {
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
}

.av-list-item-primary {
  margin-bottom: 6px;
}

.av-list-item-badges {
  margin-bottom: 6px;
}

.av-vuln-list-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  font-weight: 600;
  color: #0f172a;
}

.vuln-chip {
  font-size: 0.62rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.sev-badge {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 10px;
  border-radius: 4px;
  white-space: nowrap;
}

.sev-critical { background: #f8dede !important; color: #b42318 !important; }
.sev-high { background: #fee2e2 !important; color: #dc2626 !important; }
.sev-medium { background: #fef3c7 !important; color: #f59e0b !important; }
.sev-low { background: #ccfbf1 !important; color: #0f766e !important; }

.section-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin: 0;
}

.sev-pill {
  border-radius: 50px;
  padding: 5px 14px;
  font-size: 0.68rem;
  font-weight: 600;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.12);
  cursor: pointer;
  transition: all 0.15s;
}

.sev-pill:hover {
  background: #f2f3f6;
}

.sev-pill-active {
  background: #e0f2f1 !important;
  color: #0f696e !important;
  border-color: #0f696e !important;
  font-weight: 700;
}

.sev-pill-critical { color: #b42318 !important; background: #f8dede !important; }
.sev-pill-high { color: #dc2626 !important; background: #fee2e2 !important; }
.sev-pill-medium { color: #f59e0b !important; background: #fef3c7 !important; }
.sev-pill-low { color: #10b981; }
.sev-pill-critical.sev-pill-active {
  background: #f8dede !important;
  color: #b42318 !important;
  border-color: #b42318 !important;
}
.sev-pill-high.sev-pill-active {
  background: #fee2e2 !important;
  color: #dc2626 !important;
  border-color: #dc2626 !important;
}
.sev-pill-medium.sev-pill-active {
  background: #fef3c7 !important;
  color: #f59e0b !important;
  border-color: #f59e0b !important;
}
.sev-pill-low.sev-pill-active {
  background: #e0f2f1 !important;
  color: #10b981 !important;
  border-color: #10b981 !important;
}

.vuln-accordion-item {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(203, 196, 208, 0.25);
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  isolation: isolate;
}

.vuln-accordion-item--expanded {
  height: min(calc(100vh - 260px), 520px);
  max-height: min(calc(100vh - 260px), 520px);
  min-height: 280px;
}

.vuln-accordion-header {
  position: relative;
  z-index: 3;
  flex-shrink: 0;
  padding: 14px 16px;
  background-color: #f2f3f6 !important;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: 12px;
  z-index: 2;
}

.vuln-accordion-header:hover {
  background-color: #edeef1 !important;
}

.vuln-icon {
  font-size: 1rem;
}

.vuln-icon-critical { color: #b42318; }
.vuln-icon-high { color: #dc2626; }
.vuln-icon-medium { color: #f59e0b; }
.vuln-icon-low { color: #10b981; }

.vuln-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
}

.vuln-accordion-expand {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background: #fff;
  box-sizing: border-box;
  padding-bottom: 28px;
  scroll-padding-bottom: 28px;
}

.vuln-accordion-expand::-webkit-scrollbar {
  width: 6px;
}

.vuln-accordion-expand::-webkit-scrollbar-thumb {
  background: #cbc4d0;
  border-radius: 10px;
}

.vuln-accordion-body {
  padding: 14px 16px 20px;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.vuln-accordion-body .av-description-block {
  padding: 0 0 14px;
  border-bottom: 1px solid #e2e8f0;
  background: transparent;
}

.vuln-accordion-body .av-detail-tabs {
  margin-bottom: 0;
}

.vuln-accordion-body .av-detail-tab-content {
  padding-bottom: 28px !important;
}

.vuln-accordion-body .av-auto-tab {
  padding-bottom: 20px;
}

.status-open-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.status-dot-open {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #b42318;
  flex-shrink: 0;
}

.status-closed-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.status-dot-closed {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
  flex-shrink: 0;
}
</style>
