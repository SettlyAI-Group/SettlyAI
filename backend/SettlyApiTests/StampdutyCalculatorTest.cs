using System;
using System.IO;
using System.Text.Json;
using SettlyModels.Dtos;
using System.Reflection;
using Xunit;
using SettlyService;
using Xunit.Abstractions;


public class StampDutyCalculatorTests
{
    private readonly StampDutyCalculator _calculator;
    private readonly ITestOutputHelper _output;

    public StampDutyCalculatorTests(ITestOutputHelper output)
    {
        _output = output;
        var currentDir = Directory.GetCurrentDirectory();

        var jsonPath = Path.Combine(currentDir, "..", "..", "..", "..", "SettlyApi", "Data", "vic_stamp_duty.json");
        jsonPath = Path.GetFullPath(jsonPath);
        if (!File.Exists(jsonPath))
            throw new FileNotFoundException("Stamp duty ssss JSON file not found.", jsonPath);
        _calculator = new StampDutyCalculator(jsonPath);
    }

    [Fact]
    public void Calculate_ShouldReturnCorrectDuty_ForPPORBelow550k()
    {

        var input = new LoanSimulateInputDto
        {
            State = "vic",
            DutiableValue = 500000m,
            IsPPR = true,
            IsFirstHome = false,
            IsForeignPurchase = false,
            PropertyType = "NEW_HOME",
            IsResidentialProperty = true,
            ContractDate = DateTime.Now,
        };

        // Act
        var result = _calculator.Calculate(input);

        // Assert
        // Manual calculate
        decimal expectedDuty = 18370m + (500000m - 440000m) * 0.06m;
        Assert.Equal(expectedDuty, result.FinalDuty);

    }

    [Fact]
    public void Calculate_ShouldReturnCorrectDuty_ForPPORBelow550k_fhb()
    {

        var input = new LoanSimulateInputDto
        {
            State = "vic",
            DutiableValue = 500000m,
            IsPPR = true,
            IsFirstHome = true,
            IsForeignPurchase = false,
            PropertyType = "NEW_HOME",
            IsResidentialProperty = true,
            ContractDate = DateTime.Now,
        };

        // Act
        var result = _calculator.Calculate(input);
        // Assert
        Assert.Equal(0, result.FinalDuty);

    }

    [Fact]
    public void Calculate_ShouldReturnCorrectDuty_ForNullPPRBelow550k()
    {

        var input = new LoanSimulateInputDto
        {
            State = "vic",
            DutiableValue = 500000m,
            IsPPR = false,
            IsFirstHome = false,
            IsForeignPurchase = false,
            PropertyType = "NEW_HOME",
            IsResidentialProperty = true,
            ContractDate = DateTime.Now,
        };

        // Act
        var result = _calculator.Calculate(input);

        // Assert
        // Manual calculate
        decimal expectedDuty = 2870m + (500000m - 130000m) * 0.06m;
        Assert.Equal(expectedDuty, result.FinalDuty);

    }
    [Fact]
    public void Calculate_ShouldReturnCorrectDuty_ForNullPPRBelow550k_fhb()
    {

        var input = new LoanSimulateInputDto
        {
            State = "vic",
            DutiableValue = 500000m,
            IsPPR = false,
            IsFirstHome = true,
            IsForeignPurchase = false,
            PropertyType = "NEW_HOME",
            IsResidentialProperty = true,
            ContractDate = DateTime.Now,
        };

        // Act
        var result = _calculator.Calculate(input);

        // Assert
        Assert.Equal(0, result.FinalDuty);
    }

    [Fact]
    public void Calculate_ShouldApplyFhbExemption_WhenEligible()
    {

        var input = new LoanSimulateInputDto
        {
            State = "vic",
            DutiableValue = 560000m,
            IsPPR = true,
            IsFirstHome = true,
            IsForeignPurchase = false,
            PropertyType = "NEW_HOME",
            IsResidentialProperty = true,
            ContractDate = DateTime.Now,

        };

        // Act
        var result = _calculator.Calculate(input);

        Assert.Equal(0, result.FinalDuty);
    }

