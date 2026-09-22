<template>
  <span
    v-if="display.tier !== 'hidden'"
    class="fix-available-btn"
    :class="'fix-available-btn--' + display.tier"
    :title="tooltip"
    :aria-label="labelText"
  >
    <span class="fix-available-label">{{ labelText }}</span>
    <span class="fix-available-icon-ring" aria-hidden="true">
      <i :class="iconClass"></i>
    </span>
  </span>
</template>

<script>
import { resolveAutomationDisplay, canonSeverity } from '@/utils/assetVulnerabilities';

export default {
  name: 'FixAvailableIndicator',
  props: {
    severity: { type: String, default: '' },
    assetIp: { type: String, default: '' },
    assetIndex: { type: Number, default: null },
    automationLevel: { type: String, default: '' },
    automationPct: { type: [String, Number], default: '' },
    automationMatched: { type: Boolean, default: null }, // from bulk API: true/false/null
    // Row-level automation_status from the register/report listing — the
    // authoritative signal whenever the caller wires it (both current call
    // sites always do, resolving it per-asset from the register row).
    // automationMatched/automationLevel come from a SEPARATE bulk
    // automation-cards fetch that's cached per-report and only ever
    // re-fetched once, at first load — a card regenerated afterwards (e.g.
    // automation_status flipping null → "full") never updates that cache,
    // so trusting it over a fresh automation_status re-introduces exactly
    // the stale-badge bug this prop exists to avoid ("NON AUTOMATABLE" shown
    // for vulnerabilities the register confirms are already "full").
    // automationMatched/automationLevel are only consulted as a fallback for
    // a caller that hasn't wired automationStatus at all (prop stays '').
    automationStatus: { type: String, default: '' },
  },
  computed: {
    display() {
      const status = String(this.automationStatus || '').trim().toLowerCase();
      if (status === 'full') return { tier: 'yes', label: 'Yes', pct: 100, barWidth: 100, displayPct: '100%' };
      if (status === 'not_possible') return { tier: 'no', label: 'No', pct: 0, barWidth: 100, displayPct: '0%' };
      if (status === 'partial') {
        return resolveAutomationDisplay('partial', this.automationPct, canonSeverity(this.severity), this.assetIp, this.assetIndex);
      }
      if (status === 'in_progress') return { tier: 'unknown', label: '', pct: null, barWidth: 0, displayPct: '' };
      // automationStatus prop not wired by this caller at all — fall back to
      // the older aiCard-match-driven signals.
      if (this.automationMatched === true)  return { tier: 'yes',     label: 'Yes',     pct: 100, barWidth: 100, displayPct: '100%' };
      if (this.automationMatched === false) return { tier: 'no',      label: 'No',      pct: 0,   barWidth: 100, displayPct: '0%'   };
      if (this.automationLevel || this.automationPct) {
        return resolveAutomationDisplay(
          this.automationLevel,
          this.automationPct,
          canonSeverity(this.severity),
          this.assetIp,
          this.assetIndex,
        );
      }
      return { tier: 'hidden', label: '', pct: null, barWidth: 0, displayPct: '' };
    },
    iconClass() {
      if (this.display.tier === 'yes')     return 'bi bi-check-lg';
      if (this.display.tier === 'no')      return 'bi bi-x-lg';
      if (this.display.tier === 'unknown') return 'bi bi-hourglass-split';
      return 'bi bi-exclamation-lg';
    },
    labelText() {
      if (this.display.tier === 'no')      return 'Non automatable';
      if (this.display.tier === 'partial') return 'Partial automatable';
      if (this.display.tier === 'unknown') return 'In Progress';
      return 'Automatable';
    },
    tooltip() {
      if (this.display.tier === 'yes')     return 'Automatable — full automation';
      if (this.display.tier === 'no')      return 'Non automatable — manual only';
      if (this.display.tier === 'unknown') return 'Automation Script: In Progress — still being generated';
      return 'Partial automatable';
    },
  },
};
</script>

<style scoped>
.fix-available-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 28px;
  padding: 0 8px 0 10px;
  border-radius: 999px;
  flex-shrink: 0;
  border: 1px solid transparent;
  line-height: 1;
  cursor: default;
  white-space: nowrap;
  background: #f8fafc;
}

.fix-available-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.fix-available-icon-ring {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
}

.fix-available-btn--yes {
  border-color: #86efac;
  color: #16a34a;
}

.fix-available-btn--yes .fix-available-icon-ring {
  background: #16a34a;
  color: #ffffff;
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.2);
}

.fix-available-btn--partial {
  border-color: #fde68a;
  color: #d97706;
}

.fix-available-btn--partial .fix-available-icon-ring {
  background: #d97706;
  color: #ffffff;
  box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2);
}

.fix-available-btn--no {
  border-color: #fca5a5;
  color: #dc2626;
}

.fix-available-btn--no .fix-available-icon-ring {
  background: #dc2626;
  color: #ffffff;
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
}

.fix-available-btn--unknown {
  border-color: #cbd5e1;
  color: #94a3b8;
}

.fix-available-btn--unknown .fix-available-icon-ring {
  background: #e2e8f0;
  color: #94a3b8;
}
</style>
