# Release Notes v1.0.1

## 🐛 Bug Fixes & Improvements

### Mobile Touch Improvements
- **Fixed mobile button responsiveness** - All buttons now respond immediately to touch without delay
- **Added global touch-action styles** - Applied `touch-action: manipulation` to all interactive elements
- **Fixed z-index layering issues** - Mobile menu and sidebar now properly layer above other content
- **Removed unnecessary JavaScript handlers** - Cleaned up onTouchEnd handlers that were causing performance issues

### UI Cleanup
- **Removed Settings navigation** - Removed non-functional Settings page from sidebar

### Technical Fixes
- **Fixed viewport deprecation warnings** - Moved viewport config to separate export for Next.js 16+ compatibility

### Performance Optimizations
- Removed unnecessary CSS transitions from mobile menu
- Simplified pointer-events handling

---

**Full Changelog**: v1.0.0...v1.0.1
