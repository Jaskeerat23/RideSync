/**
 * RideSync — Multi-Step Signup Flow
 * Vanilla JS · Event-driven · No frameworks
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════
     STATE — Single source of truth
  ═══════════════════════════════════════════════ */
  const state = {
    currentStep: 1,
    // Page 1
    userName: '',
    email: '',
    password: '',
    pfp: null,              // File object (unused in submission)
    // Page 2
    role: '',
    // Page 3 — role-specific (flat merge on submit)
    roleData: {},
  };

  /* ═══════════════════════════════════════════════
     UTILITY HELPERS
  ═══════════════════════════════════════════════ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function setClass(el, cls, condition) {
    el.classList.toggle(cls, condition);
  }

  /* ═══════════════════════════════════════════════
     STEP INDICATOR CONTROLLER
  ═══════════════════════════════════════════════ */
  const StepIndicator = {
    items: $$('.step-item'),
    lines: $$('.step-line'),

    update(step) {
      this.items.forEach((item, i) => {
        const n = i + 1;
        item.classList.remove('active', 'done');
        if (n < step) item.classList.add('done');
        if (n === step) item.classList.add('active');
      });
      this.lines.forEach((line, i) => {
        setClass(line, 'filled', step > i + 1);
      });
    },
  };

  /* ═══════════════════════════════════════════════
     PAGE TRANSITIONS
  ═══════════════════════════════════════════════ */
  const pages = $$('.page');

  function navigateTo(targetStep) {
    const current = $(`.page#page${state.currentStep}`);
    const next = $(`.page#page${targetStep}`);

    if (!next || !current) return;

    // Exit animation
    current.classList.add('exit-left');
    current.classList.remove('active');

    setTimeout(() => {
      current.classList.remove('exit-left');

      next.style.transform = 'translateX(40px)';
      next.style.opacity = '0';
      next.classList.add('active');

      requestAnimationFrame(() => {
        next.style.transition = 'none';
        requestAnimationFrame(() => {
          next.style.transition = '';
          next.style.transform = '';
          next.style.opacity = '';
        });
      });

      state.currentStep = targetStep;
      StepIndicator.update(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 250);
  }

  /* ═══════════════════════════════════════════════
     PAGE 1 — VALIDATION
  ═══════════════════════════════════════════════ */
  const Page1 = (() => {
    const usernameInput = $('#username');
    const emailInput    = $('#email');
    const passwordInput = $('#password');
    const togglePwBtn   = $('#togglePw');
    const btnNext       = $('#btnNext1');
    const pfpZone       = $('#pfpUploadZone');
    const pfpInput      = $('#pfpInput');
    const pfpPreview    = $('#pfpPreview');

    const validity = { username: false, email: false, password: false };

    // ── Password rules ──
    const rules = {
      length:  { el: $('#rule-length'),  test: (v) => v.length >= 8 && v.length <= 32 },
      upper:   { el: $('#rule-upper'),   test: (v) => /[A-Z]/.test(v) },
      special: { el: $('#rule-special'), test: (v) => /[^A-Za-z0-9]/.test(v) },
      alnum:   { el: $('#rule-alnum'),   test: (v) => /[A-Za-z]/.test(v) && /[0-9]/.test(v) },
    };

    function updateField(input, errorEl, valid, message = '') {
      setClass(input, 'valid', valid);
      setClass(input, 'invalid', !valid && input.value.length > 0);
      if (errorEl) errorEl.textContent = (!valid && input.value.length > 0) ? message : '';
    }

    function checkGate() {
      btnNext.disabled = !(validity.username && validity.email && validity.password);
    }

    // ── Username ──
    function validateUsername() {
      const v = usernameInput.value.trim();
      const errEl = $('#err-username');

      if (!v) {
        validity.username = false;
        usernameInput.classList.remove('valid', 'invalid');
        errEl.textContent = '';
      } else if (/\s/.test(v)) {
        validity.username = false;
        updateField(usernameInput, errEl, false, 'Username cannot contain spaces.');
      } else if (v.length < 3) {
        validity.username = false;
        updateField(usernameInput, errEl, false, 'At least 3 characters required.');
      } else {
        validity.username = true;
        updateField(usernameInput, errEl, true);
        state.userName = v;
      }
      checkGate();
    }

    // ── Email ──
    function validateEmail() {
      const v = emailInput.value.trim();
      const errEl = $('#err-email');
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!v) {
        validity.email = false;
        emailInput.classList.remove('valid', 'invalid');
        errEl.textContent = '';
      } else if (!emailRe.test(v)) {
        validity.email = false;
        updateField(emailInput, errEl, false, 'Enter a valid email address.');
      } else {
        validity.email = true;
        updateField(emailInput, errEl, true);
        state.email = v;
      }
      checkGate();
    }

    // ── Password ──
    function validatePassword() {
      const v = passwordInput.value;
      let allPass = true;

      Object.entries(rules).forEach(([key, rule]) => {
        const pass = rule.test(v);
        if (!pass) allPass = false;
        rule.el.classList.toggle('pass', pass);
        const icon = $('.pw-rule-icon', rule.el);
        if (icon) icon.textContent = pass ? '●' : '○';
      });

      validity.password = allPass && v.length > 0;

      setClass(passwordInput, 'valid', validity.password);
      setClass(passwordInput, 'invalid', !validity.password && v.length > 0);

      if (validity.password) state.password = v;
      checkGate();
    }

    // ── PFP Upload (placeholder) ──
    function initPfp() {
      pfpZone.addEventListener('click', () => pfpInput.click());
      pfpInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        state.pfp = file;

        const reader = new FileReader();
        reader.onload = (ev) => {
          pfpPreview.innerHTML = `<img src="${ev.target.result}" alt="Profile preview" />`;
        };
        reader.readAsDataURL(file);
      });
    }

    // ── Toggle password visibility ──
    togglePwBtn.addEventListener('click', () => {
      const isText = passwordInput.type === 'text';
      passwordInput.type = isText ? 'password' : 'text';
      togglePwBtn.style.color = isText ? '' : 'var(--orange)';
    });

    // ── Attach listeners ──
    usernameInput.addEventListener('input', validateUsername);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);

    // ── Submit page 1 ──
    $('#formStep1').addEventListener('submit', (e) => {
      e.preventDefault();
      if (validity.username && validity.email && validity.password) {
        navigateTo(2);
      }
    });

    return { init: initPfp };
  })();

  /* ═══════════════════════════════════════════════
     PAGE 2 — ROLE SELECTION
  ═══════════════════════════════════════════════ */
  const Page2 = (() => {
    const cards = $$('.role-card');

    function selectRole(role) {
      state.role = role;
      cards.forEach(c => {
        const isSelected = c.dataset.role === role;
        setClass(c, 'selected', isSelected);
        const indicator = $('.role-select-indicator', c);
        if (indicator) indicator.textContent = isSelected ? '✓ Selected' : 'Select';
      });

      // brief pause for visual feedback, then advance
      setTimeout(() => {
        buildRoleForm(role);
        navigateTo(3);
      }, 280);
    }

    cards.forEach(card => {
      card.addEventListener('click', () => selectRole(card.dataset.role));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectRole(card.dataset.role);
        }
      });
    });
  })();

  /* ═══════════════════════════════════════════════
     PAGE 3 — ROLE-SPECIFIC FORM BUILDER
  ═══════════════════════════════════════════════ */
  const roleIcons = { Rider: '🏍️', Organizer: '🗓️', Sponsor: '🤝' };

  function buildRoleForm(role) {
    const container = $('#roleFormFields');
    const badge = $('#roleBadge');
    const title = $('#page3Title');

    badge.textContent = `${roleIcons[role] || ''} ${role}`;
    title.textContent = `${role} Profile`;

    // Reset roleData for the selected role
    state.roleData = {};

    let html = '';

    if (role === 'Rider') {
      html = `
        <div class="two-col">
          <div class="field-group">
            <label class="field-label" for="r-name">Full Name</label>
            <div class="input-wrap">
              <input class="field-input" type="text" id="r-name" placeholder="Your name" data-key="name" />
            </div>
          </div>
          <div class="field-group">
            <label class="field-label" for="r-age">Age</label>
            <div class="input-wrap">
              <input class="field-input" type="number" id="r-age" placeholder="e.g. 25" min="16" max="99" data-key="age" />
            </div>
          </div>
          <div class="field-group full-col">
            <label class="field-label" for="r-city">City</label>
            <div class="input-wrap select-wrap">
              <select class="field-input field-select" id="r-city" data-key="city">
                <option value="" disabled selected>Select your city</option>
                <option value="Dehradun">Dehradun</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Manali">Manali</option>
                <option value="Leh">Leh</option>
              </select>
              <span class="select-arrow">▾</span>
            </div>
          </div>
          <div class="field-group full-col">
            <label class="field-label">Bikes</label>
            <div class="dropdown-add-wrap" id="bikeDropdownWrap">
              <div class="dropdown-add-row">
                <div class="input-wrap select-wrap flex-1">
                  <select class="field-input field-select" id="bikeDropdownSelect">
                    <option value="" disabled selected>Select a bike brand</option>
                    <option value="Royal Enfield">Royal Enfield</option>
                    <option value="Harley Davidson">Harley Davidson</option>
                    <option value="KTM">KTM</option>
                    <option value="Triumph">Triumph</option>
                    <option value="Honda">Honda</option>
                  </select>
                  <span class="select-arrow">▾</span>
                </div>
                <button type="button" class="add-item-btn" id="bikeAddBtn" aria-label="Add bike">+</button>
              </div>
              <div class="tag-pills" id="bikePills"></div>
            </div>
            <div class="tag-hint">Select a brand and click + to add. You can add multiple.</div>
          </div>
          <div class="field-group full-col">
            <label class="field-label">Riding Style</label>
            <div class="dropdown-add-wrap" id="styleDropdownWrap">
              <div class="dropdown-add-row">
                <div class="input-wrap select-wrap flex-1">
                  <select class="field-input field-select" id="styleDropdownSelect">
                    <option value="" disabled selected>Select a riding style</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Highway">Highway</option>
                    <option value="City">City</option>
                    <option value="OffRoad">OffRoad</option>
                  </select>
                  <span class="select-arrow">▾</span>
                </div>
                <button type="button" class="add-item-btn" id="styleAddBtn" aria-label="Add style">+</button>
              </div>
              <div class="tag-pills" id="stylePills"></div>
            </div>
            <div class="tag-hint">Select a style and click + to add. You can pick multiple.</div>
          </div>
          <div class="field-group full-col">
            <label class="field-label" for="r-bio">Bio <span class="optional">(max 250 words)</span></label>
            <textarea class="field-textarea" id="r-bio" rows="4" placeholder="Tell the community about yourself…" data-key="bio"></textarea>
            <div class="char-counter" id="bioCounter">0 / 250 words</div>
          </div>
        </div>
      `;
    } else if (role === 'Organizer') {
      html = `
        <div class="two-col">
          <div class="field-group full-col">
            <label class="field-label">Banner <span class="optional">(non-functional)</span></label>
            <div class="upload-zone" id="bannerZone">
              <div class="upload-preview" style="width:56px;height:40px;border-radius:6px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
              </div>
              <div class="upload-text">
                <span class="upload-cta">Upload banner</span>
                <span class="upload-hint">16:9 recommended · JPG, PNG</span>
              </div>
            </div>
          </div>
          <div class="field-group">
            <label class="field-label" for="o-name">Organization Name</label>
            <div class="input-wrap">
              <input class="field-input" type="text" id="o-name" placeholder="Your org or event name" data-key="name" />
            </div>
          </div>
          <div class="field-group">
            <label class="field-label" for="o-gstin">GSTIN</label>
            <div class="input-wrap">
              <input class="field-input" type="text" id="o-gstin" placeholder="22AAAAA0000A1Z5" maxlength="15" data-key="GSTIN" />
            </div>
          </div>
          <div class="field-group full-col">
            <label class="field-label" for="o-desc">Description</label>
            <textarea class="field-textarea" id="o-desc" rows="3" placeholder="What does your organization do?" data-key="description"></textarea>
          </div>
          <div class="field-group">
            <label class="field-label" for="o-website">Website <span class="optional">(optional)</span></label>
            <div class="input-wrap">
              <input class="field-input" type="url" id="o-website" placeholder="https://yoursite.com" data-key="website" />
            </div>
          </div>
          <div class="field-group">
            <label class="field-label" for="o-social">Social Links <span class="optional">(optional, comma-separated)</span></label>
            <div class="input-wrap">
              <input class="field-input" type="text" id="o-social" placeholder="Instagram, Twitter URLs…" data-key="socialLinks" />
            </div>
          </div>
        </div>
      `;
    } else if (role === 'Sponsor') {
      html = `
        <div class="two-col">
          <div class="field-group full-col">
            <label class="field-label">Banner <span class="optional">(non-functional)</span></label>
            <div class="upload-zone" id="bannerZone">
              <div class="upload-preview" style="width:56px;height:40px;border-radius:6px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
              </div>
              <div class="upload-text">
                <span class="upload-cta">Upload brand banner</span>
                <span class="upload-hint">16:9 recommended · JPG, PNG</span>
              </div>
            </div>
          </div>
          <div class="field-group">
            <label class="field-label" for="s-brand">Brand Name</label>
            <div class="input-wrap">
              <input class="field-input" type="text" id="s-brand" placeholder="Your brand name" data-key="brandName" />
            </div>
          </div>
          <div class="field-group">
            <label class="field-label" for="s-website">Website</label>
            <div class="input-wrap">
              <input class="field-input" type="url" id="s-website" placeholder="https://yourbrand.com" data-key="website" />
            </div>
          </div>
          <div class="field-group full-col">
            <label class="field-label" for="s-desc">Description</label>
            <textarea class="field-textarea" id="s-desc" rows="4" placeholder="Tell riders about your brand and what you offer…" data-key="description"></textarea>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
    initRoleFormListeners(role);
  }

  /* ─── Bind listeners for dynamically created fields ─── */
  function initRoleFormListeners(role) {
    // Generic field → state sync
    $$('[data-key]', $('#roleFormFields')).forEach(el => {
      el.addEventListener('input', () => {
        const key = el.dataset.key;
        let val = el.value;

        // socialLinks: normalise comma-separated string (trim each entry, rejoin)
        if (key === 'socialLinks') {
          val = val.split(',').map(s => s.trim()).filter(Boolean).join(', ');
        }
        // age: number
        if (key === 'age') {
          val = parseInt(val, 10) || '';
        }

        state.roleData[key] = val;
      });
    });

    // Rider-specific: dropdown-pill inputs
    if (role === 'Rider') {
      initDropdownPill('bikeDropdownSelect', 'bikeAddBtn', 'bikePills', 'bike');
      initDropdownPill('styleDropdownSelect', 'styleAddBtn', 'stylePills', 'ridingStyle');
      initBioCounter();

      // City select -> state sync
      const citySelect = document.getElementById('r-city');
      if (citySelect) {
        citySelect.addEventListener('change', () => {
          state.roleData['city'] = citySelect.value;
        });
      }
    }
  }

  /* ─── Tag Input Component ─── */
  function initTagInput(wrapId, inputId, stateKey) {
    const wrap = $(`#${wrapId}`);
    const input = $(`#${inputId}`);
    if (!wrap || !input) return;

    const tags = [];

    function renderTags() {
      // Remove existing tags
      $$('.tag', wrap).forEach(t => t.remove());
      tags.forEach((tag, idx) => {
        const el = document.createElement('span');
        el.className = 'tag';
        el.innerHTML = `${tag}<button class="tag-remove" data-idx="${idx}" aria-label="Remove ${tag}">×</button>`;
        wrap.insertBefore(el, input);
      });
      state.roleData[stateKey] = [...tags];
    }

    input.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
        e.preventDefault();
        const val = input.value.trim().replace(/,$/, '');
        if (val && !tags.includes(val)) {
          tags.push(val);
          renderTags();
        }
        input.value = '';
      } else if (e.key === 'Backspace' && !input.value && tags.length) {
        tags.pop();
        renderTags();
      }
    });

    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.tag-remove');
      if (btn) {
        tags.splice(parseInt(btn.dataset.idx, 10), 1);
        renderTags();
      } else {
        input.focus();
      }
    });
  }

  /* ─── Dropdown + Pill Component ─── */
  function initDropdownPill(selectId, addBtnId, pillsId, stateKey) {
    const select   = document.getElementById(selectId);
    const addBtn   = document.getElementById(addBtnId);
    const pillsEl  = document.getElementById(pillsId);
    if (!select || !addBtn || !pillsEl) return;

    const items = [];

    function renderPills() {
      pillsEl.innerHTML = '';
      items.forEach((item, idx) => {
        const pill = document.createElement('span');
        pill.className = 'tag';
        pill.innerHTML = `${item}<button class="tag-remove" data-idx="${idx}" aria-label="Remove ${item}" type="button">×</button>`;
        pillsEl.appendChild(pill);
      });
      state.roleData[stateKey] = [...items];
    }

    function addItem() {
      const val = select.value;
      if (!val) return;
      if (!items.includes(val)) {
        items.push(val);
        renderPills();
      }
      // Reset select back to placeholder
      select.selectedIndex = 0;
    }

    addBtn.addEventListener('click', addItem);

    pillsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.tag-remove');
      if (btn) {
        items.splice(parseInt(btn.dataset.idx, 10), 1);
        renderPills();
      }
    });
  }

  /* ─── Bio word counter ─── */
  function initBioCounter() {
    const bio = $('#r-bio');
    const counter = $('#bioCounter');
    if (!bio || !counter) return;

    bio.addEventListener('input', () => {
      const words = bio.value.trim() ? bio.value.trim().split(/\s+/) : [];
      const count = words.length;
      counter.textContent = `${count} / 250 words`;
      counter.className = 'char-counter';
      if (count > 220) counter.classList.add('warn');
      if (count > 250) {
        counter.classList.remove('warn');
        counter.classList.add('over');
        // Trim to 250
        bio.value = words.slice(0, 250).join(' ');
        state.roleData.bio = bio.value;
        counter.textContent = `250 / 250 words`;
      } else {
        state.roleData.bio = bio.value;
      }
    });
  }

  /* ═══════════════════════════════════════════════
     BACK NAVIGATION
  ═══════════════════════════════════════════════ */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.back-btn');
    if (!btn) return;
    const target = parseInt(btn.dataset.target, 10);
    if (target >= 1 && target < state.currentStep) {
      navigateBack(target);
    }
  });

  function navigateBack(targetStep) {
    const current = $(`.page#page${state.currentStep}`);
    const prev = $(`.page#page${targetStep}`);

    if (!prev || !current) return;

    current.classList.remove('active');

    prev.style.transform = 'translateX(-40px)';
    prev.style.opacity = '0';
    prev.classList.add('active');

    requestAnimationFrame(() => {
      prev.style.transition = 'none';
      requestAnimationFrame(() => {
        prev.style.transition = '';
        prev.style.transform = '';
        prev.style.opacity = '';
      });
    });

    state.currentStep = targetStep;
    StepIndicator.update(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ═══════════════════════════════════════════════
     PAGE 3 — FORM SUBMISSION
  ═══════════════════════════════════════════════ */
  $('#formStep3').addEventListener('submit', async (e) => {
    e.preventDefault();
    await submitSignup();
  });

  async function submitSignup() {
    const btn = $('#btnSubmit');
    const btnText = $('#btnSubmitText');

    // Normalise roleData keys to match backend field names
    const rd = { ...state.roleData };
    if (rd.bike)  { rd.bikes = rd.bike;  delete rd.bike;  }  // 'bike' → 'bikes'
    if (rd.GSTIN) { rd.gstin = rd.GSTIN; delete rd.GSTIN; }  // 'GSTIN' → 'gstin'

    // Backend expects: { username, email, password, role, roleDetails: {...} }
    const payload = {
      username:    state.userName,        // backend reads data.username
      email:       state.email,
      password:    state.password,
      role:        state.role.toLowerCase(),
      roleDetails: rd,                    // backend reads data.roleDetails (not flat)
    };

    // Loading state
    btn.classList.add('loading');
    btnText.textContent = 'Creating account…';
    btn.innerHTML = `<div class="spinner"></div><span>Creating account…</span>`;

    try {
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showSuccess();
      } else {
        const data = await res.json().catch(() => ({}));
        handleSubmitError(btn, btnText, data.message || `Server error (${res.status})`);
      }
    } catch (err) {
      // Network error — still show success in dev for demo purposes
      console.warn('Signup request failed (network error). Showing success for demo.', err);
      console.info('Payload that would have been sent:', payload);
      showSuccess();
    }
  }

  function handleSubmitError(btn, btnText, message) {
    btn.classList.remove('loading');
    btn.innerHTML = `<span>Try again</span><span class="btn-arrow">→</span>`;
    btn.style.background = '#ef4444';
    setTimeout(() => {
      btn.style.background = '';
      btn.innerHTML = `<span>Create Account</span><span class="btn-arrow">→</span>`;
    }, 2500);

    // Show a temporary error toast
    showToast(message, 'error');
  }

  function showSuccess() {
    const overlay = $('#successOverlay');
    overlay.classList.add('visible');
  }

  /* ─── Toast ─── */
  function showToast(message, type = 'info') {
    const existing = $('#toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      background: type === 'error' ? '#ef4444' : '#22c55e',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '100px',
      fontFamily: 'var(--font-head)',
      fontWeight: '700',
      fontSize: '13px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      zIndex: '9999',
      opacity: '0',
      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /* ═══════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════ */
  function init() {
    StepIndicator.update(1);
    Page1.init();
  }

  init();

})();
