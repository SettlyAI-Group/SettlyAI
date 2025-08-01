# Integration Tests for SettlyApi

This directory contains integration tests for the SettlyApi using WebApplicationFactory and xUnit.

## Overview

The integration tests verify that the API endpoints work correctly in a realistic environment, including:

-   HTTP request/response handling
-   JSON serialization/deserialization
-   Controller behavior
-   Error handling
-   Concurrent request handling

## Test Structure

### FeaturesControllerTests.cs

Integration tests for the `FeaturesController` that test:

-   Successful GET requests to `/api/features`
-   JSON content type verification
-   Expected feature data validation
-   Feature order verification
-   Concurrent request handling
-   Error handling scenarios
-   Model serialization/deserialization

### CustomWebApplicationFactory.cs

Custom WebApplicationFactory that:

-   Configures an in-memory database for testing
-   Sets up the test environment
-   Handles dependency injection for testing
-   Ensures database is created and seeded if needed

## Running the Tests

### Using PowerShell

```powershell
# From the SettlyApi directory
.\run-tests.ps1
```

### Using dotnet CLI

```bash
# From the SettlyApi directory
dotnet test
```

### Running specific tests

```bash
# Run only FeaturesController tests
dotnet test --filter "FullyQualifiedName~FeaturesControllerTests"

# Run with verbose output
dotnet test --verbosity detailed
```

## Test Configuration

The tests use:

-   **In-memory database**: No external database required
-   **Test environment**: Configured via `appsettings.Test.json`
-   **WebApplicationFactory**: Provides realistic HTTP testing environment
-   **xUnit**: Testing framework

## Adding New Tests

To add new integration tests:

1. Create a new test class in the `Tests` directory
2. Inherit from `IClassFixture<CustomWebApplicationFactory>`
3. Use the `_client` to make HTTP requests
4. Assert on the responses

Example:

```csharp
public class NewControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public NewControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task Get_ReturnsSuccessStatusCode()
    {
        var response = await _client.GetAsync("/api/endpoint");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
```

## Dependencies

The tests require these NuGet packages:

-   `Microsoft.AspNetCore.Mvc.Testing`
-   `Microsoft.EntityFrameworkCore.InMemory`
-   `Microsoft.NET.Test.Sdk`
-   `xunit`
-   `xunit.runner.visualstudio`
-   `coverlet.collector`

## Notes

-   Tests use an in-memory database to avoid external dependencies
-   The `CustomWebApplicationFactory` handles database configuration
-   All tests are async to properly test HTTP requests
-   Error handling is tested to ensure robustness
-   Concurrent request testing verifies thread safety
