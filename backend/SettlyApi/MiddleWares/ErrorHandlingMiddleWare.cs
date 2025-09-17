using System.Net;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using SettlyModels;

namespace SettlyApi.Middlewares;

/// <summary>
/// Middleware that catches all unhandled exceptions,
/// logs them, and returns a standardized error response.
/// </summary>
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            // Continue to the next middleware in the pipeline
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");
            await HandleExceptionAsync(context, ex, _env);
        }
    }

    private static readonly Dictionary<Type, (HttpStatusCode Status, string DefaultMessage)> ExceptionMap =
        new()
        {
        { typeof(AppException), (HttpStatusCode.BadRequest, "Business exception") },
        { typeof(ArgumentException), (HttpStatusCode.BadRequest, "Invalid argument provided.") },
        { typeof(ArgumentNullException), (HttpStatusCode.BadRequest, "Required parameter is missing.") },
        { typeof(FormatException), (HttpStatusCode.BadRequest, "Invalid data format.") },
        { typeof(KeyNotFoundException), (HttpStatusCode.NotFound, "The requested resource was not found.") },
        { typeof(FileNotFoundException), (HttpStatusCode.NotFound, "File not found.") },
        { typeof(UnauthorizedAccessException), (HttpStatusCode.Unauthorized, "Unauthorized access.") },
        { typeof(InvalidOperationException), (HttpStatusCode.Conflict, "Operation is invalid in the current state.") },
        { typeof(TimeoutException), (HttpStatusCode.RequestTimeout, "The request timed out.") },
        { typeof(NotImplementedException), (HttpStatusCode.NotImplemented, "Feature not implemented.") },
        { typeof(NotSupportedException), (HttpStatusCode.MethodNotAllowed, "Operation not supported.") },
        { typeof(IOException), (HttpStatusCode.InternalServerError, "Server error.") },
        { typeof(DbUpdateException), (HttpStatusCode.InternalServerError, "Database update failed.") }
        };

    private static Task HandleExceptionAsync(HttpContext context, Exception ex, IHostEnvironment env)
    {
        HttpStatusCode status = HttpStatusCode.InternalServerError;
        string message = "An unexpected error occurred.";

        if (ex is AppException appEx)
        {
            status = (HttpStatusCode)appEx.StatusCode;
            message = appEx.Message;
        }
        else if (ExceptionMap.TryGetValue(ex.GetType(), out var map))
        {
            status = map.Status;
            message = string.IsNullOrWhiteSpace(ex.Message) ? map.DefaultMessage : ex.Message;
        }
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        var errorResponse = new ErrorResponse
        {
            Code = context.Response.StatusCode,
            Message = message,
            Detail = env.IsDevelopment() ? ex.ToString() : null,
            TraceId = context.TraceIdentifier
        };

        var result = JsonSerializer.Serialize(errorResponse);
        return context.Response.WriteAsync(result);
    }

}
