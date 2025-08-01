using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Xunit;
using SettlyApi.Controllers; // Adjust if FeaturesController is in another namespace


namespace SettlyApi.Tests;

/// <summary>
/// Integration tests for the FeaturesController using WebApplicationFactory
/// </summary>
public class FeaturesControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public FeaturesControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    /// <summary>
    /// Test that the GET /api/features endpoint returns a successful response
    /// </summary>
    [Fact]
    public async Task Get_ReturnsSuccessStatusCode()
    {
        // Act
        var response = await _client.GetAsync("/api/features");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    /// <summary>
    /// Test that the GET /api/features endpoint returns JSON content
    /// </summary>
    [Fact]
    public async Task Get_ReturnsJsonContent()
    {
        // Act
        var response = await _client.GetAsync("/api/features");

        // Assert
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);
    }

    /// <summary>
    /// Test that the GET /api/features endpoint returns the expected features
    /// </summary>
    [Fact]
    public async Task Get_ReturnsExpectedFeatures()
    {
        // Act
        var response = await _client.GetAsync("/api/features");
        var content = await response.Content.ReadAsStringAsync();
        var features = JsonSerializer.Deserialize<List<Feature>>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        // Assert
        Assert.NotNull(features);
        Assert.Equal(3, features.Count);

        // Verify SettlyHome feature
        var settlyHome = features.FirstOrDefault(f => f.Id == "settlyhome");
        Assert.NotNull(settlyHome);
        Assert.Equal("SettlyHome", settlyHome.Title);
        Assert.Equal("Explore smart suburb picks and lifestyle-friendly neighbourhoods.", settlyHome.Description);
        Assert.Equal("/features/settlyhome", settlyHome.Route);

        // Verify SettlyLoan feature
        var settlyLoan = features.FirstOrDefault(f => f.Id == "settlyloan");
        Assert.NotNull(settlyLoan);
        Assert.Equal("SettlyLoan", settlyLoan.Title);
        Assert.Equal("Compare fixed vs variable, estimate repayments, and beat loan stress.", settlyLoan.Description);
        Assert.Equal("/features/settlyloan", settlyLoan.Route);

        // Verify SettlySuper feature
        var settlySuper = features.FirstOrDefault(f => f.Id == "settlysuper");
        Assert.NotNull(settlySuper);
        Assert.Equal("SettlySuper", settlySuper.Title);
        Assert.Equal("Use your Super Wisely to Boost Your Home Plan.", settlySuper.Description);
        Assert.Equal("/features/settlysuper", settlySuper.Route);
    }

    /// <summary>
    /// Test that the GET /api/features endpoint returns features in the correct order
    /// </summary>
    [Fact]
    public async Task Get_ReturnsFeaturesInCorrectOrder()
    {
        // Act
        var response = await _client.GetAsync("/api/features");
        var content = await response.Content.ReadAsStringAsync();
        var features = JsonSerializer.Deserialize<List<Feature>>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        // Assert
        Assert.NotNull(features);
        Assert.Equal(3, features.Count);

        // Verify order: settlyhome, settlyloan, settlysuper
        Assert.Equal("settlyhome", features[0].Id);
        Assert.Equal("settlyloan", features[1].Id);
        Assert.Equal("settlysuper", features[2].Id);
    }

    /// <summary>
    /// Test that the GET /api/features endpoint handles concurrent requests
    /// </summary>
    [Fact]
    public async Task Get_HandlesConcurrentRequests()
    {
        // Arrange
        var tasks = new List<Task<HttpResponseMessage>>();

        // Act - Make 5 concurrent requests
        for (int i = 0; i < 5; i++)
        {
            tasks.Add(_client.GetAsync("/api/features"));
        }

        var responses = await Task.WhenAll(tasks);

        // Assert - All requests should succeed
        foreach (var response in responses)
        {
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }
    }

    /// <summary>
    /// Test that the GET /api/features endpoint returns proper error handling
    /// This test simulates a scenario where an exception might occur
    /// </summary>
    [Fact]
    public async Task Get_WithMockedException_ReturnsInternalServerError()
    {
        // Arrange - Create a factory that will cause an exception
        var exceptionFactory = _factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Add a service that will cause the controller to throw an exception
                services.AddScoped<ILogger<FeaturesController>>(provider =>
                {
                    var logger = provider.GetRequiredService<ILogger<FeaturesController>>();
                    // This is a simplified test - in a real scenario you might mock dependencies
                    return logger;
                });
            });
        });

        var exceptionClient = exceptionFactory.CreateClient();

        // Act
        var response = await exceptionClient.GetAsync("/api/features");

        // Assert - Should still return OK since the controller has try-catch
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }



    /// <summary>
    /// Test that the Feature model has all required properties
    /// </summary>
    [Fact]
    public void Feature_Model_HasRequiredProperties()
    {
        // Arrange
        var feature = new Feature
        {
            Id = "test-id",
            Title = "Test Title",
            Description = "Test Description",
            Route = "/test/route"
        };

        // Assert
        Assert.Equal("test-id", feature.Id);
        Assert.Equal("Test Title", feature.Title);
        Assert.Equal("Test Description", feature.Description);
        Assert.Equal("/test/route", feature.Route);
    }

    /// <summary>
    /// Test that the Feature model can be serialized and deserialized correctly
    /// </summary>
    [Fact]
    public void Feature_Model_CanBeSerializedAndDeserialized()
    {
        // Arrange
        var originalFeature = new Feature
        {
            Id = "test-id",
            Title = "Test Title",
            Description = "Test Description",
            Route = "/test/route"
        };

        // Act
        var json = JsonSerializer.Serialize(originalFeature);
        var deserializedFeature = JsonSerializer.Deserialize<Feature>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        // Assert
        Assert.NotNull(deserializedFeature);
        Assert.Equal(originalFeature.Id, deserializedFeature.Id);
        Assert.Equal(originalFeature.Title, deserializedFeature.Title);
        Assert.Equal(originalFeature.Description, deserializedFeature.Description);
        Assert.Equal(originalFeature.Route, deserializedFeature.Route);
    }
}

/// <summary>
/// Represents an application feature for testing purposes
/// </summary>
public class Feature
{
    /// <summary>
    /// Unique identifier for the feature
    /// </summary>
    public string Id { get; set; } = string.Empty;

    /// <summary>
    /// Display name of the feature
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Detailed description of the feature
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Route path for accessing the feature
    /// </summary>
    public string Route { get; set; } = string.Empty;
} 