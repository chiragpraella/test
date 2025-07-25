(() => {
const filterNodes = {
  container: document.getElementById('collection-container') || document.getElementById('search-container'),
  parent: document.getElementById('storefront-filters-parent'),
  collectionBanner: document.querySelector('[data-collectionBanner]')
}

class storefrontFilters {
  constructor() {
    if(!filterNodes.container || !filterNodes.parent) return;

    this.form = filterNodes.container.querySelector('#storefront-filters-form');
    this.gridsContainer = filterNodes.container.querySelector('#products-listing');
    this.paginate = filterNodes.container.querySelector('[data-pagination-parent]');
    this.activeFilters = filterNodes.container.querySelector('[data-activeFilters]');
    this.filterDrawer = filterNodes.parent.querySelector('#storefront-filter-drawer');
    this.sortDrawer = filterNodes.parent.querySelector('#storefront-sort-drawer');
    this.filterDrawerFooter = filterNodes.parent.querySelector('[data-filterFooter]');

    this.debouncedOnSubmit = Utility.debounce((event) => this.onSubmitHandler(event), 500);

    if (this.form) {
      this.form.addEventListener('input', (evt) => {
        const element = evt.target || evt.currentTarget;
        if (element.type === 'range' || (element.nodeName !== 'FORM' && element.name != 'sort_by' && window.innerWidth < 992)) return;

        this.debouncedOnSubmit(evt);
      });
      this.form.addEventListener('submit', this.debouncedOnSubmit.bind(this));
    }

    this.manageDrawerUI(window.innerWidth);
    this.bindEvents();
    this.dynamicEleEvents();
  }

  /**
   * Switch between Drawer/Colume view
  */
  manageDrawerUI(windowWidth){
    let filterGrid = filterNodes.parent.querySelector('#storefront-filter-grid');
    const elementToClone = filterGrid;

    filterGrid.remove();

    if(windowWidth >= 992){
      this.filterDrawer.parentNode.appendChild(elementToClone);
      // this.filterDrawer.closeDrawer();
    }else{
      this.filterDrawer.querySelector('div.drawer-body').appendChild(elementToClone);
    }
    filterGrid = elementToClone;
  }

  /**
   * bind events to UI element events
  */
  bindEvents() {
    window.onresize = () => {
      this.manageDrawerUI(window.innerWidth);
    };

    const sortByOptions = filterNodes.container.querySelectorAll('#sortby-dropdown .sortby_options, #sortby-dropdown-drawer .sortby_options');
    sortByOptions.forEach(input => input.addEventListener('change', this.updateSortBy.bind(this)));

    const paginateByValues = filterNodes.container.querySelectorAll('#products-per-page [name="paginateBy"]');
    paginateByValues.forEach(input => input.addEventListener('change', this.paginateProductsBy.bind(this)));

    const closeFilters = filterNodes.parent.querySelectorAll('[data-closefilter]');
    closeFilters.forEach(btn => { 
      btn.addEventListener('click', (evt)=>{
        evt.preventDefault();
        this.filterDrawer?.closeDrawer();
      });
    });

    const backFilters = filterNodes.parent.querySelectorAll('[data-back]');
    backFilters.forEach(btn => { 
      btn.addEventListener('click', (evt)=>{
        evt.preventDefault();
        let panel = evt.currentTarget.closest('[is="collapsiblePanel"]');
        panel?.querySelector('[data-toggle="panel"]')?.click();
      });
    });

    document.body.addEventListener('click', (evt) => {
      if(evt.target.closest('#storefront-filters-form') != null) return;
      this.hideFilters();
    });
  }

  dynamicEleEvents() {
    const collectionLinks = filterNodes.parent.querySelectorAll('[data-subcollectionslinks]');
    collectionLinks.forEach(link => link.addEventListener('click', this._manageSubCollections.bind(this)));

    const applyBtn = filterNodes.parent.querySelector('[data-applyFilters]');
    applyBtn?.addEventListener('click', () => {
      const searchParams = this._createQueryString(this.form)
      this.renderPage(searchParams);
    });

    const paginationLinks = filterNodes.container.querySelectorAll('[data-pagelinks], [data-loadmore]');
    paginationLinks.forEach(link => link.addEventListener('click', this._managePagination.bind(this)));

    this.colorOptionsStyling();
    this.bindActiveFilterButtonEvents();
  }

  hideFilters(){
    let openPanels = this.form.querySelectorAll('[is="collapsiblePanel"].open');
    if(openPanels){
      openPanels.forEach(panel => panel.querySelector('[data-toggle="panel"]').click());
    }
  }

  /**
   * Filter form submit event
   */
  onSubmitHandler(event) {
    event.preventDefault();
    const searchParams = this._createQueryString(this.form)
    this.renderPage(searchParams);
  }

  /**
   * click event To Remove current selections
   * @param {element} form Collection page filter form
   */
  _createQueryString(form){
    const formData = new FormData(form);
    const priceGTE = form.querySelector('[name="filter.v.price.gte"]');
    const priceLTE = form.querySelector('[name="filter.v.price.lte"]');

    formData.delete('sort_by_mobile');

     // Helper function to check if price filter should be removed
     const shouldRemovePriceFilter = (input, formDataKey) => {
      if (!input) return false;
      const currentValue = formData.get(formDataKey);
      const defaultValue = formDataKey.includes('.gte') ? input.min : input.max;
      return currentValue === '' || parseInt(currentValue) === parseInt(defaultValue);
    };

    if (shouldRemovePriceFilter(priceGTE, 'filter.v.price.gte')) formData.delete('filter.v.price.gte');    
    if (shouldRemovePriceFilter(priceLTE, 'filter.v.price.lte')) formData.delete('filter.v.price.lte');
    
    return new URLSearchParams(Array.from(formData)).toString();
  }

  /**
   * 
   * @param {String} searchParams Query Parameters
   * @param {Boolean} updateURLHash true/false
  */
  async renderPage(searchParams, updateURLHash = true) {
    this.gridsContainer.classList.add('loading');

    const url = `${window.location.pathname}?${searchParams}`;
    await this.renderGridFromFetch(url, 'filter');

    if (updateURLHash) this.updateURLHash(searchParams);
  }

  /**
   * Add background color in label of Color options
   */
  colorOptionsStyling(){
    const colorSwatchContainer = filterNodes.parent.querySelector('[data-colorFilter]');
    if(!colorSwatchContainer) return;

    colorSwatchContainer.querySelectorAll('.color-options').forEach(swatch => {
      const colorHandle = swatch.querySelector('input[type="checkbox"]').dataset.handle;
      const swatchStyle = Utility.getSwatchStyle(colorHandle);
      swatch.querySelector('.option-label').setAttribute('style', swatchStyle);
    });
  }

  /**
   * Remove active filters
   */
   onActiveFilterClick(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const URLString = new URL(event.currentTarget.href).searchParams.toString();
    if(URLString != null) this.renderPage(URLString);
  }

   /**
   * Update Window URL
   */
  onHistoryChange(event) {
    const searchParams = event.state?.searchParams || '';
    this.renderPage(searchParams, false);
  }

  /**
   * 
   * @param {String} url URL for fetching results
   * @param {String} type filter / pagination / sub_collection
   */
  async renderGridFromFetch(url, type) {
    if(!url) return;

    const sectionID = filterNodes.container.dataset.section;
    url += type === 'sub_collection' ? `&sections=${sectionID},template-collection-banner` : `&sections=${sectionID}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const gridHTML = data[sectionID];
      const bannerHTML = data['template-collection-banner'];
      this.renderProductGrid(type, gridHTML, bannerHTML);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  /**
   * 
   * @param {HTMlResponse} html 
   * @param {String} type filter / pagination / sub_collection
   */
  renderProductGrid(type, grid, banner) {
    const html = new DOMParser().parseFromString(grid, 'text/html');
    const filterPanels = html.querySelectorAll('#storefront-filters-form .individual-filter-block');

    const paginationType = this.paginate?.dataset.type || 'numbers';
    const productGrids = this.gridsContainer.querySelector('[data-products-grid');
    const loadMoreBtn = this.gridsContainer.querySelector('[data-loadmore]');
    const totalProductsElement = filterNodes.container.querySelector('[data-totalProducts]');

    if (type === 'pagination' && paginationType === 'loadmore') {
        productGrids.insertAdjacentHTML('beforeend', html.querySelector('[data-products-grid]').innerHTML);

        const newLoadMoreBtn = html.querySelector('[data-loadmore]');
        if (newLoadMoreBtn && loadMoreBtn) {
            loadMoreBtn.parentNode.replaceChild(newLoadMoreBtn, loadMoreBtn);
        } else if (loadMoreBtn) {
            loadMoreBtn.remove();
        }
    } else {
      this.gridsContainer.innerHTML = html.querySelector('#products-listing').innerHTML;
    }
    lazyImageObserver.observe();
    
    // Manage filter panels display
    let filterBlocks = document.querySelectorAll('#storefront-filters-form .individual-filter-block');
    filterBlocks.forEach(panel => panel.classList.add('d-none'));

    filterPanels.forEach(panel => {
      const filterBlock = document.querySelector(`.individual-filter-block[data-index="${panel.dataset.index}"]`);
      if (filterBlock) {
          filterBlock.querySelector('.filter__block').innerHTML = panel.querySelector('.filter__block').innerHTML;
          filterBlock.classList.remove('d-none');
      }
    });
    if(filterNodes.parent.dataset.layout == 'topbar'){
      this.form.querySelector('.individual-filter-block.open[is="collapsiblePanel"]')?.querySelector('[data-toggle="panel"]').click();
    }

    if (totalProductsElement) { // Update total products count
      totalProductsElement.innerHTML = html.querySelector('[data-totalProducts]').innerHTML;
    }

    this.filterDrawerFooter.innerHTML = html.querySelector('[data-filterFooter]').innerHTML; // Update drawer footer

    const activeFilters = html.querySelector('[data-activeFilters]'); // Update active filters
    if (activeFilters) {
      this.activeFilters.innerHTML = activeFilters.innerHTML;
    }

    if (type === 'sub_collection' && filterNodes.collectionBanner && banner) {  // Change banner on subcollection
      const bannerNode = new DOMParser().parseFromString(banner, 'text/html');
      filterNodes.collectionBanner.innerHTML = bannerNode.querySelector('[data-collectionBanner]').innerHTML;
    }

    this.dynamicEleEvents();
    if (this.filterDrawer?.isOpen) this.filterDrawer.closeDrawer(); // Close drawer if open
    if (this.sortDrawer?.isOpen) this.sortDrawer.closeDrawer(); // Close drawer if open
  }

  /**
   * Re-Binding events on active filters after ajax request
   */
  bindActiveFilterButtonEvents() {
    const removeActiveFilters = Array.from(document.getElementsByClassName('filter-option-clear'));
    removeActiveFilters.forEach((element) => {
      element.addEventListener('click', this.onActiveFilterClick.bind(this), { once: true });
    });
  }

  /**
   * Update the url
   * @param {String} searchParams 
   */
  updateURLHash(searchParams) {
    window.history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }

  updateSortBy(event){
    const currentEle = event.currentTarget;
    const sortByInput = this.form.querySelector('input[name="sort_by"]');
    sortByInput.value = currentEle.value;
    this.form.dispatchEvent(new Event('input', { once: true }));
  }

  async paginateProductsBy(event){
    event.preventDefault();
    const currentValue = document.querySelector('#products-per-page [name="paginateBy"]:checked').value;
    const requestData = { attributes: { 'products_per_page': currentValue } };

    try {
      await fetch("/cart/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestData),
      });
      const searchParams = this._createQueryString(this.form);
      const url = `${window.location.pathname}?${searchParams}`;
      await this.renderGridFromFetch(url, 'pagination');
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  }

  async _manageSubCollections(event){
    event.preventDefault();
    const _this =  event.currentTarget;
    const queryString = this._createQueryString(this.form);
    const collURL = `${_this.href}?${queryString}`;

    await this.renderGridFromFetch(collURL, 'sub_collection');

    setTimeout(() => {
      window.history.pushState({}, '', collURL);
    }, 500);
  }

  async _managePagination(event){
    event.preventDefault();
    const _this = event.currentTarget;
    await this.renderGridFromFetch(_this.href, 'pagination');

    const paginationType = this.paginate?.dataset.type || 'numbers';
    if(paginationType != 'loadmore'){
      setTimeout(() => {
        window.history.pushState({}, '', _this.href);
      }, 500);
    }
  }
}
if (typeof storefrontFilters !== 'undefined') new storefrontFilters();
})();

class PriceRange extends HTMLElement {
  constructor() {
    super();
    
    this.querySelectorAll('input[name="filter.v.price.gte"], input[name="filter.v.price.lte"]')
      .forEach(element => element.addEventListener('change', this.onRangeChange.bind(this)));

    this.setMinAndMaxValues();
    this.manageSliderChange();
  }

  onRangeChange(event) {
    this.adjustToValidValues(event.currentTarget);
    this.setMinAndMaxValues();
  }

  setMinAndMaxValues() {
    const inputs = this.querySelectorAll('input[name="filter.v.price.gte"], input[name="filter.v.price.lte"]');
    const minInput = inputs[0];
    const maxInput = inputs[1];
    if (maxInput.value) minInput.setAttribute('max', maxInput.value);
    if (minInput.value) maxInput.setAttribute('min', minInput.value);
    if (minInput.value === '') maxInput.setAttribute('min', 0);
    if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
  }

  // eslint-disable-next-line class-methods-use-this
  adjustToValidValues(input) {
    const value = Number(input.value);
    const min = Number(input.getAttribute('min'));
    const max = Number(input.getAttribute('max'));

    if (value < min) input.value = min;
    if (value > max) input.value = max;
  }

  // eslint-disable-next-line class-methods-use-this
  manageSliderChange() {
    const sliderSection = this.querySelector("#range-slider");
    const sliders = sliderSection.getElementsByTagName("input");
    Array.from(sliders).forEach(slider => {
      slider.oninput = () => {
        let slide1 = Number(sliders[0].value);
        let slide2 = Number(sliders[1].value);

        // Neither slider will clip the other, so make sure we determine which is larger
        if( slide1 > slide2 ){ const tmp = slide2; slide2 = slide1; slide1 = tmp; }
        this.querySelector('input[name="filter.v.price.gte"]').value = slide1;
        this.querySelector('input[name="filter.v.price.lte"]').value = slide2;
      }
      slider.onchange = () =>{
        if(window.innerWidth >= 992) this.closest('form').dispatchEvent(new CustomEvent('submit'));
      }
    });
  }
}
customElements.define('price-range', PriceRange);