using System;
using System.Net;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SettlyApi.Middlewares;
using SettlyModels;
using Xunit;

public class ErrorHandlingMiddlewareTests
{
    private class NullLogger<T> : ILogger<T>
    {
        public IDisposable BeginScope<TState>(TState state) => null!;
        public bool IsEnabled(LogLevel logLevel) => false;
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) { }
    }

    private class TestHostEnvironment : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = Environments.Development; // Development mode
        public string ApplicationName { get; set; } = "TestApp";
        public string ContentRootPath { get; set; } = AppContext.BaseDirectory;
        public IFileProvider ContentRootFileProvider { get => throw new NotImplementedException(); set => throw new NotImplementedException(); }
    }

    private DefaultHttpContext CreateHttpContext()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new System.IO.MemoryStream();
        return context;
    }

    [Theory]
    [InlineData(typeof(InvalidOperationException), HttpStatusCode.Conflict, "Operation is invalid in the current state.", "Invalid operation for testing")]
    [InlineData(typeof(FileNotFoundException), HttpStatusCode.NotFound, "File not found.", "Stamp duty JSON file not found.")]
    [InlineData(typeof(AppException), HttpStatusCode.BadRequest, "Business exception", "Custom business error")]
    public async Task Middleware_Development_ReturnsExpectedResponse(Type exceptionType, HttpStatusCode expectedStatus, string defaultMessage, string customMessage)
    {
        // Arrange
        var logger = new NullLogger<ErrorHandlingMiddleware>();
        var env = new TestHostEnvironment(); // Development mode
        var context = CreateHttpContext();

        var middleware = new ErrorHandlingMiddleware(async (innerContext) =>
        {

            if (exceptionType == typeof(AppException))
            {
                throw new AppException(customMessage);
            }
            else if (exceptionType == typeof(FileNotFoundException))
            {
                throw new FileNotFoundException(customMessage);
            }
            else if (exceptionType == typeof(InvalidOperationException))
            {
                throw new InvalidOperationException(customMessage);
            }
            else
            {
                throw (Exception)Activator.CreateInstance(exceptionType)!;
            }
        }, logger, env);

        // Act
        await middleware.InvokeAsync(context);

        // Assert status code
        Assert.Equal((int)expectedStatus, context.Response.StatusCode);

        // Assert response body
        context.Response.Body.Seek(0, System.IO.SeekOrigin.Begin);
        var reader = new System.IO.StreamReader(context.Response.Body, Encoding.UTF8);
        var json = await reader.ReadToEndAsync();

        var errorResponse = JsonSerializer.Deserialize<ErrorResponse>(json, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(errorResponse);
        Assert.Equal((int)expectedStatus, errorResponse!.Code);
        Assert.Equal(customMessage, errorResponse.Message);
        Assert.Equal(context.TraceIdentifier, errorResponse.TraceId);

        // Development mode should include exception detail
        Assert.NotNull(errorResponse.Detail);
        Assert.Contains(exceptionType.Name, errorResponse.Detail!);
        Assert.Contains(customMessage, errorResponse.Detail!);
    }
}
