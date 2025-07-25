# Development Tools & Workflow

This document outlines the development tools, CLI commands, and workflow for the Fluid Framework.

## Shopify CLI

### Installation
```bash
# Install Shopify CLI globally
npm install -g @shopify/cli @shopify/theme

# Verify installation
shopify version
```

### Common Commands

#### Theme Development
```bash
# Start development server
shopify theme dev

# List themes
shopify theme list

# Pull theme files
shopify theme pull

# Push theme changes
shopify theme push

# Watch for changes
shopify theme dev --watch
```

#### Theme Check
```bash
# Run theme check
shopify theme check

# Check specific files
shopify theme check templates/product.liquid

# Fix auto-fixable issues
shopify theme check --fix
```

## Development Workflow

### Local Development
1. **Setup**
   ```bash
   # Clone repository
   git clone [repository-url]
   
   # Start development server
   shopify theme dev -s [store-url]
   ```

2. **Development Process**
   - Make changes in local environment
   - Test changes using development server
   - Run theme check for validation
   - Push changes to development theme

### Theme Structure
```
theme/
├── layout/          # Theme layouts
├── templates/       # Page templates
├── sections/        # Theme sections
├── blocks/          # Theme blocks and components
├── snippets/        # Reusable components
├── config/          # Theme settings
├── assets/          # JavaScript, CSS, images
└── locales/         # Translation files
```

## Development Guidelines

### Layout Best Practices
1. **Structure**
   - Keep `theme.liquid` clean and minimal
   - Use Shopify's meta tags and SEO elements
   - Implement Shopify's schema markup
   - Use Shopify's viewport settings

2. **Performance**
   - Use Shopify's CDN for assets
   - Defer non-critical JavaScript
   - Use Shopify's font loading
   - Implement Shopify's caching

3. **Maintenance**
   - Document layout variables
   - Use Shopify's naming conventions
   - Keep layout files focused
   - Follow Shopify's error handling

### Template Best Practices
1. **Organization**
   - Use Shopify's template structure
   - Implement Shopify's template inheritance
   - Keep templates focused and single-purpose
   - Use Shopify's template types

2. **Content Management**
   - Use Shopify's section architecture
   - Implement dynamic sections
   - Use Shopify's content structure
   - Document template variables

3. **User Experience**
   - Use Shopify's loading states
   - Handle empty states gracefully
   - Use Shopify's navigation
   - Implement Shopify's error pages

### Section Best Practices
1. **Structure**
   - Use Shopify's section architecture
   - Implement Shopify's section settings
   - Use Shopify's section blocks
   - Document section dependencies

2. **Performance**
   - Use Shopify's section loading
   - Implement Shopify's lazy loading
   - Minimize section dependencies
   - Use Shopify's liquid operations

3. **Maintenance**
   - Document section settings
   - Use Shopify's naming conventions
   - Keep sections focused
   - Follow Shopify's error handling

### Snippet Best Practices
1. **Organization**
   - Group related snippets
   - Use Shopify's naming conventions
   - Keep snippets focused
   - Document snippet parameters

2. **Reusability**
   - Make snippets modular
   - Use Shopify's parameter naming
   - Implement proper defaults
   - Document usage examples

3. **Performance**
   - Minimize snippet nesting
   - Use Shopify's liquid operations
   - Use Shopify's caching
   - Use efficient markup

### Block Best Practices
1. **Structure**
   - Use Shopify's block architecture
   - Implement Shopify's block settings
   - Use Shopify's block presets
   - Document block dependencies

2. **Customization**
   - Use Shopify's setting types
   - Implement Shopify's validation
   - Document customization options
   - Use Shopify's defaults

3. **Integration**
   - Ensure section compatibility
   - Use Shopify's event handling
   - Use Shopify's styling
   - Document integration requirements

### General Best Practices

#### Code Quality
- Use ESLint for JavaScript linting
- Use Stylelint for CSS/SCSS linting
- Follow Shopify's theme best practices
- Maintain consistent code style
- Use Shopify's theme check
- Follow Shopify's theme best practices

#### Performance
- Optimize images before committing
- Modularize CSS and JavaScript
- Use lazy loading where appropriate
- Follow Shopify's performance guidelines

#### Testing
- Test across different devices
- Verify responsive design
- Check browser compatibility

## Debugging

### Theme Editor
- Use Shopify's theme editor
- Test section settings
- Verify responsive behavior
- Check theme settings

### Browser Tools
- Use Chrome DevTools
- Monitor network requests
- Check console for errors
- Use Lighthouse for performance

### Common Issues
1. **Theme Check Errors**
   - Fix liquid syntax errors
   - Update deprecated features
   - Follow Shopify guidelines

2. **Build Errors**
   - Check Shopify's configuration
   - Verify dependencies
   - Check for syntax errors

3. **Deployment Issues**
   - Verify theme settings
   - Check file permissions
   - Validate JSON files

## Version Control

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "Add new feature"

# Push changes
git push origin feature/new-feature
```

### Branch Strategy
- `main` - Production theme
- `development` - Development theme
- `feature/*` - Feature branches
- `hotfix/*` - Emergency fixes

## Deployment

### Production Deployment
1. **Prepare**
   - Run theme check
   - Build assets
   - Test locally

2. **Deploy**
   ```bash
   # Push to production
   shopify theme push --theme-editor-sync
   
   # Verify deployment
   shopify theme list
   ```

### Rollback
```bash
# List theme versions
shopify theme versions

# Rollback to version
shopify theme push --version [version-id]
```

## Additional Tools

### Recommended Extensions
- Shopify Theme Check
- Liquid Language Support
- Shopify CLI
- Theme Kit

### Development Resources
- [Shopify Theme Documentation](https://shopify.dev/themes)
- [Theme Check Documentation](https://shopify.dev/themes/tools/theme-check)
- [Liquid Documentation](https://shopify.dev/docs/api/liquid)
- [Theme Kit Documentation](https://shopify.github.io/themekit/) 