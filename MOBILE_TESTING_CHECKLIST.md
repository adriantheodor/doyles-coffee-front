# Mobile Testing Checklist

Use this checklist to verify mobile responsiveness across all pages and devices.

---

## Pre-Testing Setup

### Chrome DevTools Setup
- [ ] Press F12 to open DevTools
- [ ] Press Ctrl+Shift+M to toggle device toolbar
- [ ] Uncheck \"Throttling\" if your network is fast
- [ ] Check \"Show device frame\" for better visualization
- [ ] Clear browser cache (Ctrl+Shift+Delete)

### Real Device Setup
- [ ] Use iPhone (Safari) + Android (Chrome) if possible
- [ ] Test on WiFi first, then 4G/5G
- [ ] Clear app cache before testing
- [ ] Test in portrait and landscape orientation

---

## Global Tests (All Pages)

### Navigation
- [ ] Hamburger menu appears on mobile (< 768px)
- [ ] Menu icon is clickable (44px minimum)
- [ ] Menu items are readable
- [ ] Menu closes when item is clicked
- [ ] Navigation works smoothly
- [ ] No dropdown overlap issues

### Layout
- [ ] Page width fits screen (no horizontal scroll)
- [ ] Content doesn't overflow sides
- [ ] Padding looks reasonable (not cramped)
- [ ] Margin/spacing is proportional
- [ ] Cards stack properly on mobile
- [ ] Grids transition smoothly between sizes

### Text & Typography
- [ ] Text is readable without zooming
- [ ] Font sizes scale appropriately
- [ ] Line height is comfortable (≥1.4)
- [ ] No text overlap
- [ ] Headings are proportional to content
- [ ] Links are underlined or colored

### Images
- [ ] Images don't overflow
- [ ] Images scale proportionally
- [ ] Images load in reasonable time
- [ ] Alt text displays if image fails
- [ ] No white space around images
- [ ] Carousel works smoothly

### Buttons & Forms
- [ ] Buttons are at least 44×44px
- [ ] Buttons are easy to tap
- [ ] Button text is clear
- [ ] Form inputs are 44px tall minimum
- [ ] Input labels are visible
- [ ] Placeholder text is readable
- [ ] Form doesn't auto-scroll weirdly

### Performance
- [ ] Page loads within 3 seconds
- [ ] No lag when scrolling
- [ ] Touch interactions feel responsive
- [ ] No console errors (F12 → Console)
- [ ] Memory usage is reasonable

---

## HomePage Tests

### Desktop View (1920px)
- [ ] Logo is 250px wide
- [ ] Carousel height is 60vh
- [ ] All 3 columns of contact cards visible
- [ ] Section padding (4rem) looks good
- [ ] Form inputs are properly spaced

### Tablet View (768px - 991px)
- [ ] Logo is 250px wide
- [ ] Carousel height is 60vh
- [ ] Contact cards display in 1-2 columns
- [ ] Form looks readable
- [ ] No overflow issues

### Mobile View (375px - 575px)
- [ ] Logo is 180px wide ✅
- [ ] Carousel height is 40vh ✅
- [ ] Contact cards stack vertically ✅
- [ ] Form inputs are full width ✅
- [ ] Section padding is 2rem (reduced) ✅
- [ ] Form is easy to fill on mobile ✅

### Carousel
- [ ] Images display correctly
- [ ] Navigation arrows work
- [ ] Images don't crop weirdly
- [ ] Carousel height changes appropriately
- [ ] No image overlap

### Contact Section
- [ ] \"Contact Us\" heading size is appropriate
- [ ] Contact cards stack properly
- [ ] Icon boxes are centered
- [ ] Phone/email links are clickable
- [ ] Cards have proper spacing

---

## LoginPage Tests

### Desktop View (1920px)
- [ ] Card width is max 400px ✅
- [ ] Card padding is 2.5rem ✅
- [ ] Heading is 2rem ✅
- [ ] Form looks centered
- [ ] \"Register\" link is obvious

