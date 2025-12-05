---
description: Git operations permissions and guidelines
---

# Git Operations

The agent has permission to perform git operations directly without asking for user approval:

// turbo-all

1. `git add .` - Stage all changes
2. `git commit -m "message"` - Commit with descriptive message
3. `git push origin main` - Push to main branch
4. `git pull` - Pull latest changes
5. `git status` - Check status

## GitHub CLI (gh)

6. `gh release create vX.X.X --title "vX.X.X" --notes "Release notes"` - Create a new release
7. `gh release list` - List releases
8. `gh pr create` - Create pull request
9. `gh issue create` - Create issue

## Guidelines

- Use descriptive commit messages in English
- Commit related changes together
- Push after completing a feature or fix
- Always ensure code is tested before pushing
- Use semantic versioning for releases (vMAJOR.MINOR.PATCH)
