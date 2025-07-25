/**
* Custom Select
*/
class CustomSelect extends HTMLElement {
  constructor() {
    super();

    this.toggleBtn = this.querySelector('[data-toggle="options"]');
    this.selectContainer = this.querySelector('[data-selectcontainer]');
    this.options = this.selectContainer.querySelectorAll('ul li');
  }

  connectedCallback() {
    this.toggleBtn.addEventListener('click', this.manageVisibility.bind(this));
    this.bindEvents();
  }

  bindEvents(){
    this.options.forEach(option => {
      option.addEventListener('click', (evt) => {
        this.toggleOptions(evt);
      });
      option.addEventListener('keyup', (evt) => {
        if(evt.key === 'Enter') evt.currentTarget.click();
      });
    });

    this.addEventListener('keyup', (evt) => {
      if(evt.key === 'Escape' && this.classList.contains('open')) this.closeDropdown();
    });

    document.body.addEventListener('click', () => {
      if(this.classList.contains('open')) this.closeDropdown();
    });

    this.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }

  /**
   * Toggle custom select option
   */
  toggleOptions(event) {
    const selectedOption = event.currentTarget;
    this.options.forEach(option => option.classList.remove('selected'));
    selectedOption.querySelector('label').click();
    selectedOption.classList.add('selected');

    this.toggleBtn.querySelector('.option_txt').textContent = selectedOption.querySelector('label').textContent;
    this.closeDropdown();
  }

  /**
   * Hide/Show of custom select option
   */
  manageVisibility(evt) {
    evt.preventDefault();
    const isOpen = this.classList.contains('open');
    console.log(isOpen);
    (isOpen) ? this.closeDropdown() : this.openDropdown();
  }

   /**
   * Close the dropdown
   */
   openDropdown() {
    this.classList.add('open');
    this.toggleBtn.setAttribute('aria-expanded', 'true');

    Utility.toggleElement(this, 'open');
    const elementTofocus = this.selectContainer.querySelector('input[type="radio"]:checked')?.closest('li')
                          || this.selectContainer.querySelector('li');
    Utility.trapFocus(this.selectContainer, elementTofocus);
  }

  /**
   * Close the dropdown
   */
  closeDropdown() {
    Utility.toggleElement(this, 'close');

    this.classList.remove('open');
    this.toggleBtn.setAttribute('aria-expanded', 'false');
    Utility.removeTrapFocus(this.toggleBtn);
  }

  // Optional: Clean up event listeners when the element is removed from the DOM
  disconnectedCallback() {
    this.toggleBtn.removeEventListener('click', this.manageVisibility.bind(this));
    this.options.forEach(option => {
      option.removeEventListener('click', this.toggleOptions.bind(this));
    })
  }
}
customElements.define('custom-select', CustomSelect);

/**
* Tab HTML
*/
class customTabs extends HTMLElement {
    constructor() {
      super();
  
      this.tabLinks = this.querySelectorAll('[data-toggle="tab"]');
      this.tabContainers = this.querySelectorAll('[data-tabpanel]');
  
      this.tabLinks.forEach( button => button.addEventListener('click', this.toggleTabs.bind(this)));
      this.addEventListener('keyup', this.onKeyUp.bind(this)); // Bind the keyup event
    }
  
    /**
     * Escape Key Press to close drawer when focus is within the container
     */
    onKeyUp(event) {
      if (event.code && event.code.toUpperCase() === 'ESCAPE') {
        this.closeTabs();
      }
    }
  
    /**
     * Toggle Tabs on link click
     */
    toggleTabs(event){
      event.preventDefault();
      const tabContainer = this.querySelector(event.currentTarget.dataset.target);
      if(!tabContainer) return;

      this.resetCurrentTab();
      this.openTab(event.currentTarget, tabContainer)
    }
  
    /**
     * Open Tab Container
     *
     * @param {Node} tabTrigger Tab Container Open link
     * @param {Node} tabContainer Tab Container to open
     */
    openTab(tabTrigger, tabContainer) {
      tabTrigger.classList.add('active');
      tabTrigger.setAttribute('aria-selected', true);
      tabTrigger.setAttribute('aria-expanded', true);

      tabContainer.classList.add('open');
      tabContainer?.setAttribute('aria-hidden', false);
    }

