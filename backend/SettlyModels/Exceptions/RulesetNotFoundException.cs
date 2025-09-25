using System;

namespace SettlyModels.Exceptions
{
    // Exception thrown when a requested Transfer Fee ruleset is not found.
    public class RulesetNotFoundException : Exception
    {
        public string RequestedVersionTag { get; }

        public RulesetNotFoundException(string versionTag)
            : base($"Ruleset not available for versionTag '{versionTag}'")
        {
            RequestedVersionTag = versionTag;
        }
    }
}
