using SettlyModels.Dtos.Export;
namespace ISettlyService;

public interface IPdfExportService
{
    byte[] GenerateSampleReport();
    byte[] GenerateSuburbReport(SuburbReportPdfRequest request);
}