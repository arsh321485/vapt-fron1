<template>
  <div class="vp-new">
    <header class="hero">
      <div class="wrap">
        <div v-if="notice" class="return-note">{{ notice }}</div>
        <div v-if="error" class="return-note is-error">{{ error }}</div>
        <div v-if="overCeiling" class="return-note">
          This report has more than 250 assets. Custom checkout is still required for this account.
          <button type="button" class="note-link" @click="$emit('custom')">Continue with Custom</button>
        </div>
        <div class="pill"><b></b> Simple, transparent pricing</div>
        <h1>Every vulnerability fixed.<br><span>Every risk closed.</span></h1>
        <p class="lead">Start free for 30 days. Already have reports? Management Only is a flat $300 for 3 months. Need VAPTFIX to test for you? Choose Management + Testing.</p>
        <div class="hero-cta">
          <a href="#calculator" class="btn btn-grad">Calculate my price <span class="arrow">→</span></a>
          <a href="#plans" class="btn btn-ghost">See plans</a>
        </div>
        <div class="trust"><span>No credit card for Freemium</span><span>Slack &amp; Teams native</span><span>Multiple report uploads</span></div>
      </div>
    </header>

    <section id="plans">
      <div class="wrap">
        <div class="plans">
          <div class="card plan">
            <h3>Freemium</h3>
            <p class="tag">Try VAPTFIX with your team</p>
            <div class="price"><b>$0</b><small>free for 30 days</small></div>
            <div class="mini">
              <div><b>5 IPs</b><span>only</span></div>
              <div><b>&lt; 1 MB</b><span>per report upload</span></div>
            </div>
            <button type="button" class="btn btn-dark" :disabled="freemiumLocked || checkoutLoading" @click="$emit('freemium')">
              {{ freemiumLocked ? 'Premium required' : 'Get started free' }} <span class="arrow">→</span>
            </button>
            <p class="divider">What's included</p>
            <ul class="feat">
              <li><span class="ck">✓</span>5 IPs only</li>
              <li><span class="ck">✓</span>Report upload, each file less than 1 MB</li>
              <li><span class="ck">✓</span>Straight to Slack or Teams, no web client needed</li>
              <li><span class="ck">✓</span>Up to 3 team members</li>
              <li><span class="ck">✓</span>All 4 teams enabled</li>
              <li><span class="ck">✓</span>Upgrade any time, no re-upload needed</li>
              <li><span class="xx">✕</span>No testing / rescanning</li>
              <li><span class="xx">✕</span>No automation scripts</li>
            </ul>
          </div>

          <div class="card plan premium" :data-mode="premiumTab">
            <span class="badge">MOST POPULAR</span>
            <h3>Premium</h3>
            <p class="tag">Choose how you want to use VAPTFIX</p>
            <div class="ptoggle" role="tablist" aria-label="Premium mode">
              <span class="ptoggle-pill" aria-hidden="true"></span>
              <button type="button" data-mode="mgmt" :disabled="managementLocked" @click="setPremiumTab('mgmt')">📋 Management Only</button>
              <button type="button" data-mode="test" :disabled="testingLocked" @click="setPremiumTab('test')">🛡️ Management + Testing</button>
            </div>

            <div class="pm" data-panel="mgmt">
              <p class="pm-eyebrow">Management Only</p>
              <h4>I Already Have an Assessment Report</h4>
              <p class="pm-desc">Upload multiple existing assessment reports. VAPTFIX manages the rest, providing centralized dashboard visibility, vulnerability tracking, remediation management, and reporting.</p>
              <div class="price"><b>$300</b><small>flat platform fee<br>no per-asset charges</small></div>
              <div class="tiles">
                <div class="tile"><div class="ico">🗓️</div><div class="v">3 months</div><div class="nm">platform access</div></div>
                <div class="tile"><div class="ico">🖥️</div><div class="v">100</div><div class="nm">assets max</div></div>
                <div class="tile"><div class="ico">🐞</div><div class="v">1,000</div><div class="nm">vulnerabilities max</div></div>
              </div>
              <div class="flow">
                <div class="ok-box"><b>Under the limit?</b>Keep uploading reports until you reach 100 assets or 1,000 vulnerabilities.</div>
                <div class="warn-box"><b>Over the limit?</b>Upload the rest in your next 3-month period and pay $300 again.</div>
              </div>
              <p v-if="managementLocked" class="lock-note">Not available — you uploaded a scope file for testing.</p>
              <button type="button" class="btn" :disabled="managementLocked" @click="setMode('mgmt')">Choose Management Only <span class="arrow">→</span></button>
              <p class="divider">What's included</p>
              <ul class="feat feat-2">
                <li><span class="ck">✓</span>Multiple report uploads within limits</li>
                <li><span class="ck">✓</span>Centralized dashboard visibility</li>
                <li><span class="ck">✓</span>Vulnerability tracking</li>
                <li><span class="ck">✓</span>Remediation management</li>
                <li><span class="ck">✓</span>Severity &amp; risk prioritization</li>
                <li><span class="ck">✓</span>Team / user assignment</li>
                <li><span class="ck">✓</span>Timeline extensions &amp; support requests</li>
                <li><span class="ck">✓</span>Reporting &amp; admin visibility</li>
                <li><span class="xx">✕</span>No testing by VAPTFIX</li>
              </ul>
            </div>

            <div class="pm" data-panel="test">
              <p class="pm-eyebrow">Management + Testing</p>
              <h4>VAPTFIX Testing &amp; Retesting</h4>
              <p class="pm-desc">Provide the required scope for VAPTFIX to conduct the security assessment. The plan includes two testing cycles per year, with each cycle consisting of a test and one rescan of the mitigated vulnerabilities.</p>
              <div class="price"><b>$300</b><small>platform fee / 6 months<br>+ per-asset pricing below</small></div>
              <div class="tiles">
                <div class="tile"><div class="ico">🖧</div><div class="nm">IP</div><div class="v">$25<small> /IP</small></div></div>
                <div class="tile"><div class="ico">🌐</div><div class="nm">Web app</div><div class="v">$1,250<small> /app</small></div></div>
                <div class="tile"><div class="ico">📱</div><div class="nm">Mobile app</div><div class="v">$1,250<small> /app</small></div></div>
              </div>
              <div class="note ok-box">🛡️ Each cycle = 1 test + 1 rescan of the mitigated vulnerabilities. 2 cycles per year.</div>
              <p v-if="testingLocked" class="lock-note">Not available — you already uploaded a report.</p>
              <button type="button" class="btn" :disabled="testingLocked" @click="setMode('test')">Choose Management + Testing <span class="arrow">→</span></button>
              <p class="divider">What's included</p>
              <ul class="feat feat-2">
                <li><span class="ck">✓</span>Everything in Management Only</li>
                <li><span class="ck">✓</span>VAPTFIX conducts the assessment</li>
                <li><span class="ck">✓</span>You just provide the scope</li>
                <li><span class="ck">✓</span>2 testing cycles per year</li>
                <li><span class="ck">✓</span>Test + 1 rescan in each cycle</li>
                <li><span class="ck">✓</span>Findings flow straight into the dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="compare">
      <div class="wrap">
        <div class="sec-head">
          <p class="eyebrow">Compare plans</p>
          <h2>Everything side by side</h2>
          <p class="sub">All prices in USD.</p>
        </div>
        <div class="card table-card">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Freemium <span class="chip chip-g">free</span></th>
                <th>Management Only <span class="chip chip-a">flat fee</span></th>
                <th>Management + Testing <span class="chip chip-b">per asset</span></th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Price</td><td><span class="hl">$0</span></td><td><span class="hl">$300</span> flat</td><td><span class="hl">$300</span> platform fee + per asset</td></tr>
              <tr><td>Period</td><td>30 days</td><td>3 months</td><td>6 months</td></tr>
              <tr><td>🖧 IP</td><td>5 IPs only</td><td>Included</td><td><span class="hl">$25</span> per IP</td></tr>
              <tr><td>🌐 Web application</td><td>Not included</td><td>Included</td><td><span class="hl">$1,250</span> per app</td></tr>
              <tr><td>📱 Mobile application</td><td>Not included</td><td>Included</td><td><span class="hl">$1,250</span> per app</td></tr>
              <tr><td>Limits</td><td>5 IPs</td><td>100 assets and 1,000 vulnerabilities per period</td><td>Based on the scope you buy</td></tr>
              <tr><td>Report uploads</td><td>Less than 1 MB</td><td>Multiple, until a limit is reached</td><td>VAPTFIX produces the findings</td></tr>
              <tr><td>Over the limit</td><td>Upgrade to Premium</td><td>Next 3-month period, +$300</td><td>Add more assets</td></tr>
              <tr><td>Testing</td><td>No</td><td>No</td><td>Test + 1 rescan of mitigated vulnerabilities, 2 cycles per year</td></tr>
              <tr><td>Access</td><td>Slack / Teams only</td><td>Web dashboard + Slack / Teams</td><td>Web dashboard + Slack / Teams</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="calculator">
      <div class="wrap">
        <div class="sec-head">
          <p class="eyebrow">Pricing calculator</p>
          <h2>Know your price. <span class="grad">Instantly.</span></h2>
          <p class="sub">Choose a plan, add your assets and see exactly what you'll pay. No hidden fees, no surprises.</p>
        </div>
        <div class="calc">
          <div class="card">
            <p class="step"><i>1</i>Choose your plan</p>
            <div class="mode" role="tablist" aria-label="Plan">
              <button type="button" :class="{ on: state.mode === 'free' }" :disabled="freemiumLocked" @click="setMode('free')"><b>Freemium</b><span>Free for 30 days</span></button>
              <button type="button" :class="{ on: state.mode === 'mgmt' }" :disabled="managementLocked" @click="setMode('mgmt')"><b>Management Only</b><span>I already have reports</span></button>
              <button type="button" :class="{ on: state.mode === 'test' }" :disabled="testingLocked" @click="setMode('test')"><b>Mgmt + Testing</b><span>VAPTFIX tests for me</span></button>
            </div>
            <div class="presets">
              <span>Try an example:</span>
              <button v-for="(preset, index) in presets" :key="preset[0]" type="button" @click="applyPreset(index)">{{ preset[0] }}</button>
            </div>
            <p class="step"><i>2</i>Tick your assets and set quantities</p>
            <div
              v-for="asset in assets"
              :key="asset.id"
              class="cov"
              :class="{ on: state[asset.id].on, blocked: state.mode === 'free' && asset.id !== 'ip' }"
              :style="{ '--c1': asset.c1, '--c2': asset.c2 }"
            >
              <div
                class="cov-top"
                role="checkbox"
                :aria-checked="state[asset.id].on ? 'true' : 'false'"
                tabindex="0"
                @click="toggleAsset(asset.id)"
                @keydown.enter.prevent="toggleAsset(asset.id)"
                @keydown.space.prevent="toggleAsset(asset.id)"
              >
                <span class="box">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                </span>
                <span class="cov-ico" :style="{ background: asset.bg }">{{ asset.ico }}</span>
                <span class="cov-name"><b>{{ asset.name }}</b><span>{{ asset.desc }}</span></span>
                <span class="cov-rate">{{ rateLabel(asset) }}</span>
              </div>
              <div class="cov-body"><div>
                <div class="slide-row">
                  <div class="qty">
                    <button type="button" :aria-label="'Decrease ' + asset.name" @click="setQty(asset.id, state[asset.id].qty - 1)">−</button>
                    <input type="number" :min="asset.min" :max="asset.max" :aria-label="asset.name + ' quantity'" :value="state[asset.id].qty" @change="setQty(asset.id, $event.target.value)">
                    <button type="button" :aria-label="'Increase ' + asset.name" @click="setQty(asset.id, state[asset.id].qty + 1)">+</button>
                  </div>
                  <input
                    type="range"
                    :min="asset.min"
                    :max="asset.max"
                    :value="state[asset.id].qty"
                    :aria-label="asset.name + ' slider'"
                    :style="sliderStyle(asset)"
                    @input="setQty(asset.id, $event.target.value)"
                  >
                </div>
              </div></div>
            </div>

            <div v-if="state.mode !== 'test'">
              <p class="step extra-step"><i>3</i>{{ state.mode === 'mgmt' ? 'How many vulnerabilities are in your reports?' : 'How big is your largest report?' }}</p>
              <div class="cov on static extra-card">
                <div class="cov-top">
                  <span class="cov-ico extra-ico">{{ state.mode === 'mgmt' ? '🐞' : '📄' }}</span>
                  <span class="cov-name">
                    <b>{{ state.mode === 'mgmt' ? 'Vulnerabilities' : 'Report file size (MB)' }}</b>
                    <span>{{ state.mode === 'mgmt' ? 'Total across all reports, all severities' : 'Freemium accepts reports under 1 MB' }}</span>
                  </span>
                  <span class="cov-rate">{{ state.mode === 'mgmt' ? 'Limit 1,000' : 'Limit 1 MB' }}</span>
                </div>
                <div class="cov-body"><div>
                  <div class="slide-row">
                    <div class="qty">
                      <button type="button" aria-label="Decrease" @click="bumpExtra(-1)">−</button>
                      <input type="number" :aria-label="state.mode === 'mgmt' ? 'Vulnerabilities' : 'Report size in MB'" :value="extraValue" @change="setExtra($event.target.value)">
                      <button type="button" aria-label="Increase" @click="bumpExtra(1)">+</button>
                    </div>
                    <input type="range" :min="extraMin" :max="extraMax" :step="extraStep" :value="extraValue" :style="extraSliderStyle" @input="setExtra($event.target.value)">
                  </div>
                  <div v-if="state.mode === 'mgmt'" class="scale"><span>0</span><span>1,000 limit</span><span>2,500</span><span>5,000</span></div>
                  <div v-else class="scale"><span>0.1 MB</span><span>1 MB limit</span><span>5 MB</span><span>10 MB</span></div>
                </div></div>
              </div>
            </div>
          </div>

          <aside class="card summary" aria-live="polite">
            <p class="s-label">{{ summaryTitle }}</p>
            <div class="total"><span class="num">{{ money(result.total) }}</span><small>{{ periodLabel }}</small></div>
            <p class="per-mo">{{ perMonthLabel }}</p>
            <div class="usage" v-html="usageHtml"></div>
            <div v-html="noteHtml"></div>
            <ul class="lines">
              <li v-for="(item, index) in result.items" :key="index">
                <span class="dot" :style="{ background: item.color }"></span>
                <span class="nm">{{ item.nm }}<small>{{ item.sub }}</small></span>
                <span class="amt num">{{ money(item.amt) }}</span>
              </li>
              <li v-if="!result.items.length && state.mode !== 'free'" class="empty-line">No assets selected yet</li>
            </ul>
            <div v-if="compareText" class="compare">
              <span v-html="compareText"></span>
              <button type="button" @click="setMode(compareMode)">Switch</button>
            </div>
            <button type="button" class="btn btn-w" :disabled="checkoutLoading || !canPay" @click="$emit('pay', state.mode)">
              {{ checkoutLoading ? 'Redirecting to payment…' : payLabel }} <span class="arrow">→</span>
            </button>
            <button type="button" class="btn btn-o" @click="copyQuote">Copy this quote</button>
            <p class="fine">{{ state.mode === 'free' ? 'No credit card needed.' : 'Prices in USD. Taxes may apply.' }}</p>
          </aside>
        </div>
      </div>
    </section>

    <section id="testing">
      <div class="wrap">
        <div class="sec-head">
          <p class="eyebrow">Management + Testing</p>
          <h2>How testing works</h2>
          <p class="sub">Two cycles per year. Each cycle is one test plus one rescan of the vulnerabilities you've mitigated.</p>
        </div>
        <div class="timeline">
          <div class="card cycle">
            <h3>Cycle 1 <span>First half of the year</span></h3>
            <div class="steps3">
              <div class="st"><div class="e">🔍</div><b>Test</b><small>VAPTFIX tests your scope</small></div><div class="chev">→</div>
              <div class="st"><div class="e">🛠️</div><b>Fix</b><small>Your team mitigates</small></div><div class="chev">→</div>
              <div class="st"><div class="e">✅</div><b>1 rescan</b><small>Mitigated vulns verified</small></div>
            </div>
          </div>
          <div class="card cycle">
            <h3>Cycle 2 <span>Second half of the year</span></h3>
            <div class="steps3">
              <div class="st"><div class="e">🔍</div><b>Test</b><small>VAPTFIX tests your scope</small></div><div class="chev">→</div>
              <div class="st"><div class="e">🛠️</div><b>Fix</b><small>Your team mitigates</small></div><div class="chev">→</div>
              <div class="st"><div class="e">✅</div><b>1 rescan</b><small>Mitigated vulns verified</small></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="faq">
      <div class="wrap">
        <div class="sec-head"><p class="eyebrow">FAQ</p><h2>Questions, answered</h2></div>
        <div class="faq">
          <details open><summary>What do I get for $300 on Management Only?</summary><p>3 months of full platform access for up to 100 assets and 1,000 vulnerabilities, with no per-IP or per-app charges. IPs, web apps and mobile apps all count towards the 100-asset limit.</p></details>
          <details><summary>Can I upload more than one report?</summary><p>Yes. On Management Only, keep uploading reports during your 3 months until you reach 100 assets or 1,000 vulnerabilities, whichever comes first.</p></details>
          <details><summary>What if I have more than 100 assets or 1,000 vulnerabilities?</summary><p>Upload reports up to the limit now. The rest can be uploaded in your next 3-month period, after you pay the $300 platform fee again.</p></details>
          <details><summary>How is Management + Testing priced?</summary><p>A $300 platform fee every 6 months, plus $25 per IP, $1,250 per web application and $1,250 per mobile application. For example, 80 IPs and 2 web apps is $300 + $2,000 + $2,500 = $4,800 for 6 months.</p></details>
          <details><summary>What does a testing cycle include?</summary><p>One test of your scope by VAPTFIX, then one rescan of the vulnerabilities you've mitigated to confirm they're closed. You get two cycles per year.</p></details>
          <details><summary>What are the Freemium limits?</summary><p>Freemium is free for 30 days and covers 5 IPs only. Each uploaded report must be less than 1 MB. It works straight in Slack or Teams, with no web client.</p></details>
          <details><summary>Can I mix Management Only and Management + Testing?</summary><p>Not on the same subscription. The mode depends on whether you upload your own reports or give VAPTFIX the scope to test.</p></details>
        </div>
      </div>
    </section>

    <section class="closing">
      <div class="wrap">
        <div class="cta">
          <h2>Ready to close every risk?</h2>
          <p>Start free today, or build your Premium plan in under a minute.</p>
          <div class="hero-cta">
            <button type="button" class="btn btn-w" :disabled="freemiumLocked || checkoutLoading" @click="$emit('freemium')">Start free for 30 days</button>
            <a href="mailto:support@vaptfix.ai" class="btn btn-o">Talk to sales</a>
          </div>
        </div>
      </div>
    </section>
    <p v-if="copied" class="toast show">Quote copied to clipboard</p>
  </div>
