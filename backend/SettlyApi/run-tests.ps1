# PowerShell script to run integration tests for SettlyApi

Write-Host "Running SettlyApi integration tests..." -ForegroundColor Green

# Navigate to the SettlyApi directory
Set-Location $PSScriptRoot

# Run the tests using dotnet test
dotnet test --verbosity normal

Write-Host "Tests completed!" -ForegroundColor Green 