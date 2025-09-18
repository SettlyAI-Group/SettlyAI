using System;
using SettlyModels.Dtos;
using ISettlyService;

namespace SettlyService
{
    public class TransferFeeService : ITransferFeeService
    {
        private readonly ITransferFeeRulesProvider _rulesProvider;

        public TransferFeeService(ITransferFeeRulesProvider rulesProvider)
        {
            _rulesProvider = rulesProvider;
        }

        public TransferFeeResponseDto CalculateFee(TransferFeeRequestDto request, string versionTag)
        {
            if (request == null) throw new ArgumentException("request required");
            if (request.DutiableValue <= 0) throw new ArgumentException("dutiableValue must be greater than 0");
            if (request.TitlesCount < 1) throw new ArgumentException("titlesCount must be >= 1");

            var rules = _rulesProvider.GetRuleset(versionTag);
            if (rules == null) throw new InvalidOperationException("ruleset not available");

            // thousands = floor(dutiableValue / 1000)
            var thousandsDecimal = Math.Floor(request.DutiableValue / 1000m);
            var thousands = (long)thousandsDecimal;

            // feeRaw = baseFixed + per1000 * thousands
            decimal feeRaw = rules.BaseFixed + rules.Per1000 * thousands;

            // apply cap
            decimal feeCapped = Math.Min(feeRaw, rules.Cap);

            // round only at the end to nearest whole dollar
            decimal finalFee = Math.Round(feeCapped, 0, MidpointRounding.AwayFromZero);

            return new TransferFeeResponseDto
            {
                VersionTag = rules.VersionTag,
                DutiableValue = request.DutiableValue,
                TitlesCount = request.TitlesCount,
                Thousands = thousands,
                FeeBeforeCap = feeRaw,
                Cap = rules.Cap,
                FinalFee = finalFee
            };
        }
    }
}
