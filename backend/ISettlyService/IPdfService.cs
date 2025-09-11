using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ISettlyService
{
    public interface IPdfService
    {
        byte[] GenerateSuburbReport(suburbReportData);
        //byte[] GenerateFinancialReport(object financialData);
    }
}
