# Liquid Templates Documentation

This document outlines the Liquid template structure and usage in the Fluid Framework.

## Template Structure

### Layout Templates
Located in `layout/` directory
- `theme.liquid` - Main theme layout with:
  - Meta tags and SEO
  - Schema markup
  - Critical CSS
  - JavaScript dependencies
  - Theme settings
- `password.liquid` - Password page layout
- `gift_card.liquid` - Gift card layout

### Section Templates
Located in `sections/` directory
- `header.liquid` - Site header
- `footer.liquid` - Site footer
- `cart.liquid` - Cart section
- `product.liquid` - Product section
- `collection.liquid` - Collection section

### Snippet Templates
Located in `snippets/` directory
- Reusable components
- Modular template parts
- Shared functionality

## Template Features

### Cart Templates
- AJAX cart functionality
- Real-time updates
- Discount code handling
- Cart drawer integration
- Cart item management
- Cart total calculations

### Product Templates
- Product image gallery
- Variant selection
- Add to cart functionality
- Product recommendations
- Product metafields
- Product reviews

### Collection Templates
- Collection filtering
- Sorting options
- Pagination
- Grid/List view toggle
- Collection metafields
- Collection description

## Best Practices

### Template Organization
1. **Modular Structure**
   - Use snippets for reusable components
   - Keep templates focused and single-purpose
   - Follow Shopify's naming conventions
   - Use consistent file structure

2. **Performance**
   - Use Shopify's CDN
   - Implement lazy loading
   - Optimize liquid operations
   - Use efficient markup

3. **Maintainability**
   - Document complex logic
   - Use consistent indentation
   - Follow template patterns

## Liquid Features

### Custom Filters
```liquid
{{ product.price | money_format }}
{{ collection.title | handleize }}
{{ product.featured_image | img_url: '800x' }}
{{ product.description | strip_html | truncatewords: 50 }}
```

### Custom Tags
```liquid
{% render 'product-card', product: product %}
{% section 'header' %}
{% paginate collection.products by 24 %}
{% form 'customer_login' %}
```

### Conditionals
```liquid
{% if product.available %}
  {% render 'add-to-cart' %}
{% else %}
  {% render 'sold-out' %}
{% endif %}

{% case product.type %}
  {% when 'Clothing' %}
    {% render 'clothing-size-guide' %}
  {% when 'Shoes' %}
    {% render 'shoe-size-guide' %}
{% endcase %}
```

## Template Variables

### Global Variables
- `shop` - Store information
- `customer` - Customer data
- `cart` - Cart information
- `request` - Request data
- `settings` - Theme settings
- `linklists` - Navigation menus

### Section Variables
- `section.settings` - Section settings
- `section.blocks` - Section blocks
- `section.id` - Section identifier
- `section.type` - Section type

## JavaScript Integration

### Data Attributes
```liquid
<div data-product-id="{{ product.id }}"
     data-variant-id="{{ product.selected_or_first_available_variant.id }}"
     data-section-id="{{ section.id }}">
  {% render 'product-form' %}
</div>
```

### JSON Data
```liquid
<script type="application/json" data-product-json>
  {{ product | json }}
</script>

<script type="application/json" data-cart-json>
  {{ cart | json }}
</script>
```

## Contributing

When adding new templates:
1. Follow the established structure
2. Use appropriate snippets
3. Document complex logic
4. Test across different devices
5. Follow the style guide

## Troubleshooting

### Common Issues
1. **Template Rendering**
   - Check liquid syntax
   - Verify variable scope
   - Check section settings

2. **JavaScript Integration**
   - Verify data attributes
   - Check JSON formatting
   - Test event handling

3. **Performance**
   - Monitor liquid operations
   - Check image optimization
   - Verify caching
   - Test loading times 