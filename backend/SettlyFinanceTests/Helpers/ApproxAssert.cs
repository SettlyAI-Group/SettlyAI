using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SettlyFinanceTests.Helpers
{
    internal static class ApproxAssert
    {
        public static void Equal(decimal expected, decimal actual, decimal tol = 0.05m)
           => Xunit.Assert.InRange(actual, expected - tol, expected + tol);
    }
}