    /**
     * Close Tabs (optional implementation)
     */
    resetCurrentTab() {
      const activeTab = this.querySelector('[data-toggle="tab"].active');
      const tabContainer = this.querySelector('[data-tabpanel].open');

      tabContainer?.classList.remove('open');
      tabContainer?.setAttribute('aria-hidden', true);

      activeTab?.classList.remove('active');
      activeTab?.setAttribute('aria-selected', false);
      activeTab?.setAttribute('aria-expanded', false);
    }

  disconnectedCallback() {
    this.tabLinks.forEach(link => link.removeEventListener('click', this.toggleTabs.bind(this)));
    this.removeEventListener('keyup', this.onKeyUp.bind(this));
  }
}
customElements.define("custom-tabs", customTabs);

/**
  * collaspsible Panel
  *
  * @param {element} element - Collapsible panel element
*/
class collapsiblePanel {
  constructor(element) {
    this.element = element;
    this.toggleBtn = this.element.querySelector('[data-toggle="panel"]');
    this.content = this.element.querySelector('[data-panelcontent]'); 

    this.toggleBtn?.addEventListener('click', this.toggleContent.bind(this));
    this.element.addEventListener('keyup', this.onKeyUp.bind(this)); // Bind the keyup event
  }

  /**
   * Toggle Row Content
  */
  toggleContent(event) {
    event.preventDefault();
    const isOpen = this.element.classList.contains('open');
    isOpen ? this.hideContent() : this.showContent();
  }

  /**
   * Escape Key Press to close drawer when focus is within the container
   */
  onKeyUp(event) {
    if (event.code && event.code.toUpperCase() === 'ESCAPE') {
      this.hideContent();
    }
  }

  /**
   * Show panel content
   */
   showContent() {
    this.toggleBtn.setAttribute('aria-expanded', true);
    this.content.setAttribute('aria-hidden', false);
    Utility.toggleElement(this.element, 'open');
    Utility.trapFocus(this.element);

    if(this.element.dataset.behaviour == 'single'){
      const siblingBlocks = this.element.parentNode.querySelectorAll('[is="collapsiblePanel"].open');
      siblingBlocks.forEach(element => {
        if(element == this.element){ return; }
        element.querySelector('.panel_toggle').click();
      });
    }
  }

  /**
   * Hide panel content
   */
  hideContent() {
    this.toggleBtn.setAttribute('aria-expanded', false);
    this.content.setAttribute('aria-hidden', true);
    Utility.toggleElement(this.element, 'close');
    Utility.removeTrapFocus(this.element);
  }

  static init() {
    const collapsibleElements = document.querySelectorAll('[is="collapsiblePanel"]');
    collapsibleElements.forEach((ele) => {
      new collapsiblePanel(ele);
    });
  }
}
collapsiblePanel.init();

class ReadMore extends HTMLElement {
  constructor() {
      super();

      this.container = this.querySelector('[data-read-more-wrapper]');
      this.toggleContent = this.querySelector('[data-read-more-content]');
      this.toggleButton = this.querySelector('[data-toggle-text]');
      this.toggleButton.addEventListener('click', this.toggleReadMore.bind(this));
      const isVisible = this.toggleContent.scrollHeight > this.toggleContent.clientHeight;

      if(isVisible) this.toggleButton.classList.remove('d-none');
  }

  toggleReadMore() {
      const isOpen = this.container.classList.contains('open');

      if (isOpen) {
          this.container.classList.remove('open');
          this.toggleButton.setAttribute('aria-expanded', false);
          setTimeout(() => {
            this.toggleButton.textContent = window.readMoreStrings.read_more;
          }, 300);
      } else {
          this.container.classList.add('open');
          this.toggleButton.setAttribute('aria-expanded', true);
          setTimeout(() => {
            this.toggleButton.textContent = window.readMoreStrings.read_less;
          }, 300);
      }
  }

  manageBtnVisibility() {
    const isOpen = this.container.classList.contains('open');
    if(isOpen) {
      this.toggleButton.textContent = window.readMoreStrings.read_less;
    } else {
      this.toggleButton.textContent = window.readMoreStrings.read_more;
    }
  }
}
customElements.define('read-more', ReadMore);