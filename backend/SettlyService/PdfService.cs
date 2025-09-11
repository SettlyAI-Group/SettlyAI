using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace SettlyService
{
    public class PdfService
    {
        public byte[] GenerateSuburbReport(suburbReportData)
        {
            var document = Document.Create(Container =>
            {
                Container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(30);
                    page.PageColor(Color.White);
                    page.Header()
                    .Text("Suburb Report")
                    .SemiBold().FontSize(24).FontColor(SystemColors.Blue.Medium);
                    page.Content()
                    .PaddingVertical(10).Column(column =>
                    {
                        column.Spacing(15);
                        column.Item.Text("");
                        column.Item.Text("");
                        column.Item.Text("");
                    });
                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.Span("Page ");
                        x.CurrentPageNumber();
                        x.Span(" of ");
                        x.TotalPage();
                    });
                });
            });
            return document.GeneratePdf();
        }
    }
}
