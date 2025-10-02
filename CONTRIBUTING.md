# Contributing to Nexus Engineering Website

Thank you for your interest in contributing to the Nexus Engineering website! This document provides guidelines for making contributions.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and professional in all interactions.

## 🚀 Getting Started

### Prerequisites

- Node.js v14 or higher
- Git
- Basic knowledge of HTML, CSS, and JavaScript
- A code editor (VS Code recommended)

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Nexus-Engineering-Planning/Nexus-website.git
   cd Nexus-website
   ```

2. Install dependencies:
   ```bash
   cd js
   npm install
   ```

3. Test the build process:
   ```bash
   npm run build
   ```

## 💻 Development Workflow

### Directory Structure

```
.
├── css/              # Stylesheets
├── js/               # JavaScript files
├── images/           # Image assets
├── *.html           # Page templates
└── jobposts/        # Generated job pages (do not edit directly)
```

### Making Changes

1. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes** thoroughly:
   - Open pages in multiple browsers
   - Test responsive behavior
   - Verify all links work
   - Check console for errors

4. **Build job pages** if you modified the generator:
   ```bash
   cd js
   npm run build
   ```

5. **Commit your changes** following the commit guidelines

## 📝 Coding Standards

### HTML

- Use semantic HTML5 elements
- Include alt text for all images
- Add ARIA labels where appropriate
- Use descriptive id and class names
- Validate HTML using [W3C Validator](https://validator.w3.org/)

**Example**:
```html
<section class="services" role="region" aria-label="Our Services">
  <div class="container">
    <h2 class="section-title">Our Services</h2>
    <img src="/images/service.jpg" alt="Urban planning meeting" loading="lazy">
  </div>
</section>
```

### CSS

- Use CSS custom properties for colors and common values
- Follow mobile-first responsive design
- Organize styles by component/section
- Add comments for complex selectors
- Avoid !important unless absolutely necessary

**Example**:
```css
/* Service Cards Section */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

@media (min-width: 768px) {
  .services-grid {
    gap: 3rem;
  }
}
```

### JavaScript

- Use ES6+ features (const, let, arrow functions)
- Add JSDoc comments for functions
- Include error handling for async operations
- Use descriptive variable and function names
- Avoid global variables

**Example**:
```javascript
/**
 * Validates an email address format
 * @param {string} email - The email address to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### File Organization

- **HTML files**: Root directory
- **CSS files**: `/css/` directory (both source and minified)
- **JS files**: `/js/` directory (both source and minified)
- **Images**: `/images/` directory
- **Job postings**: `/jobposts/` (auto-generated, don't edit)

## 📦 Commit Guidelines

### Commit Message Format

```
<type>: <subject>

<body> (optional)

<footer> (optional)
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no code change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
feat: Add dark mode toggle to header

fix: Correct email validation regex in contact form

docs: Update README with deployment instructions

style: Format CSS files with consistent indentation

refactor: Extract common validation logic into utility function

perf: Add lazy loading to images below fold
```

## 🧪 Testing

### Manual Testing Checklist

Before submitting changes, verify:

- [ ] All pages load without console errors
- [ ] Forms submit correctly
- [ ] Navigation works on all pages
- [ ] Images load and have proper alt text
- [ ] Page is responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Links open in correct targets
- [ ] Meta tags are present and correct

### Browser Testing

Test in the following browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### Accessibility Testing

- Use browser dev tools Lighthouse audit
- Test keyboard navigation (Tab, Enter, Escape)
- Verify focus indicators are visible
- Check color contrast meets WCAG AA standards

## 🔄 Submitting Changes

### Pull Request Process

1. **Update documentation** if you've changed functionality

2. **Ensure tests pass** and code follows standards

3. **Create a pull request** with:
   - Clear title describing the change
   - Description of what changed and why
   - Screenshots for UI changes
   - Reference to any related issues

4. **Wait for review** and address feedback

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing done

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Tested on multiple browsers
```

## 🎨 Style Guide

### CSS Class Naming

Use BEM (Block Element Modifier) convention:

```css
.service-card { }           /* Block */
.service-card__title { }    /* Element */
.service-card--featured { } /* Modifier */
```

### Color Palette

Use CSS custom properties defined in `:root`:

```css
:root {
  --primary: #2E7D32;      /* Green */
  --primary-dark: #1B5E20; /* Dark green */
  --dark: #000000;         /* Black */
  --light: #ffffff;        /* White */
  --gray: #ccc;            /* Gray */
}
```

### Typography

```css
:root {
  --font-main: 'Segoe UI', sans-serif;
}
```

## 🐛 Reporting Issues

### Bug Reports

Include:
- Browser and version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternative solutions considered
- Additional context

## 📞 Getting Help

If you have questions:

- **Email**: support@nexuseng.org
- **Issues**: Open a GitHub issue for technical questions

## 📄 License

By contributing, you agree that your contributions will be licensed under the same terms as the project.

---

**Thank you for contributing to Nexus Engineering!**
