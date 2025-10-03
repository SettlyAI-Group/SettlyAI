using ISettlyService;
using SettlyModels.Dtos;
using System.Collections.Generic;

namespace SettlyService
{
    public class ProjectionService : IProjectionService
    {
        private const decimal GrowthRate = 0.07m; // 7% annual growth

        public List<ProjectionPointDto> ProjectWithoutFhss(SuperEstimateRequestDto request)
        {
            return RunProjection(request, null);
        }

        public List<ProjectionPointDto> ProjectWithFhss(SuperEstimateRequestDto request, decimal fhssAmount)
        {
            return RunProjection(request, fhssAmount);
        }

        private List<ProjectionPointDto> RunProjection(SuperEstimateRequestDto request, decimal? fhssAmount)
        {
            var results = new List<ProjectionPointDto>();

            decimal balance = request.Balance;
            decimal annualContribution = request.AnnualIncome * (request.ContributionRate / 100);

            int years = request.TargetAge - request.Age;

            // Apply FHSS deduction at year 0 if applicable
            if (fhssAmount.HasValue && fhssAmount.Value > 0)
            {
                balance -= fhssAmount.Value;
            }

            // Year 0
            results.Add(new ProjectionPointDto { Age = request.Age, Balance = balance });

            // Future years
            int age = request.Age;
            for (int i = 1; i <= years; i++)
            {
                balance = (balance + annualContribution) * (1 + GrowthRate);
                results.Add(new ProjectionPointDto { Age = age + i, Balance = balance });
            }

            return results;
        }
    }
}
