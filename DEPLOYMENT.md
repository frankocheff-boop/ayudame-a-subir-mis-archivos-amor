# Deployment Checklist for VERANO ESTATE

## Pre-Deployment Verification

### 1. File Structure ✓
- [x] All CSS files in `assets/css/`
- [x] All JS files in `assets/js/`
- [x] All pages in `pages/`
- [x] Translation files in `locales/`
- [x] New landing page as `index.html`

### 2. Code Validation ✓
- [x] JavaScript syntax validated
- [x] JSON files validated
- [x] HTML files use correct relative paths

### 3. Functionality Testing (To Do)
- [ ] Landing page loads correctly
- [ ] Navigation between pages works
- [ ] Language selector functions
- [ ] POS Neon system works
- [ ] POS Restaurant system works
- [ ] Guest Form validation works
- [ ] Guest Form localStorage persistence works
- [ ] WhatsApp integration generates correct messages
- [ ] Services calculation is accurate

## Deployment to GitHub Pages

### Method 1: Automatic Deployment
1. Go to repository Settings
2. Navigate to Pages
3. Select branch: `main` or `master`
4. Select folder: `/ (root)`
5. Save

### Method 2: Manual Deployment
```bash
# Ensure you're on the main branch
git checkout main

# Merge the reorganization branch
git merge copilot/reorganize-repo-structure

# Push to GitHub
git push origin main
```

## Post-Deployment Testing

Test the following URLs (replace with your actual GitHub Pages URL):
- Main page: `https://[username].github.io/[repo]/`
- POS Neon: `https://[username].github.io/[repo]/pages/pos-neon.html`
- POS Restaurant: `https://[username].github.io/[repo]/pages/pos-restaurant.html`
- Guest Form: `https://[username].github.io/[repo]/pages/guest-form.html`

## Configuration Updates

### WhatsApp Number
File: `assets/js/guest-form.js`
```javascript
const phoneNumber = '523221606843'; // Update if needed
```

### Service Prices
File: `assets/js/guest-form.js`
```javascript
let servicesPrices = {
    breakfast: 120,
    lunch: 180,
    dinner: 595,
    openBar: 110
};
```

### Brand Colors
Files: `assets/css/*.css`
```css
:root {
    --brand-teal: #003C3C;
    --brand-bg: #FBF7F0;
}
```

## Cleanup After Successful Deployment

Once everything is verified to work correctly:

```bash
# Remove old files
git rm "formulario guest form.html"
git rm "html-soft -restaurante.html"
git rm ramazote
git commit -m "Remove old files after successful migration"
git push
```

## Maintenance

### Adding New Menu Items
Edit the respective JavaScript file:
- POS Neon: `assets/js/pos-neon.js`
- POS Restaurant: `assets/js/pos-restaurant.js`

### Adding New Translations
1. Edit `locales/es.json` and `locales/en.json`
2. Add corresponding `data-i18n` attributes in HTML
3. No code changes needed - i18n system handles it automatically

### Updating Prices
Edit `assets/js/guest-form.js` → `servicesPrices` object

## Support

For issues or questions:
- 📧 Email: franko@veranostate.com
- 📞 Phone: +52 322 160 6843

## Version History

- v2.0.0 (2025) - Complete reorganization with i18n support
- v1.0.0 - Initial version with basic POS systems
