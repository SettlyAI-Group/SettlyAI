namespace SettlyModels
{
    public class ErrorResponse
    {
        public int Code { get; set; }


        public string Message { get; set; } = string.Empty;

        // Optional: Detailed error description (only shown in Development).
        public string? Detail { get; set; }

        // Trace identifier for correlation and debugging.
        public string? TraceId { get; set; }

        //  Model validation errors (field-level error messages).
        public Dictionary<string, string[]>? Errors { get; set; }
    }
}
