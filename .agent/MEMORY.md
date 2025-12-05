# Agent Memory

## PowerShell Notes
- PowerShell does NOT support `&&` operator for chaining commands. Use `;` instead.

## IMPORTANT - After Every Change
- **ALWAYS run `docker build -t zastavky_d1 .` after making changes**
- Then restart the container: `docker stop zastavky_d1_test; docker rm zastavky_d1_test; docker run -d --name zastavky_d1_test -p 8080:80 zastavky_d1`
- Test the changes at http://localhost:8080/

## Pre-Release Checklist
- [ ] Run `docker build -t zastavky_d1 .` locally
- [ ] Test the web app in Docker container before pushing
- [ ] Test light/dark theme toggle works correctly
- [ ] Verify default theme is light
- [ ] Check both themes look correct
