$ErrorActionPreference = 'Stop'
$projectDirectory = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$secretsDirectory = Join-Path $projectDirectory '.jenkins'
$passwordPath = Join-Path $secretsDirectory 'admin-password'
New-Item -ItemType Directory -Path $secretsDirectory -Force | Out-Null
if (-not (Test-Path -LiteralPath $passwordPath)) {
    $randomBytes = New-Object byte[] 32
    $generator = [System.Security.Cryptography.RandomNumberGenerator]::Create()
    try { $generator.GetBytes($randomBytes) } finally { $generator.Dispose() }
    [System.IO.File]::WriteAllText($passwordPath, [Convert]::ToBase64String($randomBytes))
}
Push-Location -LiteralPath $projectDirectory
try {
    docker --context desktop-linux compose up --detach --build
    if ($LASTEXITCODE -ne 0) { throw 'Jenkins startup failed. Review the Docker build output above; Docker Desktop must be running Linux containers.' }
} finally { Pop-Location }
Write-Output 'Jenkins: http://localhost:8080/ (username: admin)'
Write-Output "Password file: $passwordPath"
