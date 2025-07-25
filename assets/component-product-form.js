/**
 * Product Form Components
 *
 */
class ProductForm extends HTMLElement {
  constructor() {
    super();

    this.form = this.querySelector('form');
    this.cartElement = document.querySelector('cart-form');
    this.submitButton = this.querySelector('[type="submit"]');
    this.qtyInput = this.querySelector('[data-qty-input]');
  }

  connectedCallback() {
    this.form?.addEventListener('submit', this.onSubmitHandler.bind(this));
  }

  updateProductDetails(container, variant) {
    if (!variant) {
      this.toggleAddButton('disable');
      return;
    }
    
    this.toggleAddButton('enable', variant.available);
    this.updateURLandID(variant);
    this.priceUpdate(container, variant);
    this.updateImage(container, variant.featured_media);
  }

  /**
   * Render Price details based on current variant
   */
  priceUpdate(container, variant) {
    const priceElement = container.querySelector('[data-currentPrice]');
    if (!priceElement) return;
    
    const comparePriceElement = container.querySelector('[data-comparePrice]');
    priceElement.textContent = Utility.formatMoney(variant.price, window.globalSpace.money_format);
    if (comparePriceElement) {
      comparePriceElement.textContent = Utility.formatMoney(variant.compare_at_price, window.globalSpace.money_format);
      comparePriceElement.classList.toggle('d-none', !variant.compare_at_price || variant.compare_at_price <= 0 || variant.compare_at_price === variant.price);
    }
  }

  /**
   * Toggle the button based on product availability ( add to cart / soldOut )
   * @param {Text} status enable / disable
   * @param {Boolean} variantAvailable true/false
   */
  toggleAddButton(status, variantAvailable) {
    if (!this.submitButton) return;

    const addText = this.submitButton.querySelector('.add-text');
    if (status === 'disable' || (!variantAvailable)) {
        this.submitButton.setAttribute('disabled', true);
        if (addText) addText.textContent = status === 'disable' ? window.variantStrings.unavailable : window.variantStrings.soldOut;
    } else {
        this.submitButton.removeAttribute('disabled');
        if (addText) addText.textContent = this.form.classList.contains('cart-upsell-form') ? window.variantStrings.upsellAddText : window.variantStrings.addToCart;
    }
  }

  /**
   * Update URL on variant change event
   * @param {JSON} currentVariant 
   */
  updateURLandID(currentVariant) {
    if (!currentVariant || !this.form) return;

    if (this.dataset.format === 'product-page') window.history.replaceState({}, '', `${this.form.dataset.url}?variant=${currentVariant.id}`);
    this.form.querySelector('input[name="id"]').value = currentVariant.id;
  }

  /**
   * Render selected variant image/slide
   * @param {element} container
   * @param {object} variantMedia
   */
  updateImage(container, variantMedia) {
    if (!variantMedia) return;

    if (this.updateFeaturedImage(container, variantMedia)) {
      return;
    }
    
    this.updateImageSlide(container, variantMedia);
  }

  updateFeaturedImage(container, variantMedia) {
    const imgElem = container.querySelector('[data-feauredImage]');
    if (!imgElem || !variantMedia.preview_image.src) return false;

    imgElem.removeAttribute('srcset');
    imgElem.classList.remove('lozad');
    imgElem.src = `${variantMedia.preview_image.src}&width=850`;
    return true;
  }

  updateImageSlide(container, variantMedia) {
    const imageSlide = container.querySelector(`[data-productSlider] [data-mediaID="${variantMedia.id}"]`);
    if (!imageSlide) return;

    const slideIndex = Array.from(imageSlide.parentNode.children).indexOf(imageSlide);
    const slider = container.querySelector('[data-productSlider]');
    if (slider?.swiper) {
      slider.swiper.slideTo(slideIndex, 0, false);
    }
  }

  /**
   * Product Form Submit event
   *
   * @param {evt} Event instance
   */
  onSubmitHandler(evt) {
    evt.preventDefault();

    Utility.setLoadingState(true, this.submitButton);

    const formData = this.prepareFormData();
    const fetchCfg = Utility.fetchConfig('javascript', { body: formData });
    
    fetch(routes.cart_add_url + '.js', {
      ...fetchCfg,
      headers: {
        ...fetchCfg.headers,
        Accept: 'text/html',
      },
    })
    .then((response) => response.json())
    .then((res) => this.handleSubmitResponse(res))
    .catch((e) => Utility.handleError(e))
    .finally(() => Utility.setLoadingState(false, this.submitButton));
  }

  prepareFormData() {
    const formData = new FormData(this.form);
    formData.append('sections', `${this.cartElement?.dataset?.sectionId || 'template-cart'}`);
    return formData;
  }

  handleSubmitResponse(res) {
    const dataJSON = ((typeof res == 'object') ? res : JSON.parse(res));

    if (dataJSON.errors) {
      Utility.handleError(dataJSON.errors, 'Add to Cart');
      return;
    }

    this.handleSubmitSuccess(dataJSON);
  }

  handleSubmitSuccess(dataJSON) {
    eventBus.publish(PUB_SUB_EVENTS.productATC, {
      data: {
        item: dataJSON,
        sections: dataJSON.sections
      },
    });

    if (this.qtyInput) {
      this.qtyInput.value = this.qtyInput.min || 1;
    }
    
    if (this.cartElement) {
      this.cartElement?._updateCart(dataJSON.sections, this.submitButton);
    } else {
      this.updateCartWithoutElement(dataJSON);
    }
  }

  updateCartWithoutElement(dataJSON) {
    const cartSectionID = this.cartElement?.dataset?.sectionId || 'template-cart';
    let cartHTML = dataJSON.sections[cartSectionID];
    cartHTML = new DOMParser().parseFromString(cartHTML, 'text/html');

    const cartJSONEle = cartHTML.querySelector('[data-cartScriptJSON]');
    window.globalSpace.cart = JSON.parse(cartJSONEle.textContent);

    updateCartCountInHeader();
    Utility.handleSuccess(dataJSON.title, 'Added to Cart');
  }
}

customElements.define('product-form', ProductForm);
