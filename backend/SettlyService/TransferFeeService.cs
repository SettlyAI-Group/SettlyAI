using System;
using SettlyModels.Dtos;
using ISettlyService;
using SettlyModels.Exceptions;

namespace SettlyService
{
    public class TransferFeeService : ITransferFeeService
    {
        private readonly ITransferFeeRulesProvider _rulesProvider;

        public TransferFeeService(ITransferFeeRulesProvider rulesProvider)
        {
            _rulesProvider = rulesProvider;
        }

        public TransferFeeResponseDto CalculateFee(TransferFeeRequestDto request)
        {
            if (request == null) throw new ArgumentException("request required");
            if (request.DutiableValue <= 0) throw new ArgumentException("dutiableValue must be greater than 0");
            if (request.TitlesCount < 1) throw new ArgumentException("titlesCount must be >= 1");

            var rules = _rulesProvider.GetRuleset(request.VersionTag);
            if (rules == null) throw new RulesetNotFoundException(request.VersionTag);

            decimal feeRaw;
            decimal feeCapped;
            decimal feeStatutory;
            int thousands;

            if (request.DutiableValue < 1000m)
            {
                // for dutiableValue < 1000, fee is just baseFixed
                thousands = 0;
                feeRaw = rules.BaseFixed;
                feeCapped = feeRaw;
                feeStatutory = rules.BaseFixed;
            }
            else
            {
                // feeRaw = baseFixed + per1000 * thousands
                thousands = (int)Math.Floor(request.DutiableValue / 1000m);
                feeRaw = rules.BaseFixed + (rules.Per1000 * thousands);

                // apply cap
                feeCapped = Math.Min(feeRaw, rules.Cap);

                // round only at the end to nearest whole dollar
                feeStatutory = Math.Ceiling(feeCapped);
            }

            return new TransferFeeResponseDto
            {
                VersionTag = rules.VersionTag,
                DutiableValue = request.DutiableValue,
                TitlesCount = request.TitlesCount,
                Thousands = thousands,
                FeeBeforeCap = feeRaw,
                Cap = rules.Cap,
                FeeStatutory = feeStatutory
            };
        }
    }
}
