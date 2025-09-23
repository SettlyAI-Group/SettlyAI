using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SettlyFinance.Models;

namespace SettlyModels.DTOs.Loan
{
    /// <summary>
    /// Wrapper for amortization calculation results.
    /// </summary>
    public sealed record AmortizationResponseDto(AmortizationResult Result);
    }
