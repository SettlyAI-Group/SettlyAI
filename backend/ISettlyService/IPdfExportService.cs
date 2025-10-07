using SettlyModels.Dtos.Export;
namespace ISettlyService;

public interface IPdfExportService
{
    Task<byte[]> GenerateSuburbReportAsync(SuburbReportPdfRequest request, CancellationToken cancellationToken = default);
}