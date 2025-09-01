namespace SettlyModels
{
    public class AppException : Exception
    {
        public int StatusCode { get; }

        /// <summary>
        /// Initializes a new AppException with a message and optional HTTP status code (default 400).
        /// </summary>
        public AppException(string message, int statusCode = 400) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}