</template>

<script>
const RULES = {
  free: { ipLimit: 5, maxMB: 1 },
  mgmt: { fee: 300, months: 3, assets: 100, vulns: 1000 },
  test: { fee: 300, months: 6, ip: 25, web: 1250, mob: 1250 },
};

const ASSETS = [
  { id: 'ip', name: 'IP addresses', unit: 'IP', units: 'IPs', ico: '🖧', bg: '#ede7ff', c1: '#8b6cff', c2: '#5b3fd1', min: 1, max: 300, desc: 'Internal & external IPs' },
  { id: 'web', name: 'Web applications', unit: 'app', units: 'apps', ico: '🌐', bg: '#e0f2fe', c1: '#60a5fa', c2: '#2563eb', min: 1, max: 30, desc: 'Sites, portals & APIs' },
  { id: 'mob', name: 'Mobile apps', unit: 'app', units: 'apps', ico: '📱', bg: '#fce7f3', c1: '#f472b6', c2: '#db2777', min: 1, max: 30, desc: 'iOS & Android apps' },
];

const PRESETS = {
  free: [
    ['Startup, 4 IPs', { ip: [1, 4], web: [0, 1], mob: [0, 1], mb: 0.4 }],
    ['12 IPs', { ip: [1, 12], web: [0, 1], mob: [0, 1], mb: 0.6 }],
    ['2.5 MB report', { ip: [1, 5], web: [0, 1], mob: [0, 1], mb: 2.5 }],
  ],
  mgmt: [
    ['40 IPs, 600 vulns', { ip: [1, 40], web: [0, 2], mob: [0, 1], v: 600 }],
    ['80 IPs + 2 web apps', { ip: [1, 80], web: [1, 2], mob: [0, 1], v: 950 }],
    ['130 IPs (over limit)', { ip: [1, 130], web: [0, 2], mob: [0, 1], v: 800 }],
    ['2,500 vulns (over limit)', { ip: [1, 60], web: [0, 2], mob: [0, 1], v: 2500 }],
  ],
  test: [
    ['50 IPs', { ip: [1, 50], web: [0, 2], mob: [0, 1] }],
    ['80 IPs + 2 web apps', { ip: [1, 80], web: [1, 2], mob: [0, 1] }],
    ['20 IPs + 1 mobile', { ip: [1, 20], web: [0, 2], mob: [1, 1] }],
    ['100 IPs + 3 web + 2 mobile', { ip: [1, 100], web: [1, 3], mob: [1, 2] }],
  ],
};

