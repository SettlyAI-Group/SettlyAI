using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SettlyModels.DTOs.Loan
{
    public sealed record PiecewiseRequestDto(
        decimal InitialLoanAmount,
        IReadOnlyList<PiecewiseSegmentDto> Segments,
        bool GenerateSchedule = true
    );
}
