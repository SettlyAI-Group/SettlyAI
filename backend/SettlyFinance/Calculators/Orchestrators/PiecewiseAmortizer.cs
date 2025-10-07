using System;
using System.Collections.Generic;
using System.Linq;
using SettlyFinance.Interfaces;
using SettlyFinance.Models;
using SettlyFinance.Enums;
using SettlyFinance.Utils;

namespace SettlyFinance.Calculators.Orchestrators
{
    /// <summary>
    /// Orchestrates mixed IO/PNI segments. Each segment starts with the
    /// previous segment's ending balance as its principal (loan amount).
    /// </summary>
    public sealed class PiecewiseAmortizer : IPiecewiseAmortizer
    {
        private readonly IAmortizationEngineFactory _factory;

        public PiecewiseAmortizer(IAmortizationEngineFactory factory)
            => _factory = factory ?? throw new ArgumentNullException(nameof(factory));

        public PiecewiseResult Calculate(PiecewiseInput input)
        {
            if (input.InitialLoanAmount <= 0m)
                throw new ArgumentOutOfRangeException(nameof(input.InitialLoanAmount), "Initial loan must be positive.");
            if (input.Segments is null || input.Segments.Count == 0)
                throw new ArgumentException("At least one segment is required.", nameof(input.Segments));

            // 总期数（所有段期数相加）与“剩余总摊销期数”
            int totalPeriods = checked(input.Segments.Sum(s => s.TermPeriods));
            int remainingTotalPeriods = totalPeriods;

            bool generateSchedule = input.GenerateSchedule;

            // 逐期 schedule（按你原有 PiecewiseScheduleRow 结构）
            List<PiecewiseScheduleRow>? periodRows = generateSchedule ? new(totalPeriods) : null;

            decimal currentPrincipal = input.InitialLoanAmount;
            decimal totalInterest = 0m;
            decimal totalPrincipal = 0m;
            int globalPeriod = 0;

            decimal firstSegmentPayment = 0m; // 一定取“第一个【段】”的期供（首段为 IO 就是 IO 的期供）

            for (int i = 0; i < input.Segments.Count; i++)
            {
                var seg = input.Segments[i];
                int segPeriods = seg.TermPeriods;
                if (segPeriods <= 0)
                    throw new ArgumentOutOfRangeException(nameof(seg.TermPeriods), "Segment term periods must be positive.");

                if (seg.RepaymentType == RepaymentType.PrincipalAndInterest)
                {
                    // ★ 修复点：PNI 段的期供按“剩余总摊销期数”计算，但只推进本段 segPeriods 期
                    var pniInput = new AmortizationInput(
                        LoanAmount: currentPrincipal,
                        AnnualInterestRate: seg.AnnualInterestRate,
                        TermPeriods: remainingTotalPeriods,
                        Frequency: seg.Frequency,
                        RepaymentType: RepaymentType.PrincipalAndInterest,
                        GenerateSchedule: true // 生成完整表，稍后只截取本段长度
                    );

                    var pniEngine = _factory.GetEngine(RepaymentType.PrincipalAndInterest);
                    var full = pniEngine.Calculate(pniInput);

                    // 首段的期供：如果首段就是 PNI，这里记录；若首段是 IO，会在 IO 分支记录
                    if (i == 0)
                        firstSegmentPayment = full.Payment;

                    if (full.Schedule is null || full.Schedule.Count < segPeriods)
                        throw new InvalidOperationException("PNI engine did not return enough schedule rows.");

                    decimal segInterest = 0m;
                    decimal segPrincipalPaid = 0m;

                    if (generateSchedule)
                    {
                        for (int k = 0; k < segPeriods; k++)
                        {
                            var row = full.Schedule[k];
                            segInterest += row.Interest;
                            segPrincipalPaid += row.Principal;
                            currentPrincipal = row.EndingBalance;

                            periodRows!.Add(new PiecewiseScheduleRow(
                                GlobalPeriod: ++globalPeriod,
                                SegmentIndex: i,
                                SegmentPeriod: k + 1,
                                Payment: row.Payment,
                                Interest: row.Interest,
                                Principal: row.Principal,
                                EndingBalance: row.EndingBalance,
                                SegmentLabel: seg.Label
                            ));
                        }
                    }
                    else
                    {
                        // 不生成逐期明细，也要推进余额与累计总期数/利息/本金
                        for (int k = 0; k < segPeriods; k++)
                        {
                            var row = full.Schedule[k];
                            segInterest += row.Interest;
                            segPrincipalPaid += row.Principal;
                            currentPrincipal = row.EndingBalance;
                        }
                        globalPeriod += segPeriods; // 关键：不开表也要累计
                    }

                    totalInterest += segInterest;
                    totalPrincipal += segPrincipalPaid;
                    remainingTotalPeriods -= segPeriods;
                }
                else if (seg.RepaymentType == RepaymentType.InterestOnly)
                {
                    // IO 段按“段长”计算
                    var ioInput = new AmortizationInput(
                        LoanAmount: currentPrincipal,
                        AnnualInterestRate: seg.AnnualInterestRate,
                        TermPeriods: segPeriods,
                        Frequency: seg.Frequency,
                        RepaymentType: RepaymentType.InterestOnly,
                        GenerateSchedule: generateSchedule
                    );

                    var ioEngine = _factory.GetEngine(RepaymentType.InterestOnly);
                    var io = ioEngine.Calculate(ioInput);

                    // 首段是 IO，则 firstSegmentPayment 就取 IO 的期供（每期利息）
                    if (i == 0)
                        firstSegmentPayment = io.Payment;

                    totalInterest += io.TotalInterest;
                    totalPrincipal += io.TotalPrincipal; // 通常 0
                    currentPrincipal = io.EndingBalance;

                    if (generateSchedule && io.Schedule is not null)
                    {
                        for (int k = 0; k < io.Schedule.Count; k++)
                        {
                            var row = io.Schedule[k];
                            periodRows!.Add(new PiecewiseScheduleRow(
                                GlobalPeriod: ++globalPeriod,
                                SegmentIndex: i,
                                SegmentPeriod: k + 1,
                                Payment: row.Payment,
                                Interest: row.Interest,
                                Principal: row.Principal,
                                EndingBalance: row.EndingBalance,
                                SegmentLabel: seg.Label
                            ));
                        }
                    }
                    else
                    {
                        globalPeriod += segPeriods; // 不开表也累计
                    }

                    remainingTotalPeriods -= segPeriods;
                }
                else
                {
                    throw new NotSupportedException($"Unsupported repayment type: {seg.RepaymentType}");
                }
            }

            var totalCost = Math.Round(totalPrincipal + totalInterest, 2);

            // ✅ 还原为“逐期”表（如果需要）；不再做“按年聚合”
            IReadOnlyList<PiecewiseScheduleRow>? finalSchedule = generateSchedule ? periodRows : null;

            return new PiecewiseResult(
                InitialLoanAmount: input.InitialLoanAmount,
                TotalPrincipal: Math.Round(totalPrincipal, 2),
                TotalInterest: Math.Round(totalInterest, 2),
                TotalCost: totalCost,
                TotalPeriods: globalPeriod,              // = sum(seg.TermPeriods)
                Schedule: finalSchedule,                 // 逐期 or null
                FirstSegmentPayment: Math.Round(firstSegmentPayment, 2)
            );
        }
    }
}
