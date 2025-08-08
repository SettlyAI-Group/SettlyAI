
namespace SettlyModels.DTOs
{
  public class FooterResponseDto
  {
    public CompanyInfoDto CompanyInfo { get; set; } = new();
    public List<LinkGroupDto> LinkGroups { get; set; } = new();
    public List<SocialMediaLinkDto> SocialMediaLinks { get; set; } = new();
    public string Copyright { get; set; } = string.Empty;
  }

  /// <summary>
  /// company info data transfer object
  /// </summary>
  public class CompanyInfoDto
  {
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
  }

  /// <summary>
  /// Link group data transfer object
  /// </summary>
  public class LinkGroupDto
  {
    public string Title { get; set; } = string.Empty;
    public List<FooterLinkDto> Links { get; set; } = new();
  }

  /// <summary>
  /// Footer link data transfer object
  /// </summary>
  public class FooterLinkDto
  {
    public string Text { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public bool OpenInNewTab { get; set; } = false;
  }

  /// <summary>
  /// Social media link data transfer object
  /// </summary>
  public class SocialMediaLinkDto
  {
    public string Platform { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string? IconClass { get; set; }
  }

  public class ApiResponse<T>
  {
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public List<string> Errors { get; set; } = new();
    public T? Data { get; set; }

    /// <summary>
    /// Create a successful response with data
    /// </summary>
    public static ApiResponse<T> Ok(T data, string message = "") => new()
    {
      Success = true,
      Data = data,
      Message = message,
      Timestamp = DateTime.UtcNow
    };

    /// <summary>
    /// Create a failure response
    /// </summary>
    public static ApiResponse<T> Failure(string message) => new()
    {
      Success = false,
      Message = message,
      Timestamp = DateTime.UtcNow
    };

    /// <summary>
    /// Create a validation failure response
    /// </summary>
    public static ApiResponse<T> ValidationFailure(List<string> errors) => new()
    {
      Success = false,
      Message = "Validation failed",
      Errors = errors,
      Timestamp = DateTime.UtcNow
    };
  }
}

