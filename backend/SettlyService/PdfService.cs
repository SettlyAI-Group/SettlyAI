using QuestPDF.Fluent;
using QuestPDF.Helpers; 
using QuestPDF.Infrastructure;
using ISettlyService;
namespace SettlyService
{
    public class PdfService: IPdfService
    {
        public byte[] GenerateSampleReport()
        {
            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(30);
                    page.PageColor(Colors.White);
                    page.Header()
                    .Text("Hello PDF")
                    .SemiBold().FontSize(24).FontColor(Colors.Blue.Medium);
                    page.Content()
                    .PaddingVertical(10).Column(column =>
                    {
                        column.Spacing(15);
                        column.Item().Text("This is a sample PDF document.");
                        column.Item().Text("It demonstrates the use of the PDF generation library.");
                        column.Item().Text("You can customize it as needed.");
                    });
                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.Span("Page ");
                        x.CurrentPageNumber();
                        x.Span(" of ");
                        x.TotalPages();
                    });
                });
            });
            return document.GeneratePdf();
        }
    }
}
