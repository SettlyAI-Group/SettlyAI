using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace SettlyModels.Validation;

[AttributeUsage(AttributeTargets.Property)]
public class ValidPasswordAttribute : ValidationAttribute
{
    private const int MinLength = 8;
    private const int MaxLength = 100;

    protected override ValidationResult? IsValid(object? value, ValidationContext context)
    {
        if (value is not string password)
            return new ValidationResult("Password is required.");

        if (password.Length < MinLength || password.Length > MaxLength)
            return new ValidationResult($"Password must be between {MinLength} and {MaxLength} characters.");

        if (!Regex.IsMatch(password, @"[A-Z]"))
            return new ValidationResult("Password must include at least one uppercase letter.");

        if (!Regex.IsMatch(password, @"[a-z]"))
            return new ValidationResult("Password must include at least one lowercase letter.");

        if (!Regex.IsMatch(password, @"\d"))
            return new ValidationResult("Password must include at least one number.");

        if (!Regex.IsMatch(password, @"[\W_]"))
            return new ValidationResult("Password must include at least one special character.");

        return ValidationResult.Success;
    }
}
