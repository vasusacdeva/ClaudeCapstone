$root = if ($env:CLAUDE_PROJECT_DIR) { $env:CLAUDE_PROJECT_DIR } else { (Get-Location).Path }
$latest = Get-ChildItem -Path (Join-Path $root 'docs') -Filter 'session-memory.md' -Recurse -File -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
if (-not $latest) { exit 0 }
"Session memory from $($latest.FullName.Substring($root.Length + 1)) (context only; not approval evidence):"
Get-Content $latest.FullName -TotalCount 80
