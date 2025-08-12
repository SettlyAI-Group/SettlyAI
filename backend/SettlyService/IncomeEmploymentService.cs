using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;

namespace SettlyService
{
    public class IncomeEmploymentService : IIncomeEmploymentService
    {
        private readonly SettlyDbContext _context;

        public IncomeEmploymentService(SettlyDbContext context)
        {
            _context = context;
        }

        public async Task<IncomeEmploymentDto> GetIncomeEmploymentDataAsync(int suburbId)
        {
            var incomeEmploymentData = await _context.IncomeEmployments
                .Where(i => i.SuburbId == suburbId)
                .OrderByDescending(i => i.SnapshotDate)
                .FirstOrDefaultAsync();

            if (incomeEmploymentData == null)
                throw new Exception("No income employment data found.");

            var incomeEmploymentDto = new IncomeEmploymentDto
            {
                SuburbId = suburbId,
                MedianIncome = incomeEmploymentData.MedianIncome,
                EmploymentRate = incomeEmploymentData.EmploymentRate,
                WhiteCollarRatio = incomeEmploymentData.WhiteCollarRatio,
                JobGrowthRate = incomeEmploymentData.JobGrowthRate
            };

            return incomeEmploymentDto;
        }
    }
}
