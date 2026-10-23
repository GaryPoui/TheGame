[CmdletBinding()]
param([string]$Repository = 'GaryPoui/TheGame')
$ErrorActionPreference = 'Stop'
$workspace = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$distribution = (Resolve-Path -LiteralPath (Join-Path $workspace 'dist')).Path
if (-not $distribution.StartsWith($workspace + [IO.Path]::DirectorySeparatorChar)) {
  throw 'dist must resolve inside the workspace'
}
if (-not (Test-Path -LiteralPath (Join-Path $distribution 'index.html'))) { throw 'Build first' }
$staging = Join-Path ([IO.Path]::GetTempPath()) ('thegame-pages-' + [guid]::NewGuid().ToString('N'))
$remote = "https://github.com/$Repository.git"
$exists = git ls-remote --heads $remote gh-pages
if ($LASTEXITCODE -ne 0) { throw 'Could not inspect deployment branch' }
if ($exists) {
  git clone --quiet --single-branch --branch gh-pages $remote $staging
  if ($LASTEXITCODE -ne 0) { throw 'Could not clone deployment branch' }
} else {
  New-Item -ItemType Directory -Path $staging | Out-Null
  git -C $staging init --quiet -b gh-pages
  git -C $staging remote add origin $remote
}
# No recursive deletion: old hashed bundles may remain, preserving harmless rollback resources.
Get-ChildItem -LiteralPath $distribution -Force | Copy-Item -Destination $staging -Recurse -Force
New-Item -ItemType File -Path (Join-Path $staging '.nojekyll') -Force | Out-Null
$sourceCommit = git -C $workspace rev-parse HEAD
[ordered]@{sourceCommit=$sourceCommit;publishedAt=[DateTime]::UtcNow.ToString('o');version='urns-mvp-v1'} |
  ConvertTo-Json | Set-Content -LiteralPath (Join-Path $staging 'build-info.json') -Encoding utf8
git -C $staging add --all
git -C $staging commit --quiet -m "Publish urns MVP from $sourceCommit"
if ($LASTEXITCODE -ne 0) { throw 'Could not commit deployment; inspect staged files' }
git -C $staging push --quiet origin gh-pages
if ($LASTEXITCODE -ne 0) { throw 'Could not push deployment branch; no forced update attempted' }
$deploymentCommit = git -C $staging rev-parse HEAD
Write-Output "Deployment branch: $deploymentCommit"
Write-Output 'Configure/check Pages and verify the public HTTPS game before reporting completion.'
