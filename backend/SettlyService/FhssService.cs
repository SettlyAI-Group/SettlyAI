using ISettlyService;
using SettlyModels.Dtos;
using System;

namespace SettlyService
{
    public class FhssService : IFhssService
    {
        private const decimal FHSS_CAP = 50000m;

        public decimal? ProcessFhssAmount(SuperEstimateRequestDto request)
        {

            if (!request.FhssSelected || request.FhssAmount == null)
            {
                return null;
            }

            decimal amount = request.FhssAmount.Value;

            if (amount < 0)
            {
                throw new ArgumentException("FHSS amount cannot be negative.");
            }

            if (amount > FHSS_CAP)
            {
                throw new ArgumentException($"FHSS amount cannot exceed {FHSS_CAP}.");
            }

            if (amount > request.Balance)
            {
                amount = request.Balance;
            }

            return amount;
        }
    }
}
