if (!customElements.get('recipient-form')) {
    customElements.define(
      'recipient-form',
      class RecipientForm extends HTMLElement {
        constructor() {
          super();
          
          this.checkboxInput = this.querySelector(`#Recipient-checkbox-${this.dataset.sectionId}`);
          this.checkboxInput.disabled = false;

          this.hiddenControlField = this.querySelector(`#Recipient-control-${this.dataset.sectionId}`);
          this.hiddenControlField.disabled = true;

          this.emailInput = this.querySelector(`#Recipient-email-${this.dataset.sectionId}`);
          this.nameInput = this.querySelector(`#Recipient-name-${this.dataset.sectionId}`);
          this.messageInput = this.querySelector(`#Recipient-message-${this.dataset.sectionId}`);
          this.sendonInput = this.querySelector(`#Recipient-send-on-${this.dataset.sectionId}`);
          this.offsetProperty = this.querySelector(`#Recipient-timezone-offset-${this.dataset.sectionId}`);
          if (this.offsetProperty) this.offsetProperty.value = new Date().getTimezoneOffset().toString();
  
          this.errorMessageWrapper = this.querySelector('.product-form__recipient-error-message-wrapper');
          this.errorMessageList = this.errorMessageWrapper?.querySelector('ul');
          this.addEventListener('change', this.onChange.bind(this));
          this.onChange();
        }

        onChange() {
          if (this.checkboxInput.checked) {
            this.enableInputFields();
          } else {
            this.clearInputFields();
            this.disableInputFields();
            this.clearErrorMessage();
          }
        }
  
        inputFields() {
          return [this.emailInput, this.nameInput, this.messageInput, this.sendonInput];
        }
  
        disableableFields() {
          return [...this.inputFields(), this.offsetProperty];
        }
  
        clearInputFields() {
          this.inputFields().forEach((field) => (field.value = ''));
        }
  
        enableInputFields() {
          this.disableableFields().forEach((field) => (field.disabled = false));
        }
  
        disableInputFields() {
          this.disableableFields().forEach((field) => (field.disabled = true));
        }
  
        clearErrorMessage() {
          this.errorMessageWrapper.hidden = true;
  
          if (this.errorMessageList) this.errorMessageList.innerHTML = '';
  
          this.querySelectorAll('.recipient-fields .form__message').forEach((field) => {
            field.classList.add('hidden');
            const textField = field.querySelector('.error-message');
            if (textField) textField.innerText = '';
          });
  
          [this.emailInput, this.messageInput, this.nameInput, this.sendonInput].forEach((inputElement) => {
            inputElement.setAttribute('aria-invalid', false);
            inputElement.removeAttribute('aria-describedby');
          });
        }
  
        resetRecipientForm() {
          if (this.checkboxInput.checked) {
            this.checkboxInput.checked = false;
            this.clearInputFields();
            this.clearErrorMessage();
          }
        }
      }
    );
}
  