using ISettlyService;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace SettlyService;

public class PdfService : IPdfService
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
}