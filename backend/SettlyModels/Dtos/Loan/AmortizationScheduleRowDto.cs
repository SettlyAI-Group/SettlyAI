using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SettlyModels.DTOs.Loan
{
    public sealed record AmortizationScheduleRowDto(
     int Period,
     decimal Payment,
     decimal Interest,
     decimal Principal,
     decimal EndingBalance
 );
}