function money(n) {
  return '$' + Math.round(Number(n) || 0).toLocaleString('en-US');
}
function countLabel(n, one, many) {
  const value = Math.round(Number(n) || 0).toLocaleString('en-US');
  return `${value} ${Number(n) === 1 ? one : many}`;
}

export default {
  name: 'PricingShowcase',
  props: {
    freemiumLocked: { type: Boolean, default: false },
    managementLocked: { type: Boolean, default: false },
    testingLocked: { type: Boolean, default: false },
    assetCount: { type: Number, default: 0 },
    checkoutLoading: { type: Boolean, default: false },
    notice: { type: String, default: '' },
    error: { type: String, default: '' },
    overCeiling: { type: Boolean, default: false },
    initialMode: { type: String, default: 'mgmt' },
  },
  emits: ['freemium', 'pay', 'custom'],
  data() {
    return {
      assets: ASSETS,
      premiumTab: 'mgmt',
      touched: false,
      copied: false,
      state: {
        mode: 'mgmt',
        vulns: 600,
        mb: 0.6,
        ip: { on: true, qty: 40 },
        web: { on: false, qty: 2 },
        mob: { on: false, qty: 1 },
      },
    };
  },
  computed: {
    presets() {
      return PRESETS[this.state.mode] || [];
    },
    result() {
      return this.calc(this.state.mode);
    },
    summaryTitle() {
      if (this.state.mode === 'free') return 'Freemium';
      if (this.state.mode === 'test') return 'Management + Testing';
      return 'Management Only';
    },
    periodLabel() {
      if (this.state.mode === 'free') return 'for 30 days';
      const months = this.result.months || (this.state.mode === 'test' ? 6 : 3);
      return `/ ${months} months`;
    },
    perMonthLabel() {
      if (this.state.mode === 'free' || !this.result.any) {
        return this.state.mode === 'free' ? '' : 'Tick at least one asset to see your price';
      }
      const months = this.result.months || 1;
      return `≈ ${money(this.result.total / months)} per month`;
    },
    payLabel() {
      return this.state.mode === 'free' ? 'Get started free' : 'Continue to payment';
    },
    canPay() {
      if (this.state.mode === 'free') return !this.freemiumLocked;
      if (this.state.mode === 'mgmt' && this.managementLocked) return false;
      if (this.state.mode === 'test' && this.testingLocked) return false;
      return this.result.any;
    },
    extraValue() {
      return this.state.mode === 'mgmt' ? this.state.vulns : this.state.mb;
    },
    extraMin() {
      return this.state.mode === 'mgmt' ? 0 : 0.1;
    },
    extraMax() {
      return this.state.mode === 'mgmt' ? 5000 : 10;
    },
    extraStep() {
      return this.state.mode === 'mgmt' ? 10 : 0.1;
    },
    extraSliderStyle() {
      const span = this.extraMax - this.extraMin || 1;
      const pct = ((this.extraValue - this.extraMin) / span) * 100;
      return { '--p': `${pct}%`, '--c1': '#fbbf24', '--c2': '#d97706' };
    },
    usageHtml() {
      const result = this.result;
      if (this.state.mode === 'free') {
        return this.bar('IPs', result.ips, RULES.free.ipLimit, '#8b6cff')
          + this.bar('Largest report', this.state.mb, RULES.free.maxMB, '#14b88a', true);
      }
      if (this.state.mode === 'mgmt') {
        return this.bar('Assets', result.assets, RULES.mgmt.assets, '#8b6cff')
          + this.bar('Vulnerabilities', this.state.vulns, RULES.mgmt.vulns, '#14b88a');
      }
      if (!result.any) return '';
      const parts = result.items.map((item) => `<div style="width:${(item.amt / result.total) * 100}%;background:${item.color}"></div>`).join('');
      return `<div><div class="u-row"><span>Where your money goes</span><b class="num">${money(result.total)}</b></div><div class="u-track">${parts}</div></div>`;
    },
    noteHtml() {
      const result = this.result;
      if (this.state.mode === 'free') {
        const messages = [];
        if (result.lockedIps) messages.push(`${countLabel(result.lockedIps, 'IP', 'IPs')} will stay locked.`);
        if (result.apps) messages.push('Web and mobile apps need Premium.');
        if (!result.mbOk) messages.push('Your report is too large for Freemium.');
        if (messages.length) {
          return `<div class="s-note warn-box">⚠ ${messages.join(' ')} <b>Upgrade to Management Only for ${money(RULES.mgmt.fee)}</b> to unlock everything.</div>`;
        }
        return '<div class="s-note ok-box">✓ You fit Freemium. Upgrade any time without re-uploading.</div>';
      }
      if (this.state.mode === 'mgmt') {
        if (!result.any) return '';
        if (result.periods === 1) {
          return `<div class="s-note ok-box">✓ Within your limit. You can still add <b>${countLabel(RULES.mgmt.assets - result.assets, 'asset', 'assets')}</b> and <b>${countLabel(RULES.mgmt.vulns - this.state.vulns, 'vulnerability', 'vulnerabilities')}</b> by uploading more reports.</div>`;
        }
        const why = [
          result.assets > RULES.mgmt.assets ? `${Math.round(result.assets).toLocaleString('en-US')} assets` : '',
          this.state.vulns > RULES.mgmt.vulns ? `${Math.round(this.state.vulns).toLocaleString('en-US')} vulnerabilities` : '',
        ].filter(Boolean).join(' and ');
        return `<div class="s-note warn-box">⚠ Over the limit with ${why}. Upload what fits now; the rest needs <b>${result.periods - 1} more period${result.periods > 2 ? 's' : ''}</b> at ${money(RULES.mgmt.fee)}${result.periods > 2 ? ' each' : ''}.</div>`;
      }
      return result.any ? '<div class="s-note ok-box">🛡️ Includes 2 testing cycles a year, each a test + 1 rescan.</div>' : '';
    },
    compareMode() {
      if (this.state.mode === 'test') return 'mgmt';
      return this.state.mode === 'free' ? 'mgmt' : 'test';
    },
    compareText() {
      const management = this.calc('mgmt');
      const testing = this.calc('test');
      if (this.state.mode === 'free') {
        return this.noteHtml.includes('warn-box') ? '' : `Need more? Try Management Only at <b>${money(RULES.mgmt.fee)}</b>`;
      }
      if (!this.result.any) return '';
      if (this.state.mode === 'mgmt') return `Want VAPTFIX to test too? <b>${money(testing.total)}</b> / 6 months`;
      return `Already have reports? Management Only is <b>${money(management.total)}</b> / ${management.months} months`;
    },
  },
  watch: {
    assetCount: {
      immediate: true,
      handler(count) {
        const n = Number(count) || 0;
        if (this.touched || n <= 0) return;
        this.state.ip.on = true;
        this.state.ip.qty = Math.max(1, Math.min(300, n));
      },
    },
    initialMode: {
      immediate: true,
      handler(mode) {
        if (mode === 'test' || mode === 'mgmt' || mode === 'free') this.setMode(mode, true);
      },
    },
  },
  methods: {
    money,
    calc(mode) {
      const active = ASSETS.filter((asset) => this.state[asset.id].on);
      const assetCount = active.reduce((sum, asset) => sum + this.state[asset.id].qty, 0);
      if (mode === 'free') {
        const ips = this.state.ip.on ? this.state.ip.qty : 0;
        return {
          items: [],
          total: 0,
          months: 0,
          ips,
          lockedIps: Math.max(0, ips - RULES.free.ipLimit),
          apps: (this.state.web.on ? this.state.web.qty : 0) + (this.state.mob.on ? this.state.mob.qty : 0),
          mbOk: this.state.mb < RULES.free.maxMB,
          any: true,
        };
      }
      if (mode === 'mgmt') {
        const periods = assetCount
          ? Math.max(1, Math.ceil(assetCount / RULES.mgmt.assets), Math.ceil(this.state.vulns / RULES.mgmt.vulns))
          : 0;
        const items = [];
        if (periods) {
          items.push({ nm: 'Management Only platform', sub: 'Flat fee, no per-asset charges', amt: RULES.mgmt.fee, color: '#f5a524' });
          if (periods > 1) {
            items.push({
              nm: `${periods - 1} more 3-month period${periods > 2 ? 's' : ''}`,
              sub: `${periods - 1} × ${money(RULES.mgmt.fee)} for assets / vulnerabilities over the limit`,
              amt: (periods - 1) * RULES.mgmt.fee,
              color: '#ec4899',
            });
          }
        }
        return { items, total: periods * RULES.mgmt.fee, months: Math.max(1, periods) * RULES.mgmt.months, periods, assets: assetCount, any: assetCount > 0 };
      }
      const items = [];
      if (active.length) items.push({ nm: 'Platform fee', sub: 'Charged once, covers all assets', amt: RULES.test.fee, color: '#f5a524' });
      active.forEach((asset) => {
        const qty = this.state[asset.id].qty;
        const rate = RULES.test[asset.id];
        items.push({
          nm: asset.name,
          sub: `${countLabel(qty, asset.unit, asset.units)} × ${money(rate)}`,
          amt: qty * rate,
          color: asset.c2,
        });
      });
      return { items, total: items.reduce((sum, item) => sum + item.amt, 0), months: RULES.test.months, any: active.length > 0 };
    },
    bar(label, used, limit, color, isMb) {
      const over = used > limit;
      const pct = Math.min(100, (used / limit) * 100);
      const format = (value) => (isMb ? `${Number(value).toFixed(1)} MB` : Math.round(value).toLocaleString('en-US'));
      return `<div><div class="u-row"><span>${label}</span><b class="num">${format(used)} / ${isMb ? `${limit} MB` : Math.round(limit).toLocaleString('en-US')}${over ? ` · over by ${format(used - limit)}` : ''}</b></div><div class="u-track"><div style="width:${pct}%;background:${over ? '#f5a524' : color}"></div></div></div>`;
    },
    sliderStyle(asset) {
      const span = asset.max - asset.min || 1;
      const pct = ((this.state[asset.id].qty - asset.min) / span) * 100;
      return { '--p': `${pct}%` };
    },
    rateLabel(asset) {
      if (this.state.mode === 'test') return `${money(RULES.test[asset.id])} / ${asset.unit}`;
      if (this.state.mode === 'mgmt') return 'Included';
      return asset.id === 'ip' ? 'Up to 5' : 'Premium only';
    },
    setPremiumTab(mode) {
      if (mode === 'mgmt' && this.managementLocked) return;
      if (mode === 'test' && this.testingLocked) return;
      this.premiumTab = mode;
      if (this.state.mode !== 'free') this.setMode(mode);
    },
    setMode(mode, silent) {
      if (mode === 'free' && this.freemiumLocked) return;
      if (mode === 'mgmt' && this.managementLocked) return;
      if (mode === 'test' && this.testingLocked) return;
      this.state.mode = mode;
      if (mode !== 'free') this.premiumTab = mode;
      if (!silent) {
        const section = document.getElementById('calculator');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    toggleAsset(id) {
      this.touched = true;
      this.state[id].on = !this.state[id].on;
    },
    setQty(id, value) {
      const asset = ASSETS.find((item) => item.id === id);
      this.touched = true;
      const next = Math.max(asset.min, Math.min(asset.max, parseInt(value, 10) || asset.min));
      this.state[id].qty = next;
      this.state[id].on = true;
    },
    setExtra(value) {
      this.touched = true;
      if (this.state.mode === 'mgmt') {
        this.state.vulns = Math.max(0, Math.min(5000, Math.round(Number(value) || 0)));
        return;
      }
      const next = Math.max(0.1, Math.min(10, Math.round((Number(value) || 0.1) * 10) / 10));
      this.state.mb = next;
    },
    bumpExtra(direction) {
      if (this.state.mode === 'mgmt') this.setExtra(this.state.vulns + direction * 50);
      else this.setExtra(this.state.mb + direction * 0.1);
    },
    applyPreset(index) {
      const config = PRESETS[this.state.mode][index][1];
      this.touched = true;
      ['ip', 'web', 'mob'].forEach((id) => {
        this.state[id].on = !!config[id][0];
        this.state[id].qty = config[id][1];
      });
      if (config.v !== undefined) this.state.vulns = config.v;
      if (config.mb !== undefined) this.state.mb = config.mb;
    },
    async copyQuote() {
      const result = this.result;
      const lines = result.items.map((item) => `• ${item.nm}: ${item.sub} = ${money(item.amt)}`);
      const title = this.summaryTitle;
      const text = this.state.mode === 'free'
        ? `VAPTFIX quote – Freemium\n$0 for 30 days · 5 IPs only · reports under 1 MB\nSelected: ${result.ips} IPs, largest report ${Number(this.state.mb).toFixed(1)} MB`
        : `VAPTFIX quote – ${title}\n${lines.join('\n')}\nTotal: ${money(result.total)}${result.months ? ` / ${result.months} months` : ''}`;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        /* clipboard can be blocked; the toast still confirms the click */
      }
      this.copied = true;
      setTimeout(() => { this.copied = false; }, 1800);
    },
  },
};
</script>

<style scoped>
.vp-new {
  --ink: #1a0d30;
  --ink-2: #4a4060;
  --muted: #7a7290;
  --brand: #24123f;
  --brand-2: #5b3fd1;
  --brand-3: #8b6cff;
  --mint: #14b88a;
  --pink: #ec4899;
  --bg: #f7f6fb;
  --card: #ffffff;
  --line: #e7e3f1;
  --soft: #f1edfb;
  --shadow: 0 1px 2px rgba(36, 18, 63, 0.06), 0 12px 32px -12px rgba(36, 18, 63, 0.18);
  --r: 20px;
  color: var(--ink);
  background: var(--bg);
  line-height: 1.5;
  font-family: Inter, system-ui, sans-serif;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-right: 0;
  padding-bottom: 8px;
}
.vp-new * { box-sizing: border-box; }
.vp-new button { font: inherit; cursor: pointer; }
.vp-new button:disabled { cursor: not-allowed; opacity: 0.55; }
.wrap { max-width: 1180px; margin: 0 auto; padding: 0 20px; }
.num { font-variant-numeric: tabular-nums; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; font-size: 15px; border-radius: 999px; padding: 12px 22px; text-decoration: none; }
.btn-dark { background: var(--brand); color: #fff; border: 0; width: 100%; margin: 22px 0 24px; }
.btn-grad { background: linear-gradient(135deg, var(--brand-2), var(--brand)); color: #fff; }
.btn-ghost { border: 1.5px solid var(--line); background: var(--card); color: var(--ink); }
.arrow { width: 18px; height: 18px; border-radius: 50%; background: rgba(255, 255, 255, 0.2); display: grid; place-items: center; font-size: 11px; }
.btn-ghost .arrow, .premium .btn .arrow { background: rgba(36, 18, 63, 0.1); color: var(--brand); }
.hero { position: relative; text-align: center; padding: 48px 0 28px; overflow: hidden; }
.hero::before { content: ""; position: absolute; inset: -200px -100px auto; height: 520px; background: radial-gradient(ellipse at 30% 40%, rgba(139, 108, 255, 0.28), transparent 60%), radial-gradient(ellipse at 75% 30%, rgba(236, 72, 153, 0.16), transparent 55%); pointer-events: none; }
.pill, .hero h1, .lead, .hero-cta, .trust, .return-note { position: relative; }
.pill { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; border-radius: 999px; background: var(--card); border: 1px solid var(--line); font-size: 13px; font-weight: 600; color: var(--brand-2); box-shadow: var(--shadow); }
.pill b { width: 7px; height: 7px; border-radius: 50%; background: var(--mint); box-shadow: 0 0 0 4px rgba(20, 184, 138, 0.2); }
.hero h1 { font-size: clamp(36px, 6vw, 62px); font-weight: 800; letter-spacing: -0.04em; line-height: 1.05; margin: 22px auto 16px; max-width: 820px; }
.hero h1 span, .grad { background: linear-gradient(120deg, var(--brand-2), var(--pink)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.lead { font-size: 18px; color: var(--ink-2); max-width: 640px; margin: 0 auto; }
.hero-cta { display: flex; gap: 12px; justify-content: center; margin-top: 28px; flex-wrap: wrap; }
.trust { display: flex; gap: 26px; justify-content: center; margin-top: 28px; font-size: 13px; color: var(--muted); flex-wrap: wrap; }
.trust span::before { content: "✓ "; color: var(--mint); font-weight: 700; }
.return-note { max-width: 760px; margin: 0 auto 16px; background: #eef8f8; color: #0f696e; border: 1px solid rgba(15, 105, 110, 0.18); border-radius: 12px; padding: 12px 14px; font-weight: 600; }
.return-note.is-error { background: #fef2f2; color: #991b1b; border-color: #fecaca; }
.note-link { margin-left: 8px; color: var(--brand-2); font-weight: 800; text-decoration: underline; }
section { padding: 56px 0; }
.sec-head { text-align: center; margin-bottom: 38px; }
.eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--brand-2); }
h2 { font-size: clamp(28px, 4vw, 42px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-top: 10px; }
.sub { color: var(--ink-2); margin-top: 12px; font-size: 16px; }
.plans { display: grid; grid-template-columns: 1fr 1.4fr; gap: 24px; align-items: stretch; }
.card { background: var(--card); border: 1px solid var(--line); border-radius: var(--r); box-shadow: var(--shadow); padding: 30px; }
.plan h3 { font-size: 22px; font-weight: 700; }
.tag { color: var(--muted); font-size: 14px; margin-top: 4px; }
.price { display: flex; align-items: baseline; gap: 10px; margin: 22px 0 4px; }
.price b { font-size: 52px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; }
.price small { color: var(--muted); font-size: 14px; line-height: 1.35; }
.feat { list-style: none; display: grid; gap: 12px; font-size: 14.5px; color: var(--ink-2); padding: 0; margin: 0; }
.feat li { display: flex; gap: 10px; align-items: flex-start; }
.ck, .xx { flex: none; width: 20px; height: 20px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; font-weight: 800; margin-top: 1px; }
.ck { background: rgba(20, 184, 138, 0.14); color: var(--mint); }
.xx { background: rgba(239, 68, 68, 0.1); color: #e5484d; }
.divider { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 14px; }
.mini { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; }
.mini div { background: var(--soft); border-radius: 12px; padding: 12px; }
.mini b { display: block; font-size: 20px; font-weight: 800; }
.mini span { font-size: 12.5px; color: var(--muted); }
.premium { position: relative; background: linear-gradient(160deg, #2d1752 0%, var(--brand) 55%, #160a29 100%); color: #fff; border: 0; overflow: hidden; }
.premium::after { content: ""; position: absolute; width: 380px; height: 380px; right: -120px; top: -140px; background: radial-gradient(circle, rgba(139, 108, 255, 0.55), transparent 65%); pointer-events: none; }
.premium > * { position: relative; z-index: 1; }
.premium > .badge { position: absolute; z-index: 2; }
.premium .tag, .premium .price small { color: #c9bdf0; }
.premium .feat { color: #e7e0ff; }
.premium .divider { color: #a99ad6; }
.badge { position: absolute; top: 24px; right: 24px; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; padding: 6px 12px; border-radius: 999px; background: linear-gradient(135deg, var(--pink), var(--brand-3)); color: #fff; }
.premium .btn { background: #fff; color: var(--brand); width: 100%; margin: 22px 0 24px; }
.ptoggle { position: relative; display: grid; grid-template-columns: 1fr 1fr; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.14); border-radius: 14px; padding: 5px; margin: 22px 0 4px; }
.ptoggle button { position: relative; z-index: 1; padding: 12px 10px; border-radius: 10px; font-weight: 700; font-size: 14px; color: #c9bdf0; border: 0; background: none; }
.ptoggle-pill { position: absolute; top: 5px; bottom: 5px; left: 5px; width: calc(50% - 5px); border-radius: 10px; background: #fff; box-shadow: 0 6px 18px -6px rgba(0, 0, 0, 0.4); transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); }
.premium[data-mode="test"] .ptoggle-pill { transform: translateX(100%); }
.premium[data-mode="mgmt"] .ptoggle [data-mode="mgmt"],
.premium[data-mode="test"] .ptoggle [data-mode="test"] { color: var(--brand); }
.pm { display: none; }
.premium[data-mode="mgmt"] .pm[data-panel="mgmt"],
.premium[data-mode="test"] .pm[data-panel="test"] { display: block; }
.pm-eyebrow { margin-top: 20px; font-size: 11.5px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #f0abfc; }
.pm h4 { font-size: 21px; font-weight: 800; margin-top: 6px; }
.pm-desc { color: #d8cff7; font-size: 14.5px; margin-top: 8px; }
.tiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 22px 0 6px; }
.tile { background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 14px; padding: 14px; }
.tile .ico { font-size: 18px; }
.tile .nm { font-size: 12.5px; color: #c9bdf0; margin-top: 4px; }
.tile .v { font-size: 22px; font-weight: 800; margin-top: 4px; }
.tile .v small { font-size: 12px; font-weight: 500; color: #c9bdf0; }
.flow { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px; }
.flow div, .note, .s-note { border-radius: 12px; padding: 12px 14px; font-size: 13px; line-height: 1.45; }
.flow b { display: block; margin-bottom: 2px; }
.ok-box { background: rgba(20, 184, 138, 0.14); border: 1px solid rgba(20, 184, 138, 0.4); color: #067a5a; }
.premium .ok-box { color: #a7f3d0; }
.warn-box { background: rgba(245, 165, 36, 0.14); border: 1px solid rgba(245, 165, 36, 0.38); color: #9a6700; }
.premium .warn-box { color: #ffd9a0; }
.note { display: flex; margin-top: 10px; }
.lock-note { color: #ffd9a0; font-size: 13px; margin-top: 8px; }
.feat-2 { grid-template-columns: 1fr 1fr; column-gap: 20px; }
.table-card { padding: 0; overflow: auto; }
table { width: 100%; border-collapse: collapse; font-size: 14.5px; min-width: 640px; }
th, td { padding: 16px 20px; text-align: left; border-bottom: 1px solid var(--line); vertical-align: top; }
th { font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); background: var(--soft); }
td:first-child { font-weight: 600; color: var(--ink); width: 20%; }
td { color: var(--ink-2); }
tr:last-child td { border-bottom: 0; }
.hl { color: var(--brand-2); font-weight: 700; }
.chip { display: inline-block; font-size: 10.5px; font-weight: 700; padding: 3px 8px; border-radius: 6px; margin-left: 6px; }
.chip-g { background: rgba(122, 114, 144, 0.14); color: var(--ink-2); }
.chip-a { background: rgba(245, 165, 36, 0.15); color: #b97300; }
.chip-b { background: rgba(20, 184, 138, 0.14); color: #0b8a66; }
.calc { display: grid; grid-template-columns: 1.25fr 1fr; gap: 24px; align-items: start; }
.step { font-size: 13px; font-weight: 700; color: var(--brand-2); display: flex; align-items: center; gap: 10px; margin: 0 0 14px; }
.extra-step { margin-top: 24px; }
.step i { font-style: normal; width: 24px; height: 24px; border-radius: 50%; background: var(--soft); display: grid; place-items: center; font-size: 12px; }
.mode { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; background: var(--soft); padding: 6px; border-radius: 16px; margin-bottom: 22px; }
.mode button { border: 0; background: none; color: inherit; border-radius: 12px; padding: 12px; text-align: left; }
.mode button b { display: block; font-size: 14.5px; }
.mode button span { font-size: 12px; color: var(--muted); }
.mode button.on { background: var(--card); box-shadow: var(--shadow); }
.mode button.on b { color: var(--brand-2); }
.presets { display: flex; flex-wrap: wrap; gap: 8px; margin: -6px 0 24px; }
.presets span { font-size: 12.5px; color: var(--muted); align-self: center; }
.presets button { font-size: 12.5px; font-weight: 600; padding: 7px 12px; border-radius: 999px; border: 1.5px solid var(--line); background: var(--card); color: inherit; }
.cov { border: 1.5px solid var(--line); border-radius: 16px; padding: 16px 18px; margin-bottom: 12px; }
.cov.on { border-color: var(--brand-3); background: linear-gradient(180deg, #fbfaff, #f6f2ff); }
.cov.blocked { opacity: 0.55; }
.cov-top { display: flex; align-items: center; gap: 14px; cursor: pointer; }
.box { width: 24px; height: 24px; border-radius: 8px; border: 2px solid #cfc7e4; display: grid; place-items: center; flex: none; }
.cov.on .box { background: var(--brand-2); border-color: var(--brand-2); }
.box svg { opacity: 0; }
.cov.on .box svg { opacity: 1; }
.cov-ico { width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center; font-size: 19px; flex: none; }
.extra-ico { background: #fef3c7; }
.cov-name { flex: 1; min-width: 0; }
.cov-name b { font-size: 15.5px; display: block; }
.cov-name span { font-size: 13px; color: var(--muted); }
.cov-rate { font-weight: 700; font-size: 14px; white-space: nowrap; padding: 4px 10px; border-radius: 999px; background: var(--soft); color: var(--brand-2); }
.cov-body { display: grid; grid-template-rows: 0fr; }
.cov.on .cov-body, .cov.static .cov-body { grid-template-rows: 1fr; }
.cov-body > div { overflow: hidden; }
.slide-row { display: flex; align-items: center; gap: 16px; padding-top: 16px; }
.qty { display: flex; align-items: center; border: 1.5px solid var(--line); border-radius: 12px; background: var(--card); }
.qty button { width: 34px; height: 38px; font-size: 18px; color: var(--brand-2); font-weight: 600; border: 0; background: none; }
.scale { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); margin: 6px 0 0 132px; }
.qty input { width: 64px; border: 0; text-align: center; font: inherit; font-weight: 700; font-size: 16px; background: transparent; }
input[type="range"] { -webkit-appearance: none; appearance: none; flex: 1; height: 8px; border-radius: 999px; background: linear-gradient(90deg, var(--c1), var(--c2)) 0 / var(--p, 0%) 100% no-repeat, #e8e3f4; outline: none; }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #fff; border: 3px solid var(--c2); }
.extra-card { border-color: #f1dcae; background: linear-gradient(180deg, #fffdf7, #fff8e9); }
.summary { position: sticky; top: 84px; background: linear-gradient(170deg, #2d1752, var(--brand) 60%, #140926); color: #fff; border: 0; overflow: hidden; }
.summary::before { content: ""; position: absolute; width: 300px; height: 300px; left: -100px; bottom: -140px; background: radial-gradient(circle, rgba(236, 72, 153, 0.35), transparent 65%); pointer-events: none; }
.summary > * { position: relative; }
.s-label { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #a99ad6; font-weight: 700; }
.total { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; font-size: 56px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; margin-top: 10px; }
.total small { font-size: 16px; font-weight: 500; color: #c9bdf0; letter-spacing: 0; }
.per-mo { color: #c9bdf0; font-size: 14px; margin-top: 6px; min-height: 21px; }
.usage { display: grid; gap: 14px; margin-top: 22px; }
.usage :deep(.u-row), .u-row { display: flex; justify-content: space-between; gap: 10px; font-size: 13px; color: #d8cff7; margin-bottom: 6px; }
.usage :deep(.u-row b) { color: #fff; }
.usage :deep(.u-track), .u-track { height: 12px; border-radius: 999px; background: rgba(255, 255, 255, 0.1); overflow: hidden; display: flex; }
.usage :deep(.u-track div) { height: 100%; }
.summary :deep(.s-note) { margin-top: 16px; border-radius: 12px; padding: 12px 14px; font-size: 13px; line-height: 1.45; }
.summary :deep(.ok-box) { background: rgba(20, 184, 138, 0.14); border: 1px solid rgba(20, 184, 138, 0.4); color: #a7f3d0; }
.summary :deep(.warn-box) { background: rgba(245, 165, 36, 0.14); border: 1px solid rgba(245, 165, 36, 0.38); color: #ffd9a0; }
.lines { list-style: none; margin: 20px 0 4px; display: grid; gap: 10px; font-size: 14px; padding: 0; }
.lines li { display: flex; align-items: center; gap: 10px; padding-bottom: 10px; border-bottom: 1px dashed rgba(255, 255, 255, 0.14); }
.empty-line { border: 0; justify-content: center; color: #a99ad6; }
.dot { width: 10px; height: 10px; border-radius: 3px; flex: none; }
.lines .nm { flex: 1; color: #e7e0ff; }
.lines .nm small { display: block; color: #a99ad6; font-size: 12px; }
.lines .amt { font-weight: 700; }
.compare { background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 14px; padding: 12px 14px; font-size: 13px; color: #d8cff7; margin-top: 14px; display: flex; justify-content: space-between; gap: 10px; align-items: center; }
.compare button { background: none; border: 0; padding: 0; color: #fff; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; font-size: 13px; white-space: nowrap; }
.summary .btn { width: 100%; margin-top: 18px; }
.summary .btn-w,
.premium .btn,
.btn-w { background: #fff; color: var(--brand); border: 0; }
.btn-o { border: 1.5px solid rgba(255, 255, 255, 0.25); margin-top: 10px; color: #fff; width: 100%; }
.fine { font-size: 12px; color: #a99ad6; margin-top: 14px; text-align: center; }
.timeline { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.cycle h3 { font-size: 18px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.cycle h3 span { font-size: 12px; font-weight: 700; color: var(--brand-2); background: var(--soft); padding: 4px 10px; border-radius: 999px; }
.steps3 { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: 8px; margin-top: 20px; }
.st { background: var(--soft); border-radius: 14px; padding: 14px 10px; text-align: center; }
.st .e { font-size: 22px; }
.st b { display: block; font-size: 14px; margin-top: 4px; }
.st small { font-size: 12px; color: var(--muted); }
.chev { color: var(--brand-3); font-weight: 800; text-align: center; }
.faq { max-width: 800px; margin: 0 auto; display: grid; gap: 12px; }
details { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 18px 22px; }
summary { cursor: pointer; font-weight: 600; list-style: none; display: flex; justify-content: space-between; gap: 12px; }
summary::-webkit-details-marker { display: none; }
summary::after { content: "+"; font-size: 22px; line-height: 1; color: var(--brand-2); }
details[open] summary::after { content: "–"; }
details p { color: var(--ink-2); font-size: 14.5px; margin-top: 10px; }
.closing { padding-top: 10px; }
.cta { position: relative; overflow: hidden; background: linear-gradient(135deg, var(--brand-2), var(--brand) 60%); color: #fff; border-radius: 28px; padding: 56px 32px; text-align: center; }
.cta::after { content: ""; position: absolute; right: -80px; bottom: -160px; width: 420px; height: 420px; background: radial-gradient(circle, rgba(236, 72, 153, 0.45), transparent 65%); pointer-events: none; }
.cta h2, .cta p, .cta .hero-cta { position: relative; z-index: 1; }
.cta p { color: #d8cff7; margin: 12px auto 26px; max-width: 520px; }
.cta .hero-cta { margin-top: 0; }
.cta .hero-cta .btn-w { background: #fff; color: #24123f; border: 0; width: auto; margin: 0; }
.cta .hero-cta .btn-o { background: transparent; color: #fff; border: 1.5px solid rgba(255, 255, 255, 0.45); width: auto; margin: 0; }
.toast { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); background: var(--ink); color: #fff; padding: 12px 20px; border-radius: 12px; font-size: 14px; z-index: 50; }
@media (max-width: 960px) {
  .plans, .calc, .timeline { grid-template-columns: 1fr; }
  .summary { position: relative; top: 0; }
}
@media (max-width: 600px) {
  .tiles, .flow, .feat-2, .mode, .steps3 { grid-template-columns: 1fr; }
  .slide-row { flex-wrap: wrap; }
  .total { font-size: 44px; }
  .cov-rate, .scale { display: none; }
  .card { padding: 22px; }
}
</style>