    [Fact]
    public void Calculate_ShouldApplyFhbConcession_WhenEligible605k()
    {

        var input = new LoanSimulateInputDto
        {
            State = "vic",
            DutiableValue = 605000m,
            IsPPR = true,
            IsFirstHome = true,
            IsForeignPurchase = false,
            PropertyType = "NEW_HOME",
            IsResidentialProperty = true,
            ContractDate = DateTime.Now,
        };

        // Act
        var result = _calculator.Calculate(input);
        Assert.Equal(1045m, result.FinalDuty);
    }
    [Fact]
    public void Calculate_ShouldApplyFhbConcession_WhenEligible650k()
    {

        var input = new LoanSimulateInputDto
        {
            State = "vic",
            DutiableValue = 650000m,
            IsPPR = true,
            IsFirstHome = true,
            IsForeignPurchase = false,
            PropertyType = "NEW_HOME",
            IsResidentialProperty = true,
            ContractDate = DateTime.Now,
        };

        // Act
        var result = _calculator.Calculate(input);
        Assert.Equal(11356m, result.FinalDuty);
    }

    [Fact]
    public void Calculate_ShouldApplyFhbConcession_WhenEligible700k()
    {

        var input = new LoanSimulateInputDto
        {
            State = "vic",
            DutiableValue = 700000m,
            IsPPR = true,
            IsFirstHome = true,
            IsForeignPurchase = false,
            PropertyType = "NEW_HOME",
            IsResidentialProperty = true,
            ContractDate = DateTime.Now,
        };

        // Act
        var result = _calculator.Calculate(input);
        Assert.Equal(24713m, result.FinalDuty);
    }

    [Fact]
    public void Calculate_ShouldApplyNoConssesion750k()
    {

        var input = new LoanSimulateInputDto
        {
            State = "vic",
            DutiableValue = 750000m,
            IsPPR = true,
            IsFirstHome = true,
            IsForeignPurchase = false,
            PropertyType = "NEW_HOME",
            IsResidentialProperty = true,
            ContractDate = DateTime.Now,
        };

        // Act
        var result = _calculator.Calculate(input);
        Assert.Equal(result.BaseDuty, result.FinalDuty);
    }

    [Fact]
    public void Calculate_ShouldApplyFhbConcession_WhenEligible745k()
    {

        var input = new LoanSimulateInputDto
        {
            State = "vic",
            DutiableValue = 745000m,
            IsPPR = true,
            IsFirstHome = true,
            IsForeignPurchase = false,
            PropertyType = "NEW_HOME",
            IsResidentialProperty = true,
            ContractDate = DateTime.Now,
        };

        // Act
        var result = _calculator.Calculate(input);
        Assert.Equal(38444m, result.FinalDuty);
    }


    [Fact]
    public void Calculate_ShouldApplyFhbConcession_WhenEligible()
    {

        var input = new LoanSimulateInputDto
        {
            State = "vic",
            DutiableValue = 660000m,
            IsPPR = true,
            IsFirstHome = true,
            IsForeignPurchase = false,
            PropertyType = "NEW_HOME",
            IsResidentialProperty = true,
            ContractDate = DateTime.Now,
        };

        // Act
        decimal expectedBaseDuty = 2870m + (660000m - 130000m) * 0.06m;//34670
        decimal expectedDiscount = (660000m - 600000m) / (750000m - 600000m);//0.6
        decimal expectedDuty = Math.Floor(expectedBaseDuty * expectedDiscount);//13868
        var result = _calculator.Calculate(input);
        Assert.Equal(expectedDuty, result.FinalDuty);
    }

    [Fact]
    public void Calculate_ShouldApplyFhbConcession_ForeignPurchase()
    {

        var input = new LoanSimulateInputDto
        {
            State = "vic",
            DutiableValue = 660000m,
            IsPPR = true,
            IsFirstHome = true,
            IsForeignPurchase = true,
            PropertyType = "NEW_HOME",
            IsResidentialProperty = true,
            ContractDate = DateTime.Now,
        };

        // Act
        decimal expectedBaseDuty = 2870m + (660000m - 130000m) * 0.06m;//34670
        decimal expectedDiscount = (660000m - 600000m) / (750000m - 600000m);//0.4
        decimal expectedConsseion = expectedBaseDuty * expectedDiscount;//13868
        decimal expectedSurchange = 660000m * 0.08m;//52800
        decimal expectedDuty = expectedSurchange + expectedConsseion;//66668

        var result = _calculator.Calculate(input);
        Assert.Equal(expectedBaseDuty, result.BaseDuty);
        Assert.Equal(expectedConsseion, result.Concessions?.Value);
        Assert.Equal(expectedSurchange, result.ForiegnSurcharge);
        Assert.Equal(expectedDuty, result.FinalDuty);

    }

}
