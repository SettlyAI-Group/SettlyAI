using System.Text.Json;
using SettlyModels.Entities;
using ISettlyService;

namespace SettlyService
{
    public class TransferFeeRulesProvider : ITransferFeeRulesProvider
    {
        private readonly string _rulesPath;

        public TransferFeeRulesProvider()
        {
            _rulesPath = Path.Combine(AppContext.BaseDirectory, "Data", "TransferFeeRulesets");
        }

        public TransferFeeRuleset? GetRuleset(string versionTag)
        {
            if (string.IsNullOrWhiteSpace(versionTag)) return null;

            var filePath = Path.Combine(_rulesPath, $"{versionTag}.json");
            if (!File.Exists(filePath)) return null;

            var json = File.ReadAllText(filePath);
            return JsonSerializer.Deserialize<TransferFeeRuleset>(json);
        }
    }
}
