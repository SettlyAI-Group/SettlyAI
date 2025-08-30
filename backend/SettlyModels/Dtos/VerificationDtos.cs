using SettlyModels.Enums;

namespace SettlyModels.Dtos;

public sealed class VerifyCodeDto
{
    public int UserId { get; set; }
    public string Code { get; set; } = default!;
    public VerificationType VerificationType { get; set; }
}
