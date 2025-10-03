using ISettlyService;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using SettlyModels.Dtos.Export;

namespace SettlyService;

public class PdfService : IPdfExportService
{
    public PdfService()
    {
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public byte[] GenerateSampleReport()
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(12));

                page.Header()
                    .Text("Hello PDF")
                    .SemiBold()
                    .FontSize(36)
                    .FontColor(Colors.Blue.Medium);

                page.Content()
                    .PaddingVertical(1, Unit.Centimetre)
                    .Column(column =>
                    {
                        column.Spacing(10);
                                        
                        column.Item().Text("This is a sample PDF document.");
                        column.Item().Text("This demonstrates the use of the PDF generation library.");
                        column.Item().Text("You can customize this content as needed.");

                        column.Item().PaddingTop(20).Text($"Generated at: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC")
                            .FontSize(10)
                            .FontColor(Colors.Grey.Medium);
                    });

                page.Footer()
                    .AlignCenter()
                    .Text(x =>
                    {
                        x.Span("Page ").FontSize(10);
                        x.CurrentPageNumber().FontSize(10);
                        x.Span(" of ").FontSize(10);
                        x.TotalPages().FontSize(10);
                    });
            });
        });

        return document.GeneratePdf();
    }

    public async Task<byte[]> GenerateSuburbReportAsync(SuburbReportPdfRequest request, CancellationToken cancellationToken = default)
    { 
        return await Task.Run(() =>
    { 
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(2, Unit.Centimetre);
                page.PageColor(Colors.White);
                page.DefaultTextStyle(x => x.FontSize(12));

                // Header
                page.Header()
                    .Column(column =>
                    {
                        column.Item().Text($"{request.SuburbName}, {request.State} {request.Postcode}")
                            .SemiBold()
                            .FontSize(24)
                            .FontColor(Colors.Blue.Medium);

                        column.Item().PaddingTop(10).Text("Suburb Report")
                            .SemiBold()
                            .FontSize(18)
                            .FontColor(Colors.Grey.Medium);
                    });

                // Content
                page.Content()
                    .PaddingVertical(1, Unit.Centimetre)
                    .Column(column =>
                    {
                        column.Spacing(20);

                        // Income & Employment Section
                        if (request.IncomeEmployment != null)
                        {
                            column.Item().Text("Income & Employment")
                                .SemiBold()
                                .FontSize(14)
                                .FontColor(Colors.Blue.Medium);

                            column.Item().PaddingLeft(10).Column(subColumn =>
                            {
                                subColumn.Item().Row(row =>
                                {
                                    row.RelativeItem().Text($"Median Income: ${request.IncomeEmployment.MedianIncome:N0}");
                                    row.RelativeItem().Text($"Employment Rate: {request.IncomeEmployment.EmploymentRate:P1}");
                                });
                                subColumn.Item().Row(row =>
                                {
                                    row.RelativeItem().Text($"White Collar Ratio: {request.IncomeEmployment.WhiteCollarRatio:P1}");
                                    row.RelativeItem().Text($"Job Growth Rate: {request.IncomeEmployment.JobGrowthRate:P1}");
                                });
                            });
                        }

                        // Property Market Section
                        if (request.HousingMarket != null)
                        {
                            column.Item().PaddingTop(10).Text("Property Market Insights")
                                .SemiBold()
                                .FontSize(14)
                                .FontColor(Colors.Blue.Medium);

                            column.Item().PaddingLeft(10).Column(subColumn =>
                            {
                                subColumn.Item().Row(row =>
                                {
                                    row.RelativeItem().Text($"Median Price: ${request.HousingMarket.MedianPrice:N0}");
                                    row.RelativeItem().Text($"Rental Yield: {request.HousingMarket.RentalYield:P2}");
                                });
                                subColumn.Item().Row(row =>
                                {
                                    row.RelativeItem().Text($"Price Growth (3Yr): {request.HousingMarket.PriceGrowth3Yr:P1}");
                                    row.RelativeItem().Text($"Days on Market: {request.HousingMarket.DaysOnMarket}");
                                });
                                subColumn.Item().Row(row =>
                                {
                                    row.RelativeItem().Text($"Clearance Rate: {request.HousingMarket.ClearanceRate:P1}");
                                    row.RelativeItem().Text($"Vacancy Rate: {request.HousingMarket.VacancyRate:P1}");
                                });
                            });
                        }

                        // Livability Section
                        if (request.Livability != null)
                        {
                            column.Item().PaddingTop(10).Text("Livability")
                                .SemiBold()
                                .FontSize(14)
                                .FontColor(Colors.Blue.Medium);

                            column.Item().PaddingLeft(10).Column(subColumn =>
                            {
                                subColumn.Item().Row(row =>
                                {
                                    row.RelativeItem().Text($"Transport Score: {request.Livability.TransportScore:F1}");
                                    row.RelativeItem().Text($"Primary School Rating: {request.Livability.PrimarySchoolRating:F1}");
                                });
                                subColumn.Item().Row(row =>
                                {
                                    row.RelativeItem().Text($"Secondary School Rating: {request.Livability.SecondarySchoolRating:F1}");
                                    row.RelativeItem().Text($"Hospital Density: {request.Livability.HospitalDensity:F2}");
                                });
                                subColumn.Item().Row(row =>
                                {
                                    row.RelativeItem().Text($"Supermarkets: {request.Livability.SupermarketQuantity}");
                                    row.RelativeItem().Text($"Hospitals: {request.Livability.HospitalQuantity}");
                                });
                            });
                        }

                        // Safety Scores Section
                        if (request.SafetyScores != null && request.SafetyScores.Any())
                        {
                            column.Item().PaddingTop(10).Text("Safety Scores")
                                .SemiBold()
                                .FontSize(14)
                                .FontColor(Colors.Blue.Medium);

                            column.Item().PaddingLeft(10).Column(subColumn =>
                            {
                                foreach (var score in request.SafetyScores)
                                {
                                    subColumn.Item().Row(row =>
                                    {
                                        row.RelativeItem().Text($"{score.Title}: {score.Value:F1}/{score.MaxValue:F1}");
                                        if (!string.IsNullOrEmpty(score.LevelText))
                                        {
                                            row.RelativeItem().Text(score.LevelText)
                                                .FontColor(Colors.Grey.Medium);
                                        }
                                    });
                                }
                            });
                        }

                        // Footer content
                        column.Item().PaddingTop(20).Text($"Generated: {request.GeneratedAtUtc:yyyy-MM-dd HH:mm} UTC")
                            .FontSize(10)
                            .FontColor(Colors.Grey.Medium);
                    });

                // Footer
                page.Footer()
                    .AlignCenter()
                    .Text(x =>
                    {
                        x.Span("Page ").FontSize(10);
                        x.CurrentPageNumber().FontSize(10);
                        x.Span(" of ").FontSize(10);
                        x.TotalPages().FontSize(10);
                    });
            });
        });
        return document.GeneratePdf();
    }, cancellationToken);
    }
}