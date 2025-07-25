# Cart Components Documentation

This document outlines the cart-related components in the Fluid Framework.

## Components Overview

### Cart Form (`cart-form.js`)
The main cart form component that handles cart updates and interactions.

#### Key Features
- AJAX cart updates
- Quantity modifications
- Item removal
- Cart drawer integration
- Real-time price updates

#### Implementation Details
```javascript
class AjaxCart extends HTMLElement {
  // Handles cart form functionality
  // Manages cart updates and interactions
}
```

### Cart Discount (`cart-discount.js`)
Handles discount code application and management.

#### Key Features
- Discount code application
- Discount code removal
- Real-time discount updates
- Mutation observer for dynamic updates

#### Implementation Details
```javascript
class CartDiscount extends HTMLElement {
  // Handles discount code functionality
  // Uses MutationObserver for dynamic updates
}
```

## Event Handling

### Cart Updates
- Cart updates are handled through AJAX calls
- Updates are reflected in real-time
- Cart drawer is updated automatically

### Discount Code Management
- Discount codes are managed through a dedicated component
- Uses MutationObserver to handle dynamic updates
- Maintains state of applied discounts

## State Management

### Cart State
- Cart state is maintained in `window.globalSpace.cart`
- Updates are synchronized across components
- State changes trigger UI updates

### Discount State
- Discount state is managed within the CartDiscount component
- Tracks applied discount codes
- Handles validation of discount codes

## Best Practices

1. **Event Handling**
   - Use event delegation where appropriate
   - Clean up event listeners in disconnectedCallback
   - Use MutationObserver for dynamic content

2. **State Management**
   - Keep cart state in global space
   - Update UI components when state changes
   - Validate data before updates

3. **Error Handling**
   - Handle API errors gracefully
   - Provide user feedback for errors
   - Log errors for debugging

## Usage Examples

### Adding Items to Cart
```javascript
// Example of adding items to cart
cartForm.updateItemQty(line, quantity);
```

### Applying Discount Code
```javascript
// Example of applying discount code
cartDiscount.applyDiscount(event);
```

### Removing Discount Code
```javascript
// Example of removing discount code
cartDiscount.removeDiscount(event);
```

## Troubleshooting

### Common Issues
1. **Event Listeners Not Working**
   - Check if MutationObserver is properly configured
   - Verify event listener cleanup
   - Ensure proper event delegation

2. **Cart Updates Not Reflecting**
   - Check AJAX response handling
   - Verify state updates
   - Check UI update triggers

3. **Discount Code Issues**
   - Verify discount code validation
   - Check discount state management
   - Ensure proper error handling

## Contributing

When adding new cart-related features:
1. Follow the established component patterns
2. Add proper error handling
3. Update documentation
4. Add appropriate tests
5. Follow the code style guide 