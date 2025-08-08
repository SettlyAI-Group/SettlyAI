namespace SettlyModels
{
    public class JWTConfig
    {
        public const string Section = "JWTConfig";
        public string SecretKey { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }

        public int ExpireSeconds { get; set; }
    }
}
