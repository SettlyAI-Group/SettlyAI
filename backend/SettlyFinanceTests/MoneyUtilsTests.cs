using Xunit;
using SettlyFinance.Utils;
namespace SettlyFinanceTests
{
    public class MoneyUtilsTests
    {
        [Fact]
        public void ToCents_ShouldRound_100_005_To_10001()
        {
            var result = MoneyUtils.ToCents(100.005m);
            Assert.Equal(10001, result); // 100.01 元
        }

        [Fact]
        public void FromCents_ShouldConvert_10001_To_100_01()
        {
            var result = MoneyUtils.FromCents(10001);
            Assert.Equal(100.01m, result);
        }
        [Fact]
        public void RoundToCent_ShouldRound_12_345_To_12_35()
        {
            var result = MoneyUtils.RoundToCent(12.345m);
            Assert.Equal(12.35m, result);
        }
        [Fact]
        public void FixPrincipalPart_ShouldReturnRemaining_WhenIsLast()
        {
            var result = MoneyUtils.FixPrincipalPart(10000, 5000, true);
            Assert.Equal(10000, result);
        }
        [Fact]
        public void FixPrincipalPart_ShouldClamp_WhenNotLast()
        {
            var result = MoneyUtils.FixPrincipalPart(10000, 12000, false);
            Assert.Equal(10000, result);
        }
        [Fact]
        public void ReduceRemainingPrincipal_ShouldNotBeNegative()
        {
            var result = MoneyUtils.ReduceRemainingPrincipal(1000, 2000);
            Assert.Equal(0, result);
        }
    }
}
