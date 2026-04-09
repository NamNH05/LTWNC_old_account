param(
  [string]$ContainerName = "ltnwc_postgres",
  [string]$DbName = "shopdb",
  [string]$DbUser = "shopuser",
  [string]$OutputDir = "./backups"
)

$ErrorActionPreference = "Stop"

if (!(Test-Path $OutputDir)) {
  New-Item -ItemType Directory -Path $OutputDir | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmm"
$outputFile = Join-Path $OutputDir ("{0}_{1}.sql" -f $DbName, $timestamp)

Write-Host "Creating backup: $outputFile"

docker exec $ContainerName pg_dump -U $DbUser -d $DbName > $outputFile

if (!(Test-Path $outputFile)) {
  throw "Backup file was not created."
}

Write-Host "Backup completed: $outputFile"
