# Specification

## Summary
**Goal:** Let signed-in users find and copy their Internet Identity Principal ID from a profile/account area for use in admin access requests.

**Planned changes:**
- Add an authenticated profile/account page/area that displays the current Internet Identity Principal ID as labeled, copyable text.
- Add a “Copy” action for the Principal ID with visible confirmation (toast or inline message).
- Add a 1-click navigation entry from the storefront header/navigation to the profile/account area, shown only when authenticated.
- Ensure the displayed Principal ID is sourced from the active Internet Identity session and updates immediately on login/logout/identity switch without a page refresh.

**User-visible outcome:** After signing in, users can open a profile/account area from the header, see “Your Principal ID” in standard format, and copy it with confirmation; when signed out, the profile/account area is not available and users are prompted to log in.
