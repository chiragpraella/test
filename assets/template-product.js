const selectors = {
  productContainer: document.querySelector('[data-product-container]')
};

class TemplateProductJS {
  constructor() {
    this.abortController = undefined;
    this.pendingRequestUrl = null;
    this.container = selectors.productContainer;

    // Product page option change event to update dynamic data
    eventBus.subscribe(PUB_SUB_EVENTS.optionChange, (eventData) => {
      const { target, selectedOptionsId } = eventData.data;
      this.handleOptionValueChange(target, selectedOptionsId);
    });
  }

  addPreProcessCallback(callback) {
    this.preProcessHtmlCallbacks.push(callback);
  }

  handleOptionValueChange(target, selectedOptionsId){
    // console.log('correct request====>', this.container.contains(target));
    if (!this.container.contains(target)) return;

    const productUrl = target.dataset.productUrl || this.container.pendingRequestUrl || this.container.dataset.url;
    this.pendingRequestUrl = productUrl;
    const swapProduct = this.container.dataset.url !== productUrl;
    const fetchFullPage = this.container.dataset.updateUrl === 'true' && swapProduct;

    this.renderProductInfo({
      requestUrl: this.buildRequestUrlWithParams(productUrl, selectedOptionsId, fetchFullPage),
      targetId: target.id,
      callback: swapProduct
        ? this.handleSwapProduct(productUrl, fetchFullPage)
        : this.handleUpdateProductInfo(productUrl),
    });
  }

  renderProductInfo({ requestUrl, targetId, callback }) {
    this.abortController?.abort();
    this.abortController = new AbortController();

    fetch(requestUrl, { signal: this.abortController.signal })
      .then((response) => response.text())
      .then((responseText) => {
        this.pendingRequestUrl = null;
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        callback(html);
      })
      .then(() => {
        // set focus to last clicked option value
        document.querySelector(`#${targetId}`)?.focus();
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted by user');
        } else {
          console.error(error);
        }
      });
  }

  handleSwapProduct(productUrl, updateFullPage) {
    // console.log(productUrl, updateFullPage);
  }

  handleUpdateProductInfo(productUrl){
    return (html) => {
      const productId = this.container.dataset.product;
      const updateSourceFromDestination = (id) => {
        const source = html.querySelector(id);
        const destination = this.container.querySelector(id);

        if (source && destination) {
          destination.innerHTML = source.innerHTML;
          destination.classList.remove('d-none');
        }else{
          destination?.classList.add('d-none')
        }
      };

      updateSourceFromDestination(`#Inventory-${productId}`);
      updateSourceFromDestination(`#Sku-${productId}`);
      updateSourceFromDestination(`#Quantity-${productId}`);
      updateSourceFromDestination(`#Volume-discount-${productId}`);
    }
  }

  buildRequestUrlWithParams(url, optionValues, fetchFullPage = false) {
    const params = [];
    !fetchFullPage && params.push(`section_id=${this.container.dataset.section}`);
    if (optionValues.length) {
      params.push(`option_values=${optionValues.join(',')}`);
    }
    return `${url}?${params.join('&')}`;
  }
}

typeof TemplateProductJS !== 'undefined' && new TemplateProductJS();