# Migration Notes

## Old Files (Can be Removed)

The following files are old versions that have been refactored and moved to the new structure:

### Original Files (can be deleted after verification)
- `formulario guest form.html` → Refactored to `pages/guest-form.html`
- `html-soft -restaurante.html` → Refactored to `pages/pos-restaurant.html`
- `ramazote` → Old HTML file (purpose unclear, can be archived)

### Backup
- `pages/pos-neon-original.html` → Original index.html (kept as backup)

## New Structure

All functionality has been moved to:
- `pages/` - All application pages
- `assets/css/` - Separated CSS files
- `assets/js/` - Separated JavaScript files
- `locales/` - Translation files
- `index.html` - New landing page

## Verification Steps

1. Test all three systems:
   - POS Neon: http://localhost:8000/pages/pos-neon.html
   - POS Restaurant: http://localhost:8000/pages/pos-restaurant.html
   - Guest Form: http://localhost:8000/pages/guest-form.html

2. Test language switching on Guest Form

3. Test WhatsApp integration on Guest Form

4. Test localStorage persistence on Guest Form

## Cleanup Command

After verification, run:
```bash
git rm "formulario guest form.html"
git rm "html-soft -restaurante.html"
git rm ramazote
git commit -m "Remove old files after successful migration"
```
