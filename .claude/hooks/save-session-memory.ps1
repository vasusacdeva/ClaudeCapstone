$raw = [Console]::In.ReadToEnd()
$data = if ($raw) { $raw | ConvertFrom-Json } else { $null }
if ($data -and $data.stop_hook_active) { exit 0 }

$root = if ($env:CLAUDE_PROJECT_DIR) { $env:CLAUDE_PROJECT_DIR } else { (Get-Location).Path }
$state = Get-ChildItem -Path (Join-Path $root 'docs') -Filter 'pipeline-state.json' -Recurse -File -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $state) { exit 0 }

$memory = Join-Path $state.DirectoryName 'session-memory.md'
if ((Test-Path $memory) -and (Get-Item $memory).LastWriteTime -ge $state.LastWriteTime) { exit 0 }

$rel = $memory.Substring($root.Length + 1) -replace '\\', '/'
$reason = "Session memory is out of date. Update $rel using .claude/templates/session-memory.md (decisions, open questions, learnings, next steps), then stop. Do not treat it as approval."
@{ decision = 'block'; reason = $reason } | ConvertTo-Json -Compress
