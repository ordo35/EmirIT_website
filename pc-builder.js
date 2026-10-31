/**
 * EmirIT Interactive PC Building Simulation Engine
 * Vanilla ES6+ - Touch/Pointer & HTML5 Drag-and-Drop API - Zero External Dependencies
 * Architecture: Clean State Machine & Deterministic Slot Validation
 */

(function () {
  'use strict';

  // Strict Standardized Assembly Sequence
  const ASSEMBLY_STEPS = [
    {
      step: 1,
      id: 'motherboard',
      targetSlot: 'slot-motherboard',
      name: 'Motherboard',
      instructionTitle: 'Install the Motherboard',
      instructionDesc: 'Drag the Motherboard into the Motherboard slot inside the Case.'
    },
    {
      step: 2,
      id: 'psu',
      targetSlot: 'slot-psu',
      name: 'PSU',
      instructionTitle: 'Install the PSU',
      instructionDesc: 'Drag the PSU into the PSU slot in the Case.'
    },
    {
      step: 3,
      id: 'ram',
      targetSlot: 'slot-ram',
      name: 'RAM',
      instructionTitle: 'Install the RAM',
      instructionDesc: 'Drag the RAM into the RAM slot on the Motherboard.'
    },
    {
      step: 4,
      id: 'ssd',
      targetSlot: 'slot-ssd',
      name: 'SSD',
      instructionTitle: 'Install the SSD',
      instructionDesc: 'Drag the SSD into the SSD slot on the Motherboard.'
    },
    {
      step: 5,
      id: 'gpu',
      targetSlot: 'slot-gpu',
      name: 'RTX 4060',
      instructionTitle: 'Install the RTX 4060',
      instructionDesc: 'Drag the RTX 4060 into the RTX 4060 PCIe slot.'
    }
  ];

  // Simulator State
  const State = {
    currentStepIndex: 0,
    installedComponents: new Set(),
    activeDragComponent: null,
    isComplete: false,
    isMobileMenuOpen: false
  };

  // DOM Elements Cache
  const DOM = {
    stepNumberBadge: document.getElementById('step-number-badge'),
    stepTitle: document.getElementById('step-title'),
    stepDesc: document.getElementById('step-desc'),
    progressVal: document.getElementById('progress-val'),
    progressFill: document.getElementById('progress-fill'),
    inventoryCounter: document.getElementById('inventory-counter'),
    componentCards: document.querySelectorAll('.component-card'),
    slots: document.querySelectorAll('.chassis-slot'),
    errorToast: document.getElementById('error-toast'),
    toastMsg: document.getElementById('toast-msg'),
    btnReset: document.getElementById('btn-reset-sim'),
    completionModal: document.getElementById('completion-modal'),
    btnModalRebuild: document.getElementById('btn-modal-rebuild'),
    powerLed: document.getElementById('power-led'),
    powerStatusLabel: document.getElementById('power-status-label'),
    motherboardMountedView: document.getElementById('motherboard-mounted-view'),
    menuToggle: document.getElementById('menu-toggle'),
    mainNav: document.getElementById('main-nav')
  };

  /**
   * Zero-file Web Audio API Synthesizer
   */
  const AudioEngine = {
    ctx: null,
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    },
    playTone(freq, duration, type = 'sine', startTime = 0) {
      this.init();
      if (!this.ctx) return;
      try {
        if (this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + startTime);
        osc.stop(this.ctx.currentTime + startTime + duration);
      } catch (e) {
        // Fallback for strict browser policies
      }
    },
    playClick() {
      this.playTone(880, 0.08, 'triangle');
    },
    playSuccessSnap() {
      this.playTone(523.25, 0.1, 'sine', 0);     // C5
      this.playTone(659.25, 0.12, 'sine', 0.08); // E5
      this.playTone(783.99, 0.18, 'sine', 0.16); // G5
    },
    playErrorBuzz() {
      this.playTone(180, 0.22, 'sawtooth');
    },
    playVictoryChime() {
      const chord = [523.25, 659.25, 783.99, 1046.50];
      chord.forEach((freq, idx) => {
        this.playTone(freq, 0.45, 'sine', idx * 0.12);
      });
      setTimeout(() => {
        this.playTone(1046.50, 0.6, 'triangle', 0);
      }, 500);
    }
  };

  /**
   * Main Simulator Initializer
   */
  function initSimulator() {
    bindGlobalListeners();
    bindMobileNavigation();
    updateGuidanceUI();
  }

  /**
   * 1. Navigation Support for pc-builder page
   */
  function bindMobileNavigation() {
    if (!DOM.menuToggle || !DOM.mainNav) return;

    DOM.menuToggle.addEventListener('click', () => {
      State.isMobileMenuOpen = !State.isMobileMenuOpen;
      if (State.isMobileMenuOpen) {
        DOM.mainNav.classList.add('nav-open');
        DOM.menuToggle.setAttribute('aria-expanded', 'true');
      } else {
        DOM.mainNav.classList.remove('nav-open');
        DOM.menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && State.isMobileMenuOpen) {
        State.isMobileMenuOpen = false;
        DOM.mainNav.classList.remove('nav-open');
        DOM.menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * 2. Dynamic Guidance & Progress Update
   */
  function updateGuidanceUI() {
    const total = ASSEMBLY_STEPS.length;
    const currentStep = ASSEMBLY_STEPS[State.currentStepIndex];

    if (currentStep && !State.isComplete) {
      if (DOM.stepNumberBadge) DOM.stepNumberBadge.textContent = `STEP ${currentStep.step} OF ${total}`;
      if (DOM.stepTitle) DOM.stepTitle.textContent = currentStep.instructionTitle;
      if (DOM.stepDesc) DOM.stepDesc.textContent = currentStep.instructionDesc;

      const progressPercent = Math.round((State.installedComponents.size / total) * 100);
      if (DOM.progressVal) DOM.progressVal.textContent = `${progressPercent}% Complete`;
      if (DOM.progressFill) DOM.progressFill.style.width = `${progressPercent}%`;

      // Update inventory items: only the current step's component is active & draggable
      DOM.componentCards.forEach((card) => {
        const compId = card.getAttribute('data-component');
        if (State.installedComponents.has(compId)) {
          card.classList.add('installed');
          card.classList.remove('locked', 'active-target');
          card.setAttribute('draggable', 'false');
          card.setAttribute('aria-disabled', 'true');
        } else if (compId === currentStep.id) {
          card.classList.remove('locked', 'installed');
          card.classList.add('active-target');
          card.setAttribute('draggable', 'true');
          card.setAttribute('aria-disabled', 'false');
        } else {
          card.classList.add('locked');
          card.classList.remove('active-target', 'installed');
          card.setAttribute('draggable', 'false');
          card.setAttribute('aria-disabled', 'true');
        }
      });

      // Highlight target slot
      DOM.slots.forEach((slot) => {
        slot.classList.remove('highlight-target');
      });
      const targetSlotEl = document.getElementById(currentStep.targetSlot);
      if (targetSlotEl) {
        targetSlotEl.classList.add('highlight-target');
      }

      if (DOM.inventoryCounter) {
        DOM.inventoryCounter.textContent = `${total - State.installedComponents.size} Available`;
      }
    }
  }

  /**
   * 3. Event Binding (Bounded Globally Once)
   */
  function bindGlobalListeners() {
    // Draggable Component Cards
    DOM.componentCards.forEach((card) => {
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragend', handleDragEnd);
      // Accessible Click / Tap-to-seat fallback
      card.addEventListener('click', handleCardClick);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick.call(card);
        }
      });
    });

    // Drop Target Slots
    DOM.slots.forEach((slot) => {
      slot.addEventListener('dragover', handleDragOver);
      slot.addEventListener('dragenter', handleDragEnter);
      slot.addEventListener('dragleave', handleDragLeave);
      slot.addEventListener('drop', handleDrop);
    });

    // Control Buttons
    if (DOM.btnReset) {
      DOM.btnReset.addEventListener('click', resetSimulation);
    }
    if (DOM.btnModalRebuild) {
      DOM.btnModalRebuild.addEventListener('click', resetSimulation);
    }

    // Modal dismiss on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.completionModal && DOM.completionModal.style.display === 'flex') {
        DOM.completionModal.style.display = 'none';
      }
    });
  }

  function handleDragStart(e) {
    const compId = this.getAttribute('data-component');
    const currentExpected = ASSEMBLY_STEPS[State.currentStepIndex];

    // Prevent dragging if component is locked, installed, or not the current active step
    if (this.classList.contains('locked') || this.classList.contains('installed') || !currentExpected || compId !== currentExpected.id) {
      e.preventDefault();
      triggerErrorFeedback(this, 'Incorrect slot, try again');
      AudioEngine.playErrorBuzz();
      return;
    }

    State.activeDragComponent = compId;
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', compId);
    e.dataTransfer.effectAllowed = 'move';
    AudioEngine.playClick();
  }

  function handleDragEnd() {
    this.classList.remove('dragging');
    State.activeDragComponent = null;
    DOM.slots.forEach((s) => s.classList.remove('drag-over'));
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
  }

  function handleDragLeave() {
    this.classList.remove('drag-over');
  }

  function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');

    const droppedCompId = e.dataTransfer.getData('text/plain') || State.activeDragComponent;
    const targetSlotComponent = this.getAttribute('data-target');

    validateAndSeatComponent(droppedCompId, targetSlotComponent, this);
  }

  function handleCardClick() {
    if (State.isComplete) return;

    const compId = this.getAttribute('data-component');
    const currentExpected = ASSEMBLY_STEPS[State.currentStepIndex];

    if (!currentExpected) return;

    if (this.classList.contains('locked') || this.classList.contains('installed') || compId !== currentExpected.id) {
      triggerErrorFeedback(this, 'Incorrect slot, try again');
      AudioEngine.playErrorBuzz();
      return;
    }

    // Direct placement to target slot
    const targetSlotEl = document.getElementById(currentExpected.targetSlot);
    if (targetSlotEl) {
      validateAndSeatComponent(compId, currentExpected.id, targetSlotEl);
    }
  }

  /**
   * 4. Strict Step Validation Engine (Try Until Correct)
   * Step advancing occurs ONLY when isCorrectSlot === true.
   */
  function validateAndSeatComponent(droppedId, targetSlotComponent, slotElement) {
    const currentExpected = ASSEMBLY_STEPS[State.currentStepIndex];

    if (!currentExpected || State.isComplete) return;

    const isCorrectSlot = (droppedId === targetSlotComponent) && (droppedId === currentExpected.id);

    if (!isCorrectSlot) {
      // Invalid placement: Snap back to inventory, shake slot, keep user on current step
      triggerErrorFeedback(slotElement, 'Incorrect slot, try again');
      AudioEngine.playErrorBuzz();
      return; // HARD STOP: currentStepIndex is preserved
    }

    // Valid placement: Proceed to seat component
    seatComponentSuccess(currentExpected, slotElement);
  }

  function seatComponentSuccess(stepData, slotElement) {
    State.installedComponents.add(stepData.id);
    AudioEngine.playSuccessSnap();

    // Mark slot as permanently installed
    slotElement.classList.remove('highlight-target');
    slotElement.classList.add('installed');

    // Reveal Motherboard inner slots when Motherboard is seated
    if (stepData.id === 'motherboard') {
      if (DOM.motherboardMountedView) {
        DOM.motherboardMountedView.style.display = 'grid';
      }
    }

    // Advance step ONLY on valid placement
    State.currentStepIndex++;

    if (State.currentStepIndex >= ASSEMBLY_STEPS.length) {
      completeAssembly();
    } else {
      updateGuidanceUI();
    }
  }

  /**
   * 5. Error Feedback & Animation
   */
  let errorTimer = null;
  function triggerErrorFeedback(element, message) {
    if (element) {
      element.classList.remove('shake-error');
      // Trigger DOM reflow to reliably restart the CSS keyframe animation
      void element.offsetWidth;
      element.classList.add('shake-error');

      setTimeout(() => {
        element.classList.remove('shake-error');
      }, 500);
    }

    if (DOM.errorToast && DOM.toastMsg) {
      DOM.toastMsg.textContent = message || 'Incorrect slot, try again';
      DOM.errorToast.classList.add('visible');

      clearTimeout(errorTimer);
      errorTimer = setTimeout(() => {
        DOM.errorToast.classList.remove('visible');
      }, 2500);
    }
  }

  /**
   * 6. Victory State & Power Telemetry Activation
   */
  function completeAssembly() {
    State.isComplete = true;

    // Chassis Telemetry
    if (DOM.powerLed) DOM.powerLed.classList.add('powered');
    if (DOM.powerStatusLabel) DOM.powerStatusLabel.textContent = 'POWER: ACTIVE (100% POST)';

    // Update Progress
    if (DOM.progressVal) DOM.progressVal.textContent = '100% Complete';
    if (DOM.progressFill) DOM.progressFill.style.width = '100%';
    if (DOM.stepNumberBadge) DOM.stepNumberBadge.textContent = 'COMPLETED';
    if (DOM.stepTitle) DOM.stepTitle.textContent = 'PC Assembled Successfully!';
    if (DOM.stepDesc) DOM.stepDesc.textContent = 'All components installed correctly into the Case.';
    if (DOM.inventoryCounter) DOM.inventoryCounter.textContent = '0 Available';

    // Mark all cards installed
    DOM.componentCards.forEach((c) => {
      c.classList.remove('active-target', 'locked');
      c.classList.add('installed');
      c.setAttribute('draggable', 'false');
    });

    AudioEngine.playVictoryChime();

    setTimeout(() => {
      if (DOM.completionModal) {
        DOM.completionModal.style.display = 'flex';
      }
    }, 600);
  }

  /**
   * 7. Full Reset Lifecycle
   * Re-initializes state, resets DOM elements, and re-enables drag on Step 1.
   */
  function resetSimulation() {
    // 1. Reset State
    State.currentStepIndex = 0;
    State.installedComponents.clear();
    State.activeDragComponent = null;
    State.isComplete = false;

    // 2. Reset All Slots
    DOM.slots.forEach((slot) => {
      slot.classList.remove('installed', 'highlight-target', 'drag-over', 'shake-error');
    });

    // 3. Reset Motherboard nested view
    if (DOM.motherboardMountedView) {
      DOM.motherboardMountedView.style.display = 'none';
    }

    // 4. Reset Chassis Indicators
    if (DOM.powerLed) DOM.powerLed.classList.remove('powered');
    if (DOM.powerStatusLabel) DOM.powerStatusLabel.textContent = 'POWER: OFF';

    // 5. Hide Modal & Toast
    if (DOM.completionModal) {
      DOM.completionModal.style.display = 'none';
    }
    if (DOM.errorToast) {
      DOM.errorToast.classList.remove('visible');
    }

    // 6. Refresh Guidance & Palette State (Restores draggable="true" on Motherboard)
    updateGuidanceUI();
    AudioEngine.playClick();
  }

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimulator);
  } else {
    initSimulator();
  }
})();
