/**
 * EmirIT Corporate Website - Main JavaScript Application
 * Vanilla ES6+ - Zero External Dependencies
 */

(function () {
  'use strict';

  // State Management
  const AppState = {
    selectedCategory: 'all',
    isMenuOpen: false
  };

  /**
   * DOM Elements Cache
   */
  const elements = {
    header: document.getElementById('header'),
    menuToggle: document.getElementById('menu-toggle'),
    mainNav: document.getElementById('main-nav'),
    navLinks: document.querySelectorAll('.nav-link, .nav-btn'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    catalogGrid: document.getElementById('catalog-container'),
    catalogCards: document.querySelectorAll('.catalog-card'),
    specButtons: document.querySelectorAll('.select-item-btn'),
    quoteForm: document.getElementById('quote-form'),
    formAlert: document.getElementById('form-alert'),
    submitBtn: document.getElementById('submit-btn'),
    serviceCategorySelect: document.getElementById('serviceCategory'),
    projectDetailsTextarea: document.getElementById('projectDetails'),
    currentYearSpan: document.getElementById('year')
  };

  /**
   * Initialize Application
   */
  function init() {
    setupCopyrightYear();
    setupMobileNavigation();
    setupCatalogFiltering();
    setupCatalogInteractivity();
    setupFormValidation();
    setupScrollSpy();
  }

  /**
   * 1. Dynamic Copyright Year
   */
  function setupCopyrightYear() {
    if (elements.currentYearSpan) {
      elements.currentYearSpan.textContent = new Date().getFullYear();
    }
  }

  /**
   * 2. Accessible Mobile Navigation Controller
   */
  function setupMobileNavigation() {
    if (!elements.menuToggle || !elements.mainNav) return;

    elements.menuToggle.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking navigation link
    elements.navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (AppState.isMenuOpen) {
          closeMobileMenu();
        }
      });
    });

    // Close menu when Escape key is pressed
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && AppState.isMenuOpen) {
        closeMobileMenu();
        elements.menuToggle.focus();
      }
    });
  }

  function toggleMobileMenu() {
    if (AppState.isMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    AppState.isMenuOpen = true;
    elements.mainNav.classList.add('nav-open');
    elements.menuToggle.setAttribute('aria-expanded', 'true');
    elements.menuToggle.setAttribute('aria-label', 'Close navigation menu');
  }

  function closeMobileMenu() {
    AppState.isMenuOpen = false;
    elements.mainNav.classList.remove('nav-open');
    elements.menuToggle.setAttribute('aria-expanded', 'false');
    elements.menuToggle.setAttribute('aria-label', 'Open navigation menu');
  }

  /**
   * 3. Hardware Catalog Filter Engine
   */
  function setupCatalogFiltering() {
    if (!elements.filterButtons || !elements.catalogCards) return;

    elements.filterButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const filterValue = this.getAttribute('data-filter');

        // Update active filter state
        elements.filterButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });

        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');
        AppState.selectedCategory = filterValue;

        // Apply filter to catalog items with transition
        filterCatalogCards(filterValue);
      });
    });
  }

  function filterCatalogCards(filter) {
    let visibleCount = 0;

    elements.catalogCards.forEach((card) => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.3s ease-in-out';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle empty state if no matching products
    let emptyNotice = document.getElementById('catalog-empty-notice');
    if (visibleCount === 0) {
      if (!emptyNotice) {
        emptyNotice = document.createElement('div');
        emptyNotice.id = 'catalog-empty-notice';
        emptyNotice.className = 'catalog-empty-notice';
        emptyNotice.textContent = 'No hardware items found matching this category.';
        emptyNotice.style.padding = '2rem';
        emptyNotice.style.textAlign = 'center';
        emptyNotice.style.color = '#64748b';
        elements.catalogGrid.appendChild(emptyNotice);
      }
    } else if (emptyNotice) {
      emptyNotice.remove();
    }
  }

  /**
   * 4. Interactive Spec Buttons (Deep-link to Contact Form)
   */
  function setupCatalogInteractivity() {
    if (!elements.specButtons) return;

    elements.specButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const itemName = this.getAttribute('data-item');

        // Pre-fill form dropdown and description
        if (elements.serviceCategorySelect) {
          elements.serviceCategorySelect.value = 'hardware';
        }

        if (elements.projectDetailsTextarea) {
          elements.projectDetailsTextarea.value = `Inquiry regarding: ${itemName}\nPlease supply detailed specification sheet and delivery availability.`;
        }

        // Smooth scroll to contact form and highlight
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          if (elements.projectDetailsTextarea) {
            elements.projectDetailsTextarea.focus();
          }
        }
      });
    });
  }

  /**
   * 5. Interactive Form Validation & Submission
   */
  function setupFormValidation() {
    if (!elements.quoteForm) return;

    const inputs = elements.quoteForm.querySelectorAll('input, select, textarea');

    // Real-time input clearing of errors
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        clearFieldError(input);
      });
      input.addEventListener('change', () => {
        clearFieldError(input);
      });
    });

    elements.quoteForm.addEventListener('submit', handleFormSubmit);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const form = elements.quoteForm;
    let isValid = true;

    // Field 1: Full Name
    const fullName = form.querySelector('#fullName');
    const fullNameError = document.getElementById('fullNameError');
    if (!fullName.value.trim() || fullName.value.trim().length < 2) {
      setFieldError(fullName, fullNameError, 'Please enter your full name (minimum 2 characters).');
      isValid = false;
    } else {
      clearFieldError(fullName, fullNameError);
    }

    // Field 2: Email
    const email = form.querySelector('#businessEmail');
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
      setFieldError(email, emailError, 'Please provide a valid corporate email address.');
      isValid = false;
    } else {
      clearFieldError(email, emailError);
    }

    // Field 3: Service Category
    const category = form.querySelector('#serviceCategory');
    const categoryError = document.getElementById('categoryError');
    if (!category.value) {
      setFieldError(category, categoryError, 'Please select a core service category.');
      isValid = false;
    } else {
      clearFieldError(category, categoryError);
    }

    // Field 4: Project Scope / Details
    const details = form.querySelector('#projectDetails');
    const detailsError = document.getElementById('detailsError');
    if (!details.value.trim() || details.value.trim().length < 10) {
      setFieldError(details, detailsError, 'Please describe your infrastructure requirements (minimum 10 characters).');
      isValid = false;
    } else {
      clearFieldError(details, detailsError);
    }

    // Field 5: NDA Consent Checkbox
    const consent = form.querySelector('#ndaConsent');
    const consentError = document.getElementById('consentError');
    if (!consent.checked) {
      setFieldError(consent, consentError, 'You must accept the consultation guidelines to proceed.');
      isValid = false;
    } else {
      clearFieldError(consent, consentError);
    }

    if (!isValid) {
      showFormAlert('error', 'Please correct the highlighted fields before submitting.');
      return;
    }

    // Simulate secure submission state
    toggleSubmitLoading(true);

    setTimeout(() => {
      toggleSubmitLoading(false);
      showFormAlert(
        'success',
        `✓ Request received for ${escapeHTML(fullName.value.trim())}! A certified systems engineer has been assigned and will contact ${escapeHTML(email.value.trim())} within 24 hours.`
      );
      form.reset();
    }, 800);
  }

  function setFieldError(inputElement, errorElement, message) {
    if (inputElement.type !== 'checkbox') {
      inputElement.classList.add('input-error');
    }
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  function clearFieldError(inputElement, errorElement) {
    inputElement.classList.remove('input-error');
    const errId = inputElement.getAttribute('aria-describedby');
    if (errId) {
      const err = document.getElementById(errId);
      if (err) err.textContent = '';
    }
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  function showFormAlert(type, message) {
    if (!elements.formAlert) return;

    elements.formAlert.className = `form-alert ${type}`;
    elements.formAlert.innerHTML = message;
    elements.formAlert.style.display = 'block';

    // Auto-scroll to alert if needed
    elements.formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function toggleSubmitLoading(isLoading) {
    if (!elements.submitBtn) return;
    const btnText = elements.submitBtn.querySelector('.btn-text');
    const spinner = elements.submitBtn.querySelector('.btn-spinner');

    if (isLoading) {
      elements.submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'Encrypting & Transmitting IT Assessment...';
      if (spinner) spinner.style.display = 'inline-block';
    } else {
      elements.submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Transmit IT Request & Generate Estimate';
      if (spinner) spinner.style.display = 'none';
    }
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  /**
   * 6. ScrollSpy for Active Navigation Link
   */
  function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 120;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          elements.navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    });
  }

  // Trigger init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

