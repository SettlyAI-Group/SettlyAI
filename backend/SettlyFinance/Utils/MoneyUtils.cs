using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SettlyFinance.Utils
{
    public static class MoneyUtils
    {
        // 元 → 分（整数），保证精度，避免小数误差
        public static long ToCents(decimal amount) =>
            (long)Math.Round(amount * 100m, 0, MidpointRounding.AwayFromZero);
        //分 → 元（带小数），给前端/API 展示
        public static decimal FromCents(long cents) =>
            cents / 100m;
        //把金额四舍五入到 2 位小数（分）
        public static decimal RoundToCent(decimal amount) =>
            Math.Round(amount, 2, MidpointRounding.AwayFromZero);
        //尾差修正：最后一期本金必须直接等于剩余本金，确保贷款归零
        public static long FixPrincipalPart(long remainingPrincipalCents, long suggestedPrincipalPart, bool isLastInstallment)
        {
            if(!isLastInstallment)
                return Math.Min(suggestedPrincipalPart, remainingPrincipalCents);
            return remainingPrincipalCents;
        }
        //更新剩余本金，保证不为负数
        public static long ReduceRemainingPrincipal(long remainingPrincipalCents, long principalCents)
        {
            var next = remainingPrincipalCents - principalCents;
            return next < 0 ? 0 : next;
        }
    }
}
