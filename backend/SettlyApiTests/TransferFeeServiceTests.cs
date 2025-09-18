using Xunit;
using SettlyModels.Entities;
using SettlyModels.Dtos;
using ISettlyService;
using SettlyService;

namespace SettlyApiTests
{
    public class TransferFeeServiceTests
    {
        private ITransferFeeService CreateServiceWithRules(TransferFeeRuleset ruleset)
        {
            var provider = new FakeRulesProvider(ruleset);
            return new TransferFeeService(provider);
        }

        [Theory]
        [InlineData(10, 112)]
        [InlineData(770000, 1914)]
        [InlineData(990000, 2429)]
        [InlineData(1499999, 3621)]
        [InlineData(1500000, 3621)]
        public void CalculateFee_ReturnsExpected(decimal dutiableValue, decimal expected)
        {
            var ruleset = new TransferFeeRuleset
            {
                BaseFixed = 111.80m,
                Per1000 = 103m / 44m,
                Cap = 3621.00m,
                PerTitle = 0m,
                VersionTag = "vic_transfer_2025_26_paper"
            };

            var svc = CreateServiceWithRules(ruleset);
            var request = new TransferFeeRequestDto { DutiableValue = dutiableValue };
            var resp = svc.CalculateFee(request, ruleset.VersionTag);

            Assert.Equal(expected, resp.FinalFee);
        }

        private class FakeRulesProvider : ITransferFeeRulesProvider
        {
            private readonly TransferFeeRuleset _ruleset;
            public FakeRulesProvider(TransferFeeRuleset ruleset) => _ruleset = ruleset;
            public TransferFeeRuleset? GetRuleset(string versionTag) => _ruleset;
        }
    }
}
