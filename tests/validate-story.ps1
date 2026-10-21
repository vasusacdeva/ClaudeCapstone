param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Za-z][A-Za-z0-9]*-\d+$')]
    [string]$JiraId
)

# Checks that stage artifacts 01-06 exist and carry the Jira key, and that code-review is approved.
$root = Split-Path -Parent $PSScriptRoot
$dir = Join-Path $root "docs/$JiraId"
$failures = @()

$artifacts = @(
    '01-requirements.md', '02-architecture.md', '03-design-review.md',
    '04-impl-plan.md', '05-implementation-summary.md', '06-code-review.md'
)
foreach ($name in $artifacts) {
    $path = Join-Path $dir $name
    if (-not (Test-Path $path)) { $failures += "Missing artifact: docs/$JiraId/$name"; continue }
    if (-not (Select-String -Path $path -Pattern ([regex]::Escape($JiraId)) -Quiet)) {
        $failures += "Artifact does not mention $JiraId : $name"
    }
}

$statePath = Join-Path $dir 'pipeline-state.json'
if (-not (Test-Path $statePath)) {
    $failures += "Missing docs/$JiraId/pipeline-state.json"
} else {
    $state = Get-Content $statePath -Raw | ConvertFrom-Json
    $review = $state.stages.'code-review'
    if (-not $review -or $review.approval -ne 'approved' -or -not $review.approver) {
        $failures += 'code-review is not approved by a named approver in pipeline-state.json'
    }
}

if ($failures.Count -gt 0) {
    $failures | ForEach-Object { Write-Host "FAIL: $_" }
    exit 1
}
Write-Host "PASS: $JiraId stage artifacts 01-06 present and code-review approved"
exit 0
