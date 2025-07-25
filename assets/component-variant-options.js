/* eslint-disable class-methods-use-this */
/**
 * Dropdown selection for options
 */
class VariantSelects extends HTMLElement {
    constructor() {
      super();
      this.formParent = this.closest('product-form');
      this.form = this.formParent.querySelector('form') || null;
      this.formType = this.formParent.dataset.format || null;
      this.variant_json = this.querySelector('[data-variantJSON]');

      this.container = this.formType === 'product-card' ? this.closest('[data-product-card]') : this.closest('[data-product-container]');
    }

    connectedCallback() {
      this.updateSwatchLabel();
      if (this.formType === 'product-page') this.onVariantChange('load');

      this.addEventListener('change', (evt) => {
        const target = this.getInputForEventTarget(evt.target);
        eventBus.publish(PUB_SUB_EVENTS.optionChange, {
          data: {
            target,
            selectedOptionsId: this.optionValues,
          }
        });
        this.onVariantChange();
      });
    }

    updateSwatchLabel(){
      const colorSwatchContainer = this.querySelector('.color-swatch');
      if(colorSwatchContainer){
        const colorSwatches = colorSwatchContainer.querySelectorAll('.swatch');
        colorSwatches.forEach(swatch => {
          const colorHandle = swatch.querySelector('input[type="radio"]').dataset.handle;
          const swatchStyle = Utility.getSwatchStyle(colorHandle);
          swatch.querySelector('.swatch-label').setAttribute('style', swatchStyle);
        });
      }
    }

    /**
     * Trigger this function variant is changed
     */
    onVariantChange() {
      this.setCurrentVariant();
      this.updateOptionLabel(this.container);
      eventBus.publish(PUB_SUB_EVENTS.variantChange, {
        data: {
          container: this.container,
          variant: this.currentVariant,
        },
      });

      if (this.formType === 'product-page' && this.currentVariant) 
        globalSpace.product.currentVariant = this.currentVariant;
      if(typeof this.formParent?.updateProductDetails == 'function'){
        this.formParent.updateProductDetails(this.container, this.currentVariant);
      }
    }

    get selectedOptionValues() {
      return Array.from(this.querySelectorAll('select.variant_selector, fieldset input[type="radio"]:checked')).map(({ value }) => value);
    }

    /**
     * change value of currentVariant when variant being changed 
     */
    setCurrentVariant() {
      this.currentVariant = false;
      const options = this.selectedOptionValues;
      const variants = this._getVariantData();

      variants.find(variant => {
          if (variant.options.every((option, i) => options[i] === option)) {
            this.currentVariant = variant;
          }
      });
    }
  
    /**
     * Update selected option name label
     */
    updateOptionLabel(form){
      form.querySelectorAll('[data-optionindex]').forEach(option => {
        const label = option.querySelector('.selected-option');
        if(label) label.textContent = this.currentVariant[`option${option.dataset.optionindex}`];
      });
    }

    /**
     * Store the all the variants json
     */
    _getVariantData() {
      this.variantData = this.variantData || JSON.parse(this.variant_json.textContent);
      return this.variantData;
    }

    getInputForEventTarget(target) {
      return target.tagName === 'SELECT' ? target.selectedOptions[0] : target;
    }
    
    get optionValues() {
      return Array.from(this.querySelectorAll('select option[selected], fieldset input:checked')).map(
        ({ dataset }) => dataset.optionValueId
      );
    }
}
customElements.define('variant-selects', VariantSelects);