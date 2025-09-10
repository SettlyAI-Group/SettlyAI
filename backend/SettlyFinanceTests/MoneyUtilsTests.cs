using System;
using Xunit;
using SettlyFinance.Utils;

public class MoneyUtilsTests
{
    // --- conversion & rounding ---
    [Fact]
    public void ToCents_Rounds_100_005_To_10001()
        => Assert.Equal(10001L, MoneyUtils.ToCents(100.005m));

    [Fact]
    public void FromCents_10001_To_100_01()
        => Assert.Equal(100.01m, MoneyUtils.FromCents(10001));

    [Fact]
    public void RoundToCent_12_345_To_12_35()
        => Assert.Equal(12.35m, MoneyUtils.RoundToCent(12.345m));

    [Fact]
    public void RoundToCent_12_344_To_12_34()
        => Assert.Equal(12.34m, MoneyUtils.RoundToCent(12.344m));

    // --- FixPrincipalPart ---
    [Fact]
    public void FixPrincipalPart_Throws_WhenRemainingNegative()
        => Assert.Throws<ArgumentOutOfRangeException>(() =>
            MoneyUtils.FixPrincipalPart(-1, 100, false));

    [Fact]
    public void FixPrincipalPart_LastInstallment_ConsumesRemaining()
    {
        Assert.Equal(10_000, MoneyUtils.FixPrincipalPart(10_000, 500, true));
        Assert.Equal(10_000, MoneyUtils.FixPrincipalPart(10_000, -500, true));
        Assert.Equal(10_000, MoneyUtils.FixPrincipalPart(10_000, 20_000, true));
    }

    [Fact]
    public void FixPrincipalPart_Clamps_Negative_To_Zero()
        => Assert.Equal(0, MoneyUtils.FixPrincipalPart(10_000, -500, false));

    [Fact]
    public void FixPrincipalPart_Clamps_Over_To_Remaining()
        => Assert.Equal(10_000, MoneyUtils.FixPrincipalPart(10_000, 20_000, false));

    [Fact]
    public void FixPrincipalPart_WithinRange_Returns_Suggested()
        => Assert.Equal(3_000, MoneyUtils.FixPrincipalPart(10_000, 3_000, false));

    // --- ReduceRemainingPrincipal ---
    [Fact]
    public void ReduceRemainingPrincipal_Throws_WhenRemainingNegative()
        => Assert.Throws<ArgumentOutOfRangeException>(() =>
            MoneyUtils.ReduceRemainingPrincipal(-1, 100));

    [Fact]
    public void ReduceRemainingPrincipal_Ignores_Negative_Principal()
        => Assert.Equal(10_000, MoneyUtils.ReduceRemainingPrincipal(10_000, -500));

    [Fact]
    public void ReduceRemainingPrincipal_Reduces_WhenWithinRange()
        => Assert.Equal(7_000, MoneyUtils.ReduceRemainingPrincipal(10_000, 3_000));

    [Fact]
    public void ReduceRemainingPrincipal_Zeroes_WhenOverpay()
        => Assert.Equal(0, MoneyUtils.ReduceRemainingPrincipal(10_000, 20_000));

    // --- end-to-end guard ---
    [Fact]
    public void EndToEnd_LastInstallment_Clears_To_Zero()
    {
        long remaining = 1_00; // $1.00
        long principal = MoneyUtils.FixPrincipalPart(remaining, 50, true);
        long next = MoneyUtils.ReduceRemainingPrincipal(remaining, principal);
        Assert.Equal(remaining, principal);
        Assert.Equal(0, next);
    }
}