### Tablet View (768px - 991px)
- [ ] Card padding is 2.5rem
- [ ] Form is readable
- [ ] Buttons are clickable

### Mobile View (375px - 575px)
- [ ] Card padding is 1.5rem ✅
- [ ] Heading is 1.5rem ✅
- [ ] Form inputs are full width ✅
- [ ] Form inputs are 44px tall ✅
- [ ] Button is 44px tall ✅
- [ ] No overflow on either side

### Forms
- [ ] Email field accepts input
- [ ] Password field masks text
- [ ] \"Login\" button submits form
- [ ] \"Register\" button navigates to register page
- [ ] Error messages display properly
- [ ] Success messages display properly

---

## CustomerDashPage Tests

### Dashboard Grid
- [ ] Mobile: Cards stack vertically ✅
- [ ] Tablet (576px+): 2 columns ✅
- [ ] Desktop (992px+): 3-4 columns ✅
- [ ] Cards have proper gap/spacing
- [ ] Cards are clickable

### Quick Links Grid
- [ ] Mobile: 1 column ✅
- [ ] Tablet (576px+): 2 columns ✅
- [ ] Buttons are 44px tall ✅
- [ ] Buttons text is readable
- [ ] Button hover effect works

### Recent Orders/Issues
- [ ] List items display properly
- [ ] No horizontal scroll
- [ ] Items are readable
- [ ] Links are clickable

### Account Info
- [ ] User info displays clearly
- [ ] All fields visible on mobile
- [ ] No field overlap

---

## AdminDashPage Tests

### Quick Links
- [ ] Mobile: Smaller buttons (140px min) ✅
- [ ] Desktop: Larger buttons (180px min) ✅
- [ ] All 7 buttons fit without wrap
- [ ] Button text is readable
- [ ] Buttons are clickable

### Metrics Row
- [ ] Mobile: 1 metric per row ✅
- [ ] Tablet (576px+): 2 metrics per row ✅
- [ ] Desktop (992px+): 4 metrics per row ✅
- [ ] Metrics have proper spacing
- [ ] Numbers are readable

### Recent Orders Table
- [ ] Mobile: Table font is 0.85rem ✅
- [ ] Table padding is 0.5rem 0.75rem ✅
- [ ] Table can scroll horizontally if needed ✅
- [ ] Desktop: Larger font (0.95rem) ✅
- [ ] Table headers are visible
- [ ] Row hover effect works

### Issue List
- [ ] Issues display as list items
- [ ] Items have proper spacing
- [ ] Links are clickable
- [ ] No formatting issues

---

## Device-Specific Tests

### iPhone SE (375px)
- [ ] Text readable without zoom
- [ ] Forms are usable
- [ ] Buttons are tappable
- [ ] No horizontal scroll
- [ ] Images scale correctly
- [ ] Carousel works smoothly

### iPhone 14 Pro (390px)
- [ ] Same as iPhone SE
- [ ] Notch doesn't interfere with content
- [ ] Safe area respected (padding)

### iPad (768px)
- [ ] Tablet layout appears (2 columns)
- [ ] Landscape mode works
- [ ] Touch interactions smooth
- [ ] Spacing is proportional

### iPad Pro (1024px)
- [ ] Desktop-like layout
- [ ] Multiple columns visible
- [ ] Content doesn't spread too wide
- [ ] No wasted whitespace

### Android Phone (360px)
- [ ] Content fits screen
- [ ] Touch targets are accessible
- [ ] Form fields work correctly
- [ ] Navigation hamburger works

### Android Tablet (600px)
- [ ] Multi-column layout appears
- [ ] Content is readable
- [ ] Spacing is balanced

---

## Orientation Tests

### Portrait Orientation
- [ ] All content visible without scroll
- [ ] Images don't overflow
- [ ] Forms fit screen
- [ ] Keyboard doesn't hide content

### Landscape Orientation
- [ ] Content doesn't wrap awkwardly
- [ ] Horizontal scroll not needed
- [ ] Touch targets still accessible
- [ ] Layout looks reasonable

---

## Accessibility Tests

### Keyboard Navigation
- [ ] Tab through form fields ✅
- [ ] Focus states visible
- [ ] All links accessible via keyboard
- [ ] Menu items navigable with arrow keys

### Screen Reader (Mobile)
- [ ] All text read correctly
- [ ] Images have alt text
- [ ] Form labels associated with inputs
- [ ] Buttons have descriptive text

### Zoom
- [ ] Content readable at 200% zoom
- [ ] No horizontal scroll at zoom
- [ ] Touch targets still tappable
- [ ] Text doesn't get cut off

### Color Contrast
- [ ] Text contrast meets WCAG AA (4.5:1)
- [ ] Links are distinguishable
- [ ] Buttons have good contrast
- [ ] No color-only information

---

## Performance Tests

### Network Speed
- [ ] Test on Fast 3G (DevTools)
- [ ] Test on Slow 4G (DevTools)
- [ ] Test on Offline (DevTools)
- [ ] Page still renders (no blank page)

### Page Load
- [ ] First Contentful Paint (FCP) < 1.8s
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Run Lighthouse audit (DevTools)

### Responsiveness
- [ ] No jank during scroll
- [ ] Smooth transitions/animations
- [ ] Quick response to taps
- [ ] No freezing or lag

---

## Issue Tracking

### Found Issues
Use this section to track any problems found during testing:

| Issue | Device | Page | Severity | Status |
|-------|--------|------|----------|--------|
| Example: Text overflow | iPhone SE | HomePage | High | Fixed |
| | | | | |
| | | | | |
| | | | | |

**Severity Levels**:
- Critical: Page broken, unusable
- High: Major UX issue, difficult to use
- Medium: Minor layout issue, still usable
- Low: Small visual issue, not affecting function

---

## Signoff

- [ ] All critical issues fixed
- [ ] All high-priority issues fixed
- [ ] Tested on at least 2 real devices
- [ ] Lighthouse score > 80
- [ ] No console errors
- [ ] Ready for production

**Tested By**: ________________
**Date**: ________________
**Devices Tested**: ________________

---

## Quick Commands for Testing

### Chrome DevTools Console
```javascript
// Check viewport size
console.log(`${window.innerWidth}px × ${window.innerHeight}px`);

// Find touch target issues
document.querySelectorAll('button, input, a').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.width < 44 || rect.height < 44) {
    console.warn('Too small:', el, `${rect.width}×${rect.height}`);
  }
});
```

### DevTools Network Testing
```
1. Open DevTools (F12)
2. Go to Network tab
3. Click throttling dropdown (usually \"No throttling\")
4. Select \"Fast 3G\" or \"Slow 4G\"
5. Reload page
6. Check load time
```

### Lighthouse Audit
```
1. Open DevTools (F12)
2. Click \"Lighthouse\" tab
3. Click \"Analyze page load\"
4. Review report (Performance, Accessibility, etc.)
5. Target score > 80 on all metrics
```

---

## Resources

- **Responsive Testing**: [responsivedesignchecker.com](https://responsivedesignchecker.com)
- **Device Emulation**: Chrome DevTools (F12 → Device Icon)
- **Real Device Testing**: [BrowserStack](https://www.browserstack.com)
- **Accessibility**: [WAVE Browser Extension](https://wave.webaim.org/extension/)
- **Performance**: Chrome DevTools Lighthouse

---

## Success Criteria ✅

Your mobile redesign is successful when:
- ✅ No horizontal scrolling on mobile (< 768px)
- ✅ All buttons/inputs are 44px minimum
- ✅ Text is readable without zoom
- ✅ Forms work smoothly
- ✅ Layout adapts to 3+ breakpoints
- ✅ No console errors
- ✅ Lighthouse score > 80
- ✅ Works on real devices

Good luck with your testing! 🚀

