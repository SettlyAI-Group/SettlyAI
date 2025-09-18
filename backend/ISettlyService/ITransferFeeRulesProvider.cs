using SettlyModels.Entities;

namespace ISettlyService
{
    public interface ITransferFeeRulesProvider
    {
        TransferFeeRuleset? GetRuleset(string versionTag);
    }
}
