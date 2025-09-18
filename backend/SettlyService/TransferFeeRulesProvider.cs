using Microsoft.Extensions.Configuration;
using SettlyModels.Entities;
using ISettlyService;

namespace SettlyService
{
    public class TransferFeeRulesProvider : ITransferFeeRulesProvider
    {
        private readonly IConfiguration _configuration;

        public TransferFeeRulesProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public TransferFeeRuleset? GetRuleset(string versionTag)
        {
            if (string.IsNullOrWhiteSpace(versionTag)) return null;

            var section = _configuration.GetSection($"TransferFeeRulesets:{versionTag}");
            if (!section.Exists()) return null;

            var rules = section.Get<TransferFeeRuleset>();
            if (rules != null && string.IsNullOrWhiteSpace(rules.VersionTag))
            {
                rules.VersionTag = versionTag;
            }

            return rules;
        }
    }
}
