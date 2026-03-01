# First, install GitHub CLI and authenticate:
# - `winget install --id GitHub.cli`
# - `gh auth login`
# - `$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")`

$REPO = "borreze/borreze" 

# Delete default GitHub labels
Write-Host "Deleting default labels..."

gh label delete "bug" --repo $REPO --yes 2>$null
gh label delete "documentation" --repo $REPO --yes 2>$null
gh label delete "duplicate" --repo $REPO --yes 2>$null
gh label delete "enhancement" --repo $REPO --yes 2>$null
gh label delete "good first issue" --repo $REPO --yes 2>$null
gh label delete "help wanted" --repo $REPO --yes 2>$null
gh label delete "invalid" --repo $REPO --yes 2>$null
gh label delete "question" --repo $REPO --yes 2>$null
gh label delete "wontfix" --repo $REPO --yes 2>$null

Write-Host "Creating labels..."

# Type
gh label create "feature" --color "0075ca" --repo $REPO
gh label create "bug" --color "d73a4a" --repo $REPO
gh label create "technical" --color "e4e669" --repo $REPO
gh label create "documentation" --color "0052cc" --repo $REPO
gh label create "security" --color "b60205" --repo $REPO
gh label create "WIP" --color "fbca04" --repo $REPO
gh label create "automated" --color "bfd4f2" --repo $REPO

# Priority
gh label create "priority: critical" --color "b60205" --repo $REPO
gh label create "priority: high" --color "e4772b" --repo $REPO
gh label create "priority: medium" --color "fbca04" --repo $REPO
gh label create "priority: low" --color "0e8a16" --repo $REPO
gh label create "prioritized" --color "d93f0b" --repo $REPO

# Module
gh label create "frontend" --color "1d76db" --repo $REPO
gh label create "backend" --color "5319e7" --repo $REPO
gh label create "database" --color "006b75" --repo $REPO
gh label create "back-office" --color "0075ca" --repo $REPO
gh label create "infra / devops" --color "e4e669" --repo $REPO

# Status
gh label create "waiting" --color "cccccc" --repo $REPO
gh label create "milestone" --color "c2e0c6" --repo $REPO
gh label create "to validate" --color "0e8a16" --repo $REPO

Write-Host "Done"