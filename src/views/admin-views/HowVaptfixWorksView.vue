<template>
  <div class="hvw-root">
    <Header />

    <!-- ═══════════════════ HERO ═══════════════════ -->
    <section class="hvw-hero">
      <div class="hvw-container">
        <div class="hvw-hero-tag">
          <span class="hvw-tag-dot"></span> VaptFix Onboarding
        </div>
        <h1 class="hvw-hero-title">
          Three Ways to Access<br/>
          <span class="hvw-accent">VaptFix</span>
        </h1>
        <p class="hvw-hero-sub">
          Choose your entry point — Email, Slack, or Microsoft Teams. All three follow the same onboarding journey
        </p>
        <div class="hvw-channels">
          <div class="hvw-channel-badge email-badge" @click="scrollTo('journey1')" style="cursor:pointer">
            <span>📧</span> Company Email
          </div>
          <div class="hvw-channel-badge slack-badge" @click="scrollTo('journey2')" style="cursor:pointer">
            <svg width="16" height="16" viewBox="0 0 124 124" fill="none">
              <path d="M26.3 78.8a13.15 13.15 0 0 1-13.15 13.15A13.15 13.15 0 0 1 0 78.8a13.15 13.15 0 0 1 13.15-13.15h13.15v13.15z" fill="#E01E5A"/>
              <path d="M32.9 78.8a13.15 13.15 0 0 1 13.15-13.15 13.15 13.15 0 0 1 13.15 13.15v32.9A13.15 13.15 0 0 1 46.05 124a13.15 13.15 0 0 1-13.15-13.15V78.8z" fill="#E01E5A"/>
              <path d="M46.05 26.3a13.15 13.15 0 0 1-13.15-13.15A13.15 13.15 0 0 1 46.05 0a13.15 13.15 0 0 1 13.15 13.15v13.15H46.05z" fill="#36C5F0"/>
              <path d="M46.05 32.9a13.15 13.15 0 0 1 13.15 13.15 13.15 13.15 0 0 1-13.15 13.15H13.15A13.15 13.15 0 0 1 0 46.05a13.15 13.15 0 0 1 13.15-13.15h32.9z" fill="#36C5F0"/>
              <path d="M97.7 46.05a13.15 13.15 0 0 1 13.15-13.15A13.15 13.15 0 0 1 124 46.05a13.15 13.15 0 0 1-13.15 13.15H97.7V46.05z" fill="#2EB67D"/>
              <path d="M91.1 46.05a13.15 13.15 0 0 1-13.15 13.15 13.15 13.15 0 0 1-13.15-13.15V13.15A13.15 13.15 0 0 1 77.95 0a13.15 13.15 0 0 1 13.15 13.15v32.9z" fill="#2EB67D"/>
              <path d="M77.95 97.7a13.15 13.15 0 0 1 13.15 13.15A13.15 13.15 0 0 1 77.95 124a13.15 13.15 0 0 1-13.15-13.15V97.7h13.15z" fill="#ECB22E"/>
              <path d="M77.95 91.1a13.15 13.15 0 0 1-13.15-13.15 13.15 13.15 0 0 1 13.15-13.15h32.9A13.15 13.15 0 0 1 124 77.95a13.15 13.15 0 0 1-13.15 13.15H77.95z" fill="#ECB22E"/>
            </svg>
            Slack
          </div>
          <div class="hvw-channel-badge teams-badge" @click="scrollTo('journey3')" style="cursor:pointer">
            <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
              <path d="M16 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#5059C9"/>
              <path d="M17.5 12H13a2.5 2.5 0 0 0-2.5 2.5v4c0 .28.22.5.5.5h7c.28 0 .5-.22.5-.5v-4C18.5 13.12 18.11 12 17.5 12z" fill="#5059C9"/>
              <path d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#7B83EB"/>
              <path d="M15 13H8c-.55 0-1 .45-1 1v4.5c0 .83.67 1.5 1.5 1.5h6c.83 0 1.5-.67 1.5-1.5V14c0-.55-.45-1-1-1z" fill="#7B83EB"/>
            </svg>
            Microsoft Teams
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════ JOURNEY 1 — EMAIL ═══════════════════ -->
    <section class="hvw-section" id="journey1">
      <div class="hvw-container">
        <h2 class="hvw-section-title">From Sign-Up to Full Access</h2>
        <p class="hvw-section-sub">Admin signs up directly on the VaptFix website using their company email address and a password. Five clear steps from registration to full dashboard access.</p>

        <div class="hvw-timeline">
          <!-- Step 1 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">01</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">🔑</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Sign-Up &amp; Sign-In</div>
                <div class="hvw-tl-desc">Admin arrives at the VAPTFIX website and clicks "Get Started." Enters company email, sets a password and confirms it, then signs in. Admin lands on the Upload Report page on a Freemium account by default.</div>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">02</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">📄</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Report Submission</div>
                <div class="hvw-tl-desc">Admin chooses one of two paths to get a VA report into the system:</div>
                <div class="hvw-tl-paths">
                  <div class="hvw-path-block path-a">
                    <div class="hvw-path-label">Path A — Upload Existing Report</div>
                    <div class="hvw-path-desc">Upload a VA report (Nessus, AWS, or custom file). Custom files are processed via OpenAI. The report is pushed into the backend automatically or manually by Super-Admin.</div>
                    <div class="hvw-tl-tags">
                      <span class="hvw-tag-pill">Nessus</span>
                      <span class="hvw-tag-pill">AWS</span>
                      <span class="hvw-tag-pill">Custom (OpenAI)</span>
                    </div>
                  </div>
                  <div class="hvw-path-divider">OR</div>
                  <div class="hvw-path-block path-b">
                    <div class="hvw-path-label">Path B — Provide Scope</div>
                    <div class="hvw-path-desc">Admin provides IP ranges/assets. Assets are segregated by category — Internal IP, External IP, Web App, Mobile App — then run through Nessus or equivalent tools, report uploaded into the backend. Freemium Gate evaluates total count.</div>
                    <div class="hvw-tl-tags">
                      <span class="hvw-tag-pill">Internal IP</span>
                      <span class="hvw-tag-pill">External IP</span>
                      <span class="hvw-tag-pill">Web App</span>
                      <span class="hvw-tag-pill">Mobile App</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">03</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">👥</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Add Users</div>
                <div class="hvw-tl-desc">Admin lands on the Add Users page and adds users to the workspace. Which teams are available depends on the admin's final plan after the Freemium Gate.</div>
              </div>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">04</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">⚠️</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Risk Criteria</div>
                <div class="hvw-tl-desc">Admin lands on the Risk Criteria page and fills in the four severity tiers: Critical, High, Medium, and Low. This is a one-time setup that defines your organisation's risk thresholds.</div>
                <div class="hvw-tl-tags">
                  <span class="hvw-tag-pill critical-tag">Critical</span>
                  <span class="hvw-tag-pill high-tag">High</span>
                  <span class="hvw-tag-pill medium-tag">Medium</span>
                  <span class="hvw-tag-pill low-tag">Low</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">05</div>
            </div>
            <div class="hvw-tl-card hvw-tl-card-final">
              <div class="hvw-tl-icon">🎉</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Onboarding Complete</div>
                <div class="hvw-tl-desc">Once risk criteria is submitted, the admin is fully onboarded and can begin using VAPTFIX — dashboard, vulnerability tracking, fix management, and team collaboration are all live.</div>
                <button class="hvw-tl-action-btn email-action-btn" @click="openEmailLogin">Get Started with Email →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>



    <!-- ═══════════════════ JOURNEY 2 — SLACK ═══════════════════ -->
    <section class="hvw-section hvw-section-alt" id="journey2">
      <div class="hvw-container">
        <h2 class="hvw-section-title">Slack Onboarding Flow</h2>
        <p class="hvw-section-sub">The Slack journey mirrors the email journey step for step, delivered as interactive Slack cards inside your workspace.</p>

        <div class="hvw-timeline">
          <!-- Step 1 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">01</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">👋</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Welcome Card</div>
                <div class="hvw-tl-desc">VaptFix bot posts a Welcome Card in your Slack workspace confirming your Admin role. You're prompted to begin onboarding by uploading a VA report or providing scope.</div>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">02</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">📄</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Report Submission</div>
                <div class="hvw-tl-desc">Admin chooses one of two paths via Slack cards:</div>
                <div class="hvw-tl-paths">
                  <div class="hvw-path-block path-a">
                    <div class="hvw-path-label">Path A — Upload Report Card</div>
                    <div class="hvw-path-desc">Upload an existing VA report directly in Slack. Supported: Nessus file, AWS Security Hub export, or custom file processed via OpenAI.</div>
                    <div class="hvw-tl-tags">
                      <span class="hvw-tag-pill">Nessus</span>
                      <span class="hvw-tag-pill">AWS</span>
                      <span class="hvw-tag-pill">Custom (OpenAI)</span>
                    </div>
                  </div>
                  <div class="hvw-path-divider">OR</div>
                  <div class="hvw-path-block path-b">
                    <div class="hvw-path-label">Path B — Provide Scope Card</div>
                    <div class="hvw-path-desc">Enter Internal IPs, External IPs, Web Apps, and Mobile Apps directly in the Slack card. VaptFix runs the scans and uploads the report to the backend.</div>
                    <div class="hvw-tl-tags">
                      <span class="hvw-tag-pill">Internal IP</span>
                      <span class="hvw-tag-pill">External IP</span>
                      <span class="hvw-tag-pill">Web App</span>
                      <span class="hvw-tag-pill">Mobile App</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">03</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">⚡</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Plan Limit Check <span class="hvw-tl-conditional">Conditional</span></div>
                <div class="hvw-tl-desc">If total assets exceed 10, a Plan Limit Card appears automatically in Slack. Admin can either upgrade to Premium / Enterprise (redirects to website) or edit scope to stay on Freemium.</div>
              </div>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">04</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">👥</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Add Users Card</div>
                <div class="hvw-tl-desc">Admin adds team members directly from Slack. Available teams depend on the final plan. Freemium unlocks Network Security and one additional team; Premium and Enterprise unlock all four.</div>
              </div>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">05</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">⚠️</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Risk Criteria Form</div>
                <div class="hvw-tl-desc">A one-time fillable form opens to set severity thresholds for Critical, High, Medium, and Low risks. This defines your organisation's vulnerability scoring baseline.</div>
                <div class="hvw-tl-tags">
                  <span class="hvw-tag-pill critical-tag">Critical</span>
                  <span class="hvw-tag-pill high-tag">High</span>
                  <span class="hvw-tag-pill medium-tag">Medium</span>
                  <span class="hvw-tag-pill low-tag">Low</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 6 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">06</div>
            </div>
            <div class="hvw-tl-card hvw-tl-card-final">
              <div class="hvw-tl-icon">🎉</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Onboarding Complete</div>
                <div class="hvw-tl-desc">A final Slack card confirms your workspace is fully set up. A link to the live VaptFix dashboard is provided directly in the card.</div>
                <button class="hvw-tl-action-btn slack-action-btn" :disabled="oauthLoading === 'slack'" @click="openSlackLogin">
                  <svg width="14" height="14" viewBox="0 0 124 124" fill="none" style="flex-shrink:0">
                    <path d="M26.3 78.8a13.15 13.15 0 0 1-13.15 13.15A13.15 13.15 0 0 1 0 78.8a13.15 13.15 0 0 1 13.15-13.15h13.15v13.15z" fill="#fff"/>
                    <path d="M32.9 78.8a13.15 13.15 0 0 1 13.15-13.15 13.15 13.15 0 0 1 13.15 13.15v32.9A13.15 13.15 0 0 1 46.05 124a13.15 13.15 0 0 1-13.15-13.15V78.8z" fill="#fff"/>
                    <path d="M46.05 26.3a13.15 13.15 0 0 1-13.15-13.15A13.15 13.15 0 0 1 46.05 0a13.15 13.15 0 0 1 13.15 13.15v13.15H46.05z" fill="#fff" opacity=".8"/>
                    <path d="M46.05 32.9a13.15 13.15 0 0 1 13.15 13.15 13.15 13.15 0 0 1-13.15 13.15H13.15A13.15 13.15 0 0 1 0 46.05a13.15 13.15 0 0 1 13.15-13.15h32.9z" fill="#fff" opacity=".8"/>
                    <path d="M97.7 46.05a13.15 13.15 0 0 1 13.15-13.15A13.15 13.15 0 0 1 124 46.05a13.15 13.15 0 0 1-13.15 13.15H97.7V46.05z" fill="#fff"/>
                    <path d="M91.1 46.05a13.15 13.15 0 0 1-13.15 13.15 13.15 13.15 0 0 1-13.15-13.15V13.15A13.15 13.15 0 0 1 77.95 0a13.15 13.15 0 0 1 13.15 13.15v32.9z" fill="#fff"/>
                    <path d="M77.95 97.7a13.15 13.15 0 0 1 13.15 13.15A13.15 13.15 0 0 1 77.95 124a13.15 13.15 0 0 1-13.15-13.15V97.7h13.15z" fill="#fff" opacity=".8"/>
                    <path d="M77.95 91.1a13.15 13.15 0 0 1-13.15-13.15 13.15 13.15 0 0 1 13.15-13.15h32.9A13.15 13.15 0 0 1 124 77.95a13.15 13.15 0 0 1-13.15 13.15H77.95z" fill="#fff" opacity=".8"/>
                  </svg>
                  {{ oauthLoading === 'slack' ? 'Connecting...' : 'Sign in with Slack →' }}
                </button>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>

    <!-- ═══════════════════ JOURNEY 3 — MS TEAMS ═══════════════════ -->
    <section class="hvw-section" id="journey3">
      <div class="hvw-container">
        <h2 class="hvw-section-title">Microsoft Teams Onboarding Flow</h2>
        <p class="hvw-section-sub">The MS Teams journey mirrors the Slack journey exactly. The VaptFix bot posts Adaptive Cards inside a Teams chat or channel. Richer views like Add Users can use a Teams Tab.</p>

        <div class="hvw-timeline">

          <!-- Step 1 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">01</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">👋</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Welcome Adaptive Card</div>
                <div class="hvw-tl-desc">VaptFix bot posts a Welcome Adaptive Card on install inside your Teams chat or channel. Confirms Admin role and presents a CTA to begin onboarding.</div>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">02</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">📄</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Report Submission</div>
                <div class="hvw-tl-desc">Choose one of two paths via Teams Adaptive Cards:</div>
                <div class="hvw-tl-paths">
                  <div class="hvw-path-block path-a">
                    <div class="hvw-path-label">Path A — Upload Report Card</div>
                    <div class="hvw-path-desc">Upload an existing VA report via the Teams card. Supported formats: Nessus, AWS, or custom file processed via OpenAI.</div>
                    <div class="hvw-tl-tags">
                      <span class="hvw-tag-pill">Nessus</span>
                      <span class="hvw-tag-pill">AWS</span>
                      <span class="hvw-tag-pill">Custom (OpenAI)</span>
                    </div>
                  </div>
                  <div class="hvw-path-divider">OR</div>
                  <div class="hvw-path-block path-b">
                    <div class="hvw-path-label">Path B — Provide Scope Card</div>
                    <div class="hvw-path-desc">Enter asset scope in the Teams Adaptive Card — Internal IPs, External IPs, Web Apps, Mobile Apps. VaptFix runs the assessment and uploads the report.</div>
                    <div class="hvw-tl-tags">
                      <span class="hvw-tag-pill">Internal IP</span>
                      <span class="hvw-tag-pill">External IP</span>
                      <span class="hvw-tag-pill">Web App</span>
                      <span class="hvw-tag-pill">Mobile App</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">03</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">⚠️</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Plan Limit Check <span class="hvw-step-badge">Conditional</span></div>
                <div class="hvw-tl-desc">If total assets exceed 10, the Plan Limit Adaptive Card appears in Teams. You can upgrade to Premium/Enterprise (redirects to VaptFix website) or edit scope to stay on Freemium.</div>
                <div class="hvw-tl-tags">
                  <span class="hvw-tag-pill">Upgrade Plan</span>
                  <span class="hvw-tag-pill">Edit Scope</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">04</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">👥</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Add Users</div>
                <div class="hvw-tl-desc">The Add Users Card or Teams Tab appears. Admin adds team members into the teams unlocked by their final plan, directly within Microsoft Teams.</div>
              </div>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">05</div>
              <div class="hvw-tl-line"></div>
            </div>
            <div class="hvw-tl-card">
              <div class="hvw-tl-icon">🎚️</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Risk Criteria</div>
                <div class="hvw-tl-desc">A one-time fillable form opens in Teams to set Critical, High, Medium, and Low severity thresholds. Consistent with the Slack journey — same form, same thresholds.</div>
                <div class="hvw-tl-tags">
                  <span class="hvw-tag-pill critical-tag">Critical</span>
                  <span class="hvw-tag-pill high-tag">High</span>
                  <span class="hvw-tag-pill medium-tag">Medium</span>
                  <span class="hvw-tag-pill low-tag">Low</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 6 -->
          <div class="hvw-tl-item">
            <div class="hvw-tl-left">
              <div class="hvw-tl-num">06</div>
            </div>
            <div class="hvw-tl-card hvw-tl-card-final">
              <div class="hvw-tl-icon">🎉</div>
              <div class="hvw-tl-body">
                <div class="hvw-tl-title">Onboarding Complete</div>
                <div class="hvw-tl-desc">The Onboarding Complete Adaptive Card confirms setup is done and links to the live dashboard as a Teams Tab. You're ready to track and fix vulnerabilities from within Teams.</div>
                <button class="hvw-tl-action-btn teams-action-btn" :disabled="oauthLoading === 'microsoft'" @click="openMicrosoftLogin">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style="flex-shrink:0">
                    <rect x="1" y="1" width="6.5" height="6.5" fill="#F25022"/>
                    <rect x="8.5" y="1" width="6.5" height="6.5" fill="#7FBA00"/>
                    <rect x="1" y="8.5" width="6.5" height="6.5" fill="#00A4EF"/>
                    <rect x="8.5" y="8.5" width="6.5" height="6.5" fill="#FFB900"/>
                  </svg>
                  {{ oauthLoading === 'microsoft' ? 'Connecting...' : 'Sign in with Microsoft →' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>





    <!-- Modals -->
    <SignUpModal :show="showSignInModal" @close="closeModal" />
    <AdminSignUpModal :show="showAdminSignUpModal" @close="closeAdminSignUpModal" @open-signin="handleOpenSignIn" />
  </div>
</template>

<script>
import Header from '@/components/admin-component/Header.vue';
import SignUpModal from '@/components/admin-component/SignUpModal.vue';
import AdminSignUpModal from '@/components/admin-component/AdminSignUpModal.vue';
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';

export default {
  name: 'HowVaptfixWorksView',
  components: { Header, SignUpModal, AdminSignUpModal },

  data() {
    return {
      showSignInModal: false,
      showAdminSignUpModal: false,
      oauthLoading: '',
      backendBase: 'https://vaptbackend.secureitlab.com',
      authStore: null,

      plans: ['Freemium', 'Premium', 'Enterprise'],

      teamAccess: [
        { name: 'Network Security',        Freemium: true,  Premium: true,  Enterprise: true  },
        { name: 'Configuration Management',Freemium: false, Premium: true,  Enterprise: true  },
        { name: 'Team 3 (TBD)',            Freemium: false, Premium: true,  Enterprise: true  },
        { name: 'Team 4 (TBD)',            Freemium: false, Premium: true,  Enterprise: true  },
      ],

      pricingCats: [
        { icon: '🖥️', name: 'Internal IP',  premium: '~$15 / IP / yr',  enterprise: '~$12 / IP / yr',  note: 'Internal network assets behind the firewall.' },
        { icon: '🌐', name: 'External IP',  premium: '~$50 / IP / yr',  enterprise: '~$40 / IP / yr',  note: 'Internet-facing assets with higher exposure risk.' },
        { icon: '🕸️', name: 'Web App',      premium: '~$120 / app / yr',enterprise: '~$100 / app / yr',note: 'Web applications including all endpoints.' },
        { icon: '📱', name: 'Mobile App',   premium: '~$180 / app / yr',enterprise: '~$150 / app / yr',note: 'iOS and Android applications.' },
      ],
    };
  },

  mounted() {
    this.authStore = useAuthStore();
  },

  methods: {
    scrollTo(id) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    openEmailLogin() {
      this.showAdminSignUpModal = true;
    },

    closeAdminSignUpModal() {
      this.showAdminSignUpModal = false;
    },

    handleOpenSignIn() {
      this.showAdminSignUpModal = false;
      this.showSignInModal = true;
    },

    closeModal() {
      this.showSignInModal = false;
    },

    async openSlackLogin() {
      if (!this.authStore) return;
      this.oauthLoading = 'slack';
      try {
        const adminId = this.authStore.user?._id || this.authStore.user?.id || null;
        const res = await this.authStore.getSlackOAuthUrl(this.backendBase, adminId);
        if (res.status && res.data?.auth_url) {
          const width = 1000;
          const height = 700;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          window.open(res.data.auth_url, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
        } else {
          Swal.fire({ icon: 'error', title: 'Slack Error', text: 'Could not get Slack sign-in URL. Please try again.' });
        }
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Slack Error', text: 'Could not initiate Slack sign-in. Please try again.' });
      } finally {
        this.oauthLoading = '';
      }
    },

    async openMicrosoftLogin() {
      if (!this.authStore) return;
      this.oauthLoading = 'microsoft';
      try {
        const adminId = this.authStore.user?._id || this.authStore.user?.id || null;
        const redirectUri = `${window.location.origin}/microsoft/callback`;
        const res = await this.authStore.getMicrosoftOAuthUrl(redirectUri, adminId);
        if (res.status && res.data?.auth_url) {
          const width = 1000;
          const height = 700;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          window.open(res.data.auth_url, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
        } else {
          Swal.fire({ icon: 'error', title: 'Microsoft Error', text: 'Could not get Microsoft sign-in URL. Please try again.' });
        }
      } catch (e) {
        Swal.fire({ icon: 'error', title: 'Microsoft Error', text: 'Could not initiate Microsoft sign-in. Please try again.' });
      } finally {
        this.oauthLoading = '';
      }
    },
  },
};
</script>

<style scoped>
/* ── Root & Container ── */
.hvw-root {
  font-family: 'Inter', sans-serif;
  background: #f8f9fc;
  color: #1e293b;
  min-height: 100vh;
}
.hvw-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── HERO ── */
.hvw-hero {
  background: linear-gradient(135deg, #241447 0%, #0f696e 100%);
  padding: 100px 0 80px;
  text-align: center;
}
.hvw-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.9);
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 28px;
}
.hvw-tag-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #4ade80;
  display: inline-block;
}
.hvw-hero-title {
  font-size: clamp(36px, 5vw, 58px);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin: 0 0 20px;
}
.hvw-accent { color: #5eead4; }
.hvw-hero-sub {
  font-size: 17px;
  color: rgba(255,255,255,0.78);
  max-width: 640px;
  margin: 0 auto 40px;
  line-height: 1.7;
}
.hvw-channels {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
.hvw-channel-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}
.email-badge  { background: rgba(79,70,229,0.25); color: #c7d2fe; border: 1px solid rgba(79,70,229,0.4); }
.slack-badge  { background: rgba(224,30,90,0.20); color: #fecdd3; border: 1px solid rgba(224,30,90,0.35); }
.teams-badge  { background: rgba(80,89,201,0.22); color: #c7d2fe; border: 1px solid rgba(80,89,201,0.4); }

/* ── Sections ── */
.hvw-section { padding: 80px 0; background: #fff; }
.hvw-section-alt { background: #f8f9fc; }
.hvw-section-kicker {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #64748b;
  margin-bottom: 14px;
}
.hvw-kicker-num {
  background: #241447;
  color: #fff;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  margin-right: 6px;
}
.hvw-kicker-badge {
  background: #0f696e;
  color: #fff;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 11px;
  margin-right: 6px;
}
.hvw-section-title {
  font-size: clamp(24px, 3.5vw, 36px);
  font-weight: 800;
  color: #241447;
  margin: 0 0 14px;
}
.hvw-section-sub {
  font-size: 16px;
  color: #64748b;
  max-width: 680px;
  line-height: 1.7;
  margin-bottom: 48px;
}

/* ── JOURNEY 1 TIMELINE ── */
.hvw-timeline { display: flex; flex-direction: column; gap: 0; }
.hvw-tl-item  { display: flex; gap: 20px; align-items: flex-start; }
.hvw-tl-left  { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 48px; }
.hvw-tl-num   {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: #241447;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.hvw-tl-line  { width: 2px; flex: 1; background: #e2e8f0; min-height: 40px; margin: 4px 0; }
.hvw-tl-card  {
  display: flex;
  gap: 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 22px 24px;
  margin-bottom: 16px;
  flex: 1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.hvw-tl-card:hover { box-shadow: 0 6px 20px rgba(36,20,71,0.10); }
.hvw-tl-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}
.hvw-tl-action-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
.hvw-tl-action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.email-action-btn  { background: #241447; color: #fff; }
.slack-action-btn  { background: #4A154B; color: #fff; }
.teams-action-btn  { background: #5059C9; color: #fff; }

.hvw-tl-conditional,
.hvw-step-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  background: #fef3c7;
  color: #92400e;
  border-radius: 10px;
  padding: 2px 8px;
  margin-left: 8px;
  vertical-align: middle;
}
.hvw-tl-card-final { border: 2px solid #0f696e; background: #f0fdfa; }
.hvw-step-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  background: #fef3c7;
  color: #92400e;
  border-radius: 10px;
  padding: 2px 8px;
  margin-left: 8px;
  vertical-align: middle;
}
.hvw-tl-icon  { font-size: 28px; flex-shrink: 0; margin-top: 2px; }
.hvw-tl-title { font-size: 17px; font-weight: 700; color: #241447; margin-bottom: 8px; }
.hvw-tl-desc  { font-size: 14px; color: #475569; line-height: 1.65; }

/* Paths A/B */
.hvw-tl-paths { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; margin-top: 18px; align-items: stretch; }
.hvw-path-block { background: #f8f9fc; border-radius: 14px; padding: 22px 20px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; }
.hvw-path-block.path-a { border-top: 3px solid #0f696e; }
.hvw-path-block.path-b { border-top: 3px solid #241447; }
.hvw-path-label { font-size: 13px; font-weight: 800; color: #0f696e; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.8px; }
.path-b .hvw-path-label { color: #241447; }
.hvw-path-desc  { font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 14px; flex: 1; }
.hvw-path-divider { display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; color: #94a3b8; flex-shrink: 0; width: 32px; }

/* Tags */
.hvw-tl-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.hvw-tag-pill {
  background: #ede9fe;
  color: #241447;
  border-radius: 12px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
}
.critical-tag { background: #fee2e2; color: #991b1b; }
.high-tag     { background: #ffedd5; color: #9a3412; }
.medium-tag   { background: #fef9c3; color: #854d0e; }
.low-tag      { background: #dcfce7; color: #166534; }

/* ── FREEMIUM GATE ── */
.hvw-gate-section {
  background: linear-gradient(135deg, #241447 0%, #0f696e 100%);
  padding: 80px 0;
}
.hvw-gate-grid {
  display: flex;
  align-items: stretch;
  gap: 20px;
  margin: 36px 0 28px;
  flex-wrap: wrap;
}
.hvw-gate-card {
  flex: 1;
  min-width: 220px;
  border-radius: 16px;
  padding: 28px 24px;
  text-align: center;
}
.gate-free { background: rgba(255,255,255,0.12); border: 1px solid rgba(74,222,128,0.4); }
.gate-over { background: rgba(255,255,255,0.10); border: 1px solid rgba(251,191,36,0.4); }
.hvw-gate-icon  { font-size: 32px; margin-bottom: 12px; }
.hvw-gate-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 10px; }
.hvw-gate-desc  { font-size: 14px; color: rgba(255,255,255,0.75); line-height: 1.6; margin-bottom: 16px; }
.hvw-gate-limit {
  display: inline-block;
  padding: 5px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  background: rgba(255,255,255,0.15);
  color: #fff;
}
.hvw-gate-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: rgba(255,255,255,0.5);
  flex-shrink: 0;
}
.hvw-gate-note {
  background: rgba(255,255,255,0.10);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 14px;
  color: rgba(255,255,255,0.85);
  line-height: 1.6;
}

/* ── SLACK CARD MOCKUPS RAIL ── */
.hvw-slack-rail {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 36px;
}

.hsc-mockup {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  transition: box-shadow 0.2s, transform 0.2s;
}
.hsc-mockup:hover { box-shadow: 0 8px 28px rgba(36,20,71,0.14); transform: translateY(-2px); }
.hsc-mockup-conditional { border-top: 3px solid #f59e0b; }
.hsc-mockup-success { border-top: 3px solid #10b981; }

.hsc-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #f8f9fc;
  border-bottom: 1px solid #f1f5f9;
}
.hsc-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #541554;
  display: inline-block;
}
.teams-dot { background: #5059C9; }
.hsc-appname { font-size: 13px; font-weight: 700; color: #241447; }
.hsc-apptag {
  font-size: 9px;
  font-weight: 700;
  background: #e2e8f0;
  color: #64748b;
  padding: 1px 5px;
  border-radius: 3px;
  letter-spacing: 0.5px;
  margin-left: 2px;
}
.teams-tag { background: #dbeafe; color: #1e40af; }
.hsc-header-teams { background: #f0f4ff; }

.hsc-body { padding: 16px 16px 20px; }
.hsc-card-num-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 2px 8px;
  margin-bottom: 10px;
}
.conditional-badge { background: #fef3c7; color: #92400e; }

.hsc-title { font-size: 16px; font-weight: 800; color: #1e293b; margin-bottom: 10px; }
.hsc-desc  { font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 14px; }
.hsc-desc em { color: #64748b; }

/* Scope fields inside card 3 */
.hsc-scope-fields { background: #f8f9fc; border-radius: 8px; padding: 12px; margin-bottom: 14px; }
.hsc-field-row { display: flex; align-items: center; gap: 10px; padding: 5px 0; border-bottom: 1px solid #f1f5f9; }
.hsc-field-row:last-child { border-bottom: none; }
.hsc-field-label { font-size: 12px; font-weight: 600; color: #241447; min-width: 90px; }
.hsc-field-input { font-size: 12px; color: #94a3b8; font-style: italic; }

.hsc-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.hsc-btn-primary {
  background: #241447;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.hsc-btn-primary:hover { background: #3a2070; }
.hsc-btn-secondary {
  background: #fff;
  color: #241447;
  border: 1.5px solid #cbd5e1;
  border-radius: 6px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s;
}
.hsc-btn-secondary:hover { border-color: #241447; }
.hsc-btn-success {
  background: #0f696e;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 9px 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.hsc-btn-success:hover { background: #0a4e52; }

/* ── TEAMS JOURNEY ── */
.hvw-teams-table-wrap { overflow-x: auto; margin-bottom: 36px; }
.hvw-journey-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.hvw-journey-table th {
  background: #241447;
  color: #fff;
  padding: 12px 16px;
  text-align: left;
  font-weight: 700;
}
.hvw-journey-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: top;
  color: #334155;
}
.hvw-journey-table tr:last-child td { border-bottom: none; }
.hvw-row-conditional td { background: #fffbeb; }
.hvw-card-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px; height: 26px;
  border-radius: 50%;
  background: #241447;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
}
.cond-badge { background: #f59e0b; }
.hvw-conditional-label { font-size: 11px; font-weight: 600; color: #92400e; background: #fef3c7; padding: 1px 6px; border-radius: 8px; }

.hvw-teams-mockup-label {
  font-size: 14px;
  font-weight: 700;
  color: #241447;
  margin-bottom: 14px;
}
.hvw-teams-mockup { max-width: 500px; }

/* ── PLATFORM NOTE ── */
.hvw-platform-note { margin-top: 28px; }
.hvw-platform-box {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  border-radius: 12px;
  padding: 18px 20px;
  font-size: 14px;
  color: #134e4a;
}
.hvw-platform-box span { font-size: 22px; flex-shrink: 0; }
.hvw-platform-box strong { display: block; margin-bottom: 4px; color: #0f766e; }
.hvw-platform-box p { margin: 0; line-height: 1.6; }

/* ── PLAN TABLE ── */
.hvw-plan-table { border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; }
.hvw-plan-header, .hvw-plan-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  align-items: center;
}
.hvw-plan-header {
  background: #241447;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 0;
}
.hvw-plan-header > div { padding: 14px 20px; }
.hvw-plan-row { border-bottom: 1px solid #f1f5f9; }
.hvw-plan-row:last-child { border-bottom: none; }
.hvw-plan-row:nth-child(even) { background: #f8f9fc; }
.hvw-plan-col-team { padding: 14px 20px; font-size: 14px; font-weight: 600; color: #241447; }
.hvw-plan-col { padding: 14px 20px; font-size: 14px; text-align: center; }
.hvw-check { color: #16a34a; font-size: 18px; font-weight: 900; }
.hvw-cross  { color: #dc2626; font-size: 16px; font-weight: 900; }

/* ── PRICING ── */
.hvw-pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}
.hvw-pricing-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.hvw-pricing-card:hover { box-shadow: 0 8px 24px rgba(36,20,71,0.10); }
.hvw-pricing-icon { font-size: 32px; margin-bottom: 12px; }
.hvw-pricing-name { font-size: 17px; font-weight: 800; color: #241447; margin-bottom: 8px; }
.hvw-pricing-free {
  font-size: 11px;
  font-weight: 700;
  color: #0f696e;
  background: #f0fdfa;
  border-radius: 10px;
  padding: 3px 10px;
  display: inline-block;
  margin-bottom: 14px;
}
.hvw-pricing-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}
.hvw-pricing-row:last-of-type { border-bottom: none; }
.hvw-pricing-label { font-size: 12px; color: #64748b; font-weight: 600; }
.hvw-pricing-val   { font-size: 14px; font-weight: 800; color: #241447; }
.hvw-pricing-note  { font-size: 12px; color: #94a3b8; margin-top: 12px; line-height: 1.5; }
.hvw-pricing-disclaimer {
  background: #fefce8;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 14px 18px;
  font-size: 13px;
  color: #78350f;
  line-height: 1.6;
}

/* ── CTA / LOGIN ── */
.hvw-cta-section {
  background: linear-gradient(135deg, #241447 0%, #0f696e 100%);
  padding: 90px 0;
  text-align: center;
}
.hvw-cta-title {
  font-size: clamp(26px, 4vw, 40px);
  font-weight: 800;
  color: #fff;
  margin-bottom: 14px;
}
.hvw-cta-sub {
  font-size: 16px;
  color: rgba(255,255,255,0.75);
  max-width: 560px;
  margin: 0 auto 48px;
  line-height: 1.7;
}
.hvw-login-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  text-align: left;
}
.hvw-login-card {
  background: #fff;
  border-radius: 18px;
  padding: 28px 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.hvw-login-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.18); }
.hvw-login-icon { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
.email-icon { background: #EEF2FF; }
.slack-icon { background: #fff0f3; }
.teams-icon { background: #EEF6FF; }
.hvw-login-card-title { font-size: 18px; font-weight: 800; color: #241447; }
.hvw-login-card-desc  { font-size: 14px; color: #64748b; line-height: 1.6; }
.hvw-login-steps { display: flex; flex-direction: column; gap: 6px; }
.hvw-ls { font-size: 13px; color: #475569; display: flex; align-items: flex-start; gap: 4px; }
.hvw-login-btn {
  margin-top: auto;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s, transform 0.15s;
}
.hvw-login-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
.hvw-login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.email-btn     { background: #241447; color: #fff; }
.slack-btn     { background: #4A154B; color: #fff; }
.microsoft-btn { background: #0078d4; color: #fff; }

/* ── SLACK DOC-STYLE CARDS ── */
.hsc-cards-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 32px;
}
.hsc-doc-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.hsc-doc-card-warn { border-left: 4px solid #f59e0b; }
.hsc-doc-card-success { border-left: 4px solid #10b981; }

.hsc-doc-label {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  padding: 10px 16px;
  background: #f8f9fc;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  gap: 6px;
}
.hsc-cond-pill {
  font-size: 10px;
  font-weight: 700;
  background: #fef3c7;
  color: #92400e;
  padding: 2px 8px;
  border-radius: 10px;
}

.hsc-doc-mock {
  border: 1px solid #dde0e6;
  border-radius: 6px;
  margin: 14px 16px 16px;
  overflow: hidden;
  background: #fff;
}
.hsc-doc-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px 8px;
  border-bottom: 1px solid #f0f2f5;
  background: #fafbfc;
}
.hsc-doc-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #541554;
  display: inline-block;
  flex-shrink: 0;
}
.hsc-dot-green { background: #10b981; }
.hsc-doc-appname {
  font-size: 13px;
  font-weight: 700;
  color: #1d1c1d;
}
.hsc-doc-apptag {
  font-size: 10px;
  font-weight: 500;
  color: #868686;
  letter-spacing: 0.3px;
}

.hsc-doc-body {
  padding: 14px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hsc-doc-title {
  font-size: 16px;
  font-weight: 800;
  color: #1d1c1d;
}
.hsc-doc-desc {
  font-size: 14px;
  color: #444;
  line-height: 1.6;
}
.hsc-doc-note {
  font-size: 13px;
  color: #666;
  font-style: italic;
  line-height: 1.55;
}
.hsc-doc-btn-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.hsc-doc-btn {
  background: #3d1147;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
  align-self: flex-start;
}
.hsc-doc-btn:hover { background: #5a1f6b; }
.hsc-doc-btn-green {
  background: #0f696e;
}
.hsc-doc-btn-green:hover { background: #0a4e52; }
.hsc-doc-btn-outline {
  background: #fff;
  color: #1d1c1d;
  border: 1.5px solid #c4c4c4;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s;
  margin-top: 4px;
}
.hsc-doc-btn-outline:hover { border-color: #3d1147; }

/* ── SLACK PROPER CARDS ── */
.slack-cards-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 36px;
}
.slack-card-label {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  padding-left: 2px;
}
.slack-cond-badge {
  display: inline-block;
  background: #fef3c7;
  color: #92400e;
  font-size: 10px;
  font-weight: 700;
  border-radius: 8px;
  padding: 1px 7px;
  margin-left: 6px;
  vertical-align: middle;
  text-transform: none;
  letter-spacing: 0;
}
.slack-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 6px rgba(0,0,0,0.07);
}
.slack-card-warn    { border-left: 4px solid #f59e0b; }
.slack-card-success { border-left: 4px solid #22c55e; }

.slack-card-top {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px 9px;
  border-bottom: 1px solid #f1f5f9;
  background: #fafafa;
}
.slack-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #4A154B;
  display: inline-block;
  flex-shrink: 0;
}
.slack-app {
  font-size: 13px;
  font-weight: 700;
  color: #1a1a1a;
}
.slack-tag {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.3px;
}

.slack-card-body {
  padding: 14px 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.slack-title {
  font-size: 16px;
  font-weight: 800;
  color: #1a1a1a;
  line-height: 1.3;
}
.slack-desc {
  font-size: 14px;
  color: #374151;
  line-height: 1.65;
}
.slack-note {
  font-size: 13px;
  color: #6b7280;
  font-style: italic;
  line-height: 1.6;
}
.slack-btn-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.slack-btn {
  background: #4A154B;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.2s;
  white-space: nowrap;
}
.slack-btn:hover { background: #3a0d3b; }
.slack-btn-green { background: #15803d; }
.slack-btn-green:hover { background: #166534; }
.slack-btn-out {
  background: #fff;
  color: #374151;
  border: 1.5px solid #d1d5db;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  transition: border-color 0.2s, color 0.2s;
}
.slack-btn-out:hover { border-color: #4A154B; color: #4A154B; }

/* ── SLACK DOC-STYLE CARDS ── */
.hsc-cards-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-bottom: 36px;
}

.hsc-doc-card {
  max-width: 600px;
}
.hsc-doc-label {
  font-size: 13px;
  font-weight: 700;
  color: #241447;
  margin-bottom: 10px;
  padding-left: 2px;
}
.hsc-cond-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  background: #fef3c7;
  color: #92400e;
  border-radius: 10px;
  padding: 1px 8px;
  margin-left: 6px;
  vertical-align: middle;
}

.hsc-doc-mock {
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.hsc-doc-card-warn .hsc-doc-mock  { border-left: 4px solid #f59e0b; }
.hsc-doc-card-success .hsc-doc-mock { border-left: 4px solid #10b981; }

.hsc-doc-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px 8px;
  border-bottom: 1px solid #f1f5f9;
}
.hsc-doc-dot {
  width: 9px; height: 9px;
  border-radius: 50%;
  background: #541554;
  display: inline-block;
  flex-shrink: 0;
}
.hsc-dot-green { background: #10b981; }
.hsc-doc-appname {
  font-size: 13px;
  font-weight: 700;
  color: #1a1a2e;
}
.hsc-doc-apptag {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 0.4px;
}

.hsc-doc-body {
  padding: 16px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.hsc-doc-title {
  font-size: 17px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.3;
}
.hsc-doc-desc {
  font-size: 14px;
  color: #374151;
  line-height: 1.65;
}
.hsc-doc-note {
  font-size: 13px;
  color: #6b7280;
  font-style: italic;
  line-height: 1.6;
}
.hsc-doc-btn-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 4px;
}
.hsc-doc-btn {
  display: inline-block;
  background: #3d1560;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 4px;
  transition: background 0.2s;
}
.hsc-doc-btn:hover { background: #2a0d45; }
.hsc-doc-btn-green { background: #0f696e; }
.hsc-doc-btn-green:hover { background: #0a4e52; }
.hsc-doc-btn-outline {
  display: inline-block;
  background: #fff;
  color: #374151;
  border: 1.5px solid #d1d5db;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
  transition: border-color 0.2s;
}
.hsc-doc-btn-outline:hover { border-color: #3d1560; color: #3d1560; }

/* ── TEAMS CARD MOCKUPS ── */
.hvw-teams-rail {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
  margin-bottom: 32px;
}

.htc-mockup {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  transition: box-shadow 0.2s, transform 0.2s;
}
.htc-mockup:hover { box-shadow: 0 8px 24px rgba(80,89,201,0.14); transform: translateY(-2px); }
.htc-conditional  { border-top: 3px solid #f59e0b; }
.htc-success      { border-top: 3px solid #10b981; }

.htc-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  background: #f3f4f8;
  border-bottom: 1px solid #e8eaf0;
}
.htc-header-warn    { background: #fffbeb; border-bottom-color: #fde68a; }
.htc-header-success { background: #f0fdf4; border-bottom-color: #bbf7d0; }

.htc-app-icon {
  width: 22px; height: 22px;
  background: #5059C9;
  border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.htc-appname { font-size: 12px; font-weight: 700; color: #3d3d3d; }
.htc-apptag {
  font-size: 9px; font-weight: 700;
  background: #dbeafe; color: #1e40af;
  padding: 1px 5px; border-radius: 3px;
  letter-spacing: 0.5px;
}
.htc-num {
  margin-left: auto;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: #5059C9;
  color: #fff;
  font-size: 11px; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.htc-num-warn { background: #f59e0b; }
.htc-cond-tag {
  font-size: 10px; font-weight: 700;
  color: #92400e; background: #fef3c7;
  padding: 2px 7px; border-radius: 8px;
}

.htc-body { padding: 14px 16px 18px; }
.htc-icon  { font-size: 26px; margin-bottom: 8px; }
.htc-title {
  font-size: 15px; font-weight: 800;
  color: #1a1a2e; margin-bottom: 10px;
}
.htc-divider {
  height: 1px; background: #e8eaf0;
  margin-bottom: 14px;
}
.htc-btn-row { display: flex; gap: 8px; flex-wrap: wrap; }
.htc-btn-primary {
  background: #5059C9;
  color: #fff; border: none;
  border-radius: 4px;
  padding: 8px 14px;
  font-size: 12px; font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.htc-btn-primary:hover { background: #3d46b0; }
.htc-btn-secondary {
  background: #fff; color: #3d3d3d;
  border: 1.5px solid #d1d5db;
  border-radius: 4px;
  padding: 8px 14px;
  font-size: 12px; font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s;
}
.htc-btn-secondary:hover { border-color: #5059C9; }
.htc-btn-success {
  background: #0f696e; color: #fff;
  border: none; border-radius: 4px;
  padding: 8px 14px;
  font-size: 12px; font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.htc-btn-success:hover { background: #0a4e52; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .slack-cards-list { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .slack-cards-list { grid-template-columns: 1fr; }
  .hvw-tl-paths { grid-template-columns: 1fr; }
  .hvw-path-divider { padding-top: 0; }
  .hvw-gate-grid { flex-direction: column; }
  .hvw-gate-arrow { transform: rotate(90deg); }
  .hvw-plan-header, .hvw-plan-row { grid-template-columns: 1.5fr 1fr 1fr 1fr; }
}
</style>
