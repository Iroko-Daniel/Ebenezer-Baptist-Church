# Display project structure (excluding node_modules and .next)
$folders = @(
    "app",
    "components",
    "database",
    "docs",
    "hooks",
    "lib",
    "public",
    "styles",
    "types",
    "utils"
)

foreach ($folder in $folders) {
    $path = Join-Path $PWD.Path $folder
    if (Test-Path $path) {
        Write-Host "`n📁 $folder" -ForegroundColor Cyan
        Get-ChildItem -Path $path -Recurse -Depth 2 | Where-Object { 
            $_.FullName -notmatch 'node_modules' -and $_.FullName -notmatch '\.next' 
        } | ForEach-Object {
            $relative = $_.FullName.Replace($PWD.Path + '\', '')
            if ($_.PSIsContainer) {
                Write-Host "  📂 $relative" -ForegroundColor Yellow
            } else {
                Write-Host "     📄 $relative" -ForegroundColor Gray
            }
        }
    }
}
