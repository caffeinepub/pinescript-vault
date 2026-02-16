# Specification

## Summary
**Goal:** Grant admin access to the specified Internet Identity principal so they can use the admin dashboard and perform admin-only backend actions.

**Planned changes:**
- Add the provided principal (`7bzkw-ue5am-s2c6f-jvpfm-5uxw7-dkk76-u56hj-psrgc-hja4r-mztcz-xqe`) to the backend’s admin authorization logic in `backend/main.mo`.
- Ensure admin-protected backend methods accept requests from this principal while continuing to deny non-admin principals.
- Verify admin route access no longer shows an “Access Denied” state for this principal (without modifying frontend files under `frontend/immutablePaths`).

**User-visible outcome:** When logged in as principal `7bzkw-ue5am-s2c6f-jvpfm-5uxw7-dkk76-u56hj-psrgc-hja4r-mztcz-xqe`, the user can access admin pages and successfully run admin-only actions; other users remain blocked.
