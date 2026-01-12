# Release Notes v1.0.2

## 🐛 Bug Fixes & Improvements

### Mobile Touch Improvements
- **Fixed login button not working** - Added pointer-events-auto to MobileMenu backdrop and drawer
- **Added global touch-action styles** - Applied `touch-action: manipulation` to all interactive elements
- **Fixed z-index layering issues** - Mobile menu and sidebar now properly layer above other content

### Chat Mobile Optimization (Synced from HackBoiler)
- **Added ChatLayoutClient** - Mobile-optimized chat layout with slide-in conversation sidebar
- **Mobile conversation toggle** - Tap "Chats" button to open conversation list on mobile
- **Delete button always visible on mobile** - No longer requires hover to see delete option
- **Fixed image stretching** - Uploaded images now maintain proper aspect ratio

### UI Cleanup
- **Removed Settings navigation** - Removed non-functional Settings page from sidebar

### Technical Fixes
- **Fixed viewport deprecation warnings** - Moved viewport config to separate export for Next.js 16+ compatibility

---

**Full Changelog**: v1.0.1...v1.0.2
