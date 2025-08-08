using Xunit;

namespace SettlyApiTests;

public class SampleTests
{
    [Fact]
    public void Addition_Works()
    {
        int a = 2;
        int b = 2;
        int expected = 4;
        int result = a + b;
        Assert.Equal(expected, result);
    }
} 