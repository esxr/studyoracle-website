# 001 - Click Targets & Hamburger Menu Fixes

## Problems
1. **Tiny nav link click targets** - Desktop `<Link>` elements in Header had no padding (~34x17px), making them hard to click.
2. **Mobile menu pointer leak** - `MobileMenu` slide-out panel (always in DOM via `translate-x-full`) could intercept pointer events when closed.
3. **Content hidden behind fixed header** - `<main>` had no top padding to offset the `fixed top-0` header.

## What Was Fixed
| File | Change |
|------|--------|
| `src/components/layout/Header.tsx` | Added `inline-block rounded-md px-3 py-2` to desktop nav `<Link>` elements |
| `src/components/layout/MobileMenu.tsx` | Added `pointer-events-none` (closed) / `pointer-events-auto` (open) to slide-out panel |
| `src/app/layout.tsx` | Added `pt-16` to `<main>` to clear the fixed header |

## Not Changed
- Hero CTA buttons (`Button` component) already had `px-6 py-3` - adequate click targets.
