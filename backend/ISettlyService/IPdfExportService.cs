using SettlyModels.Dtos.Export;
namespace ISettlyService;

public interface IPdfExportService
{
    byte[] GenerateSuburbReport(SuburbReportPdfRequest request);
}