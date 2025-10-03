using System;
using SettlyFinance.Calculators;
using SettlyFinance.Enums;
using Xunit;

namespace SettlyFinance.Tests.Calculators
{
    public class FrequencyProviderTests
    {
        private readonly FrequencyProvider _provider = new FrequencyProvider();
        [Theory]
        [InlineData(RepaymentFrequency.Monthly, 12)]
        [InlineData(RepaymentFrequency.Fortnightly, 26)]
        [InlineData(RepaymentFrequency.Weekly, 52)]
        public void GetPeriodsPerYear_WithValidFrequency_ShouldReturnCorrectPeriods(RepaymentFrequency freq, int expected)
        {
            var periods = _provider.GetPeriodsPerYear(freq);
            Assert.Equal(expected, periods);
        }
        [Fact]
        public void GetPeriodsPerYear_WithUndefinedEnumValue_ShouldThrowArgumentOutOfRangeException()
        {
            // Arrange: Create an invalid enum value that is not defined in the RepaymentFrequency enum.
            var invalidFrequency = (RepaymentFrequency)999;
            // Act & Assert: Verify that calling the method with this invalid value throws the correct exception.
            var exception = Assert.Throws<ArgumentOutOfRangeException>(() => _provider.GetPeriodsPerYear(invalidFrequency));
            // Verify the exception message for more specific testing.
            Assert.Contains("Unsupported repayment frequency", exception.Message);
        }
    }
}
