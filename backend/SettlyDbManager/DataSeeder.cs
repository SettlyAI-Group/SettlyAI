using Bogus;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Entities;

namespace SettlyDbManager;

public class DataSeeder
{
    private readonly SettlyDbContext _context;

    public DataSeeder(SettlyDbContext context)
    {
        _context = context;
    }

    public async Task SeedAllAsync()
    {
        // Clear existing data
        await ClearAllDataAsync();

        // Generate data in dependency order
        await SeedIndependentEntitiesAsync();
        await SeedFirstLevelDependentEntitiesAsync();
        await SeedSecondLevelDependentEntitiesAsync();

        Console.WriteLine("Fake data generation completed!");
    }

    public async Task SeedIndependentEntitiesAsync()
    {
        Console.WriteLine("Seeding Users...");
        await SeedUsersAsync();
        await _context.SaveChangesAsync();

        Console.WriteLine("Seeding Suburbs...");
        await SeedSuburbsAsync();
        await _context.SaveChangesAsync();

        Console.WriteLine("Seeding SuperFunds...");
        await SeedSuperFundsAsync();
        await _context.SaveChangesAsync();

        // await SeedPolicyRulesAsync(); // Temporarily disabled

        Console.WriteLine("Independent entities seeded");
    }

    public async Task SeedFirstLevelDependentEntitiesAsync()
    {
        await SeedPropertiesAsync();
        await SeedHousingMarketsAsync();
        await SeedIncomeEmploymentsAsync();
        await SeedPopulationSuppliesAsync();
        await SeedLivabilitiesAsync();
        await SeedRiskDevelopmentsAsync();
        await SeedSettlyAIScoresAsync();
        await SeedSuperProjectionInputsAsync();
        await SeedChatLogsAsync();

        await _context.SaveChangesAsync();
        Console.WriteLine("First level dependent entities seeded");
    }

    public async Task SeedSecondLevelDependentEntitiesAsync()
    {
        // await SeedFavouritesAsync(); Favourites' data from user saved data, not fake data
        await SeedInspectionPlansAsync();
        await SeedLoanCalculationsAsync();
        await SeedSuperProjectionResultsAsync();
        await SeedSuperProjectionInsightsAsync();
        await SeedUserFundSelectionsAsync();

        await _context.SaveChangesAsync();
        Console.WriteLine("Second level dependent entities seeded");
    }

    private async Task ClearAllDataAsync()
    {
        // Delete in reverse dependency order
        _context.UserFundSelections.RemoveRange(_context.UserFundSelections);
        _context.SuperProjectionInsights.RemoveRange(_context.SuperProjectionInsights);
        _context.SuperProjectionResults.RemoveRange(_context.SuperProjectionResults);
        _context.LoanCalculations.RemoveRange(_context.LoanCalculations);
        _context.InspectionPlans.RemoveRange(_context.InspectionPlans);
        _context.Favourites.RemoveRange(_context.Favourites);

        _context.ChatLogs.RemoveRange(_context.ChatLogs);
        _context.SuperProjectionInputs.RemoveRange(_context.SuperProjectionInputs);
        _context.SettlyAIScores.RemoveRange(_context.SettlyAIScores);
        _context.RiskDevelopments.RemoveRange(_context.RiskDevelopments);
        _context.Livabilities.RemoveRange(_context.Livabilities);
        _context.PopulationSupplies.RemoveRange(_context.PopulationSupplies);
        _context.IncomeEmployments.RemoveRange(_context.IncomeEmployments);
        _context.HousingMarkets.RemoveRange(_context.HousingMarkets);
        _context.Properties.RemoveRange(_context.Properties);

        _context.PolicyRules.RemoveRange(_context.PolicyRules);
        _context.SuperFunds.RemoveRange(_context.SuperFunds);
        _context.Suburbs.RemoveRange(_context.Suburbs);
        _context.Users.RemoveRange(_context.Users);

        await _context.SaveChangesAsync();
        Console.WriteLine("Existing data cleared");
    }

    // Independent entity seeding methods
    private async Task SeedUsersAsync()
    {
        var userFaker = new Faker<User>()
            .RuleFor(u => u.Name, f => f.Person.FullName)
            .RuleFor(u => u.Email, f => f.Person.Email)
            .RuleFor(u => u.PasswordHash, f => f.Internet.Password(8) + "_hashed")
            .RuleFor(u => u.CreatedAt, f => f.Date.Between(DateTime.UtcNow.AddYears(-2), DateTime.UtcNow).ToUniversalTime());

        var users = userFaker.Generate(50);
        await _context.Users.AddRangeAsync(users);
    }

    private async Task SeedSuburbsAsync()
    {
        // Australian suburb names and postcodes
        var australianSuburbs = new[]
        {
            ("Melbourne", "VIC", "3000"), ("Sydney", "NSW", "2000"), ("Brisbane", "QLD", "4000"),
            ("Perth", "WA", "6000"), ("Adelaide", "SA", "5000"), ("Hobart", "TAS", "7000"),
            ("Canberra", "ACT", "2600"), ("Darwin", "NT", "0800"), ("Parramatta", "NSW", "2150"),
            ("Geelong", "VIC", "3220"), ("Gold Coast", "QLD", "4217"), ("Newcastle", "NSW", "2300"),
            ("Wollongong", "NSW", "2500"), ("Cairns", "QLD", "4870"), ("Toowoomba", "QLD", "4350"),
            ("Townsville", "QLD", "4810"), ("Ballarat", "VIC", "3350"), ("Bendigo", "VIC", "3550"),
            ("Albury", "NSW", "2640"), ("Launceston", "TAS", "7250"), ("Mackay", "QLD", "4740"),
            ("Rockhampton", "QLD", "4700"), ("Bunbury", "WA", "6230"), ("Bundaberg", "QLD", "4670"),
            ("Coffs Harbour", "NSW", "2450"), ("Wagga Wagga", "NSW", "2650"), ("Hervey Bay", "QLD", "4655"),
            ("Mildura", "VIC", "3500"), ("Shepparton", "VIC", "3630"), ("Port Macquarie", "NSW", "2444"),
            ("Gladstone", "QLD", "4680"), ("Tamworth", "NSW", "2340"), ("Traralgon", "VIC", "3844"),
            ("Orange", "NSW", "2800"), ("Dubbo", "NSW", "2830"), ("Geraldton", "WA", "6530"),
            ("Kalgoorlie", "WA", "6430"), ("Warrnambool", "VIC", "3280"), ("Kwinana", "WA", "6167"),
            ("Nowra", "NSW", "2541"), ("Alice Springs", "NT", "0870"), ("Lismore", "NSW", "2480"),
            ("Goulburn", "NSW", "2580"), ("Devonport", "TAS", "7310"), ("Armidale", "NSW", "2350"),
            ("Bathurst", "NSW", "2795"), ("Busselton", "WA", "6280"), ("Sunbury", "VIC", "3429"),
            ("Palmerston", "NT", "0830"), ("Warwick", "QLD", "4370"), ("Burnie", "TAS", "7320")
        };

        var suburbs = new List<Suburb>();
        foreach (var (name, state, postcode) in australianSuburbs)
        {
            suburbs.Add(new Suburb
            {
                Name = name,
                State = state,
                Postcode = postcode
            });
        }
        await _context.Suburbs.AddRangeAsync(suburbs);
    }

    private async Task SeedSuperFundsAsync()
    {
        var superFundNames = new[]
        {
            "AustralianSuper", "Sunsuper", "REST Super", "HESTA", "Cbus", "UniSuper",
            "Colonial First State", "BT Super", "MLC Super", "QSuper", "VicSuper",
            "Australian Retirement Trust", "Hostplus", "NGS Super", "Aware Super"
        };

        var superFunds = new List<SuperFund>();
        var faker = new Faker();
        foreach (var fundName in superFundNames)
        {
            superFunds.Add(new SuperFund
            {
                Name = fundName,
                Return1Y = faker.Random.Decimal(0.02m, 0.15m),
                Return3Y = faker.Random.Decimal(0.04m, 0.12m),
                Return5Y = faker.Random.Decimal(0.05m, 0.10m),
                Return10Y = faker.Random.Decimal(0.06m, 0.09m),
                Fee = faker.Random.Decimal(0.005m, 0.02m)
            });
        }
        await _context.SuperFunds.AddRangeAsync(superFunds);
    }

    private async Task SeedPolicyRulesAsync()
    {
        var policyTypes = new[] { "FirstHomeBuyer", "StampDutyExemption", "GrantScheme", "TaxIncentive" };
        var states = new[] { "NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT" };

        var policyRuleFaker = new Faker<PolicyRule>()
            .RuleFor(pr => pr.SuburbId, f => f.Random.Bool(0.3f) ? (int?)null : f.Random.Int(1, 100))
            .RuleFor(pr => pr.State, f => f.PickRandom(states))
            .RuleFor(pr => pr.RuleType, f => f.PickRandom(policyTypes))
            .RuleFor(pr => pr.Title, f => $"{f.PickRandom(policyTypes)} Policy for {f.PickRandom(states)}")
            .RuleFor(pr => pr.Description, f => f.Lorem.Paragraph(2))
            .RuleFor(pr => pr.Eligibility, f => f.Lorem.Sentence(8, 15))
            .RuleFor(pr => pr.Link, f => f.Internet.Url())
            .RuleFor(pr => pr.EffectiveDate, f => f.Date.Between(DateTime.UtcNow.AddYears(-3), DateTime.UtcNow.AddYears(1)));

        var policyRules = policyRuleFaker.Generate(30);
        await _context.PolicyRules.AddRangeAsync(policyRules);
    }

    // First level dependent entity seeding methods
    private async Task SeedPropertiesAsync()
    {
        var suburbIds = await _context.Suburbs.Select(s => s.Id).ToListAsync();
        var propertyTypes = new[] { "House", "Apartment", "Townhouse", "Unit", "Villa" };
        var features = new[] { "Pool", "Garage", "Garden", "Balcony", "Air Conditioning", "Parking", "Modern Kitchen" };
        var iamges = new[] { "https://cdn.pixabay.com/photo/2020/04/28/04/03/villa-5102551_1280.jpg", "https://cdn.pixabay.com/photo/2020/04/28/04/03/villa-5102547_1280.jpg", "https://cdn.pixabay.com/photo/2017/04/10/22/28/residence-2219972_1280.jpg" };
        var propertyFaker = new Faker<Property>()
            .RuleFor(p => p.SuburbId, f => f.PickRandom(suburbIds))
            .RuleFor(p => p.Address, f => f.Address.StreetAddress())
            .RuleFor(p => p.PropertyType, f => f.PickRandom(propertyTypes))
            .RuleFor(p => p.Bedrooms, f => f.Random.Int(1, 5))
            .RuleFor(p => p.Bathrooms, f => f.Random.Int(1, 3))
            .RuleFor(p => p.CarSpaces, f => f.Random.Int(0, 3))
            .RuleFor(p => p.Price, f => f.Random.Int(300000, 2000000))
            .RuleFor(p => p.InternalArea, f => f.Random.Int(50, 400))
            .RuleFor(p => p.LandSize, f => f.Random.Int(100, 1000))
            .RuleFor(p => p.YearBuilt, f => f.Random.Int(1950, 2024))
            .RuleFor(p => p.Features, f => f.PickRandom(features, 3).ToArray())
            .RuleFor(p => p.Summary, (f, p) => $"Discover this stunning {p.Bedrooms}-bedroom {p.PropertyType.ToLower()} located in a vibrant suburb. " +
                $"Featuring {p.Features}, this property offers comfort and convenience for modern living. " +
                $"Built in {p.YearBuilt}, it boasts {p.Bathrooms} bathrooms and {p.CarSpaces} car spaces.")
            .RuleFor(p => p.ImageUrl, f => f.PickRandom(iamges));
        var properties = propertyFaker.Generate(500);
        await _context.Properties.AddRangeAsync(properties);
    }

    private async Task SeedHousingMarketsAsync()
    {
        var suburbIds = await _context.Suburbs.Select(s => s.Id).ToListAsync();

        var housingMarketFaker = new Faker<HousingMarket>()
            .RuleFor(hm => hm.SuburbId, f => f.PickRandom(suburbIds))
            .RuleFor(ps => ps.Population, f => f.Random.Int(5000, 150000))
            .RuleFor(ps => ps.PopulationGrowthRate, f => f.Random.Decimal(-0.02m, 0.08m))
            .RuleFor(hm => hm.RentalYield, f => f.Random.Decimal(0.02m, 0.08m))
            .RuleFor(hm => hm.MedianPrice, f => f.Random.Int(400000, 1500000))
            .RuleFor(hm => hm.PriceGrowth3Yr, f => f.Random.Decimal(-0.05m, 0.15m))
            .RuleFor(hm => hm.DaysOnMarket, f => f.Random.Int(15, 180))
            .RuleFor(hm => hm.StockOnMarket, f => f.Random.Int(10, 500))
            .RuleFor(hm => hm.ClearanceRate, f => f.Random.Decimal(0.4m, 0.9m))
            .RuleFor(hm => hm.MedianRent, f => f.Random.Int(300, 1000))
            .RuleFor(hm => hm.RentGrowth12M, f => f.Random.Decimal(-0.1m, 0.2m))
            .RuleFor(hm => hm.VacancyRate, f => f.Random.Decimal(0.01m, 0.08m))
            .RuleFor(hm => hm.SnapshotDate, f => f.Date.Between(DateTime.UtcNow.AddMonths(-6), DateTime.UtcNow));

        var housingMarkets = housingMarketFaker.Generate(100);
        await _context.HousingMarkets.AddRangeAsync(housingMarkets);
    }

    private async Task SeedIncomeEmploymentsAsync()
    {
        var suburbIds = await _context.Suburbs.Select(s => s.Id).ToListAsync();

        var incomeEmploymentFaker = new Faker<IncomeEmployment>()
            .RuleFor(ie => ie.SuburbId, f => f.PickRandom(suburbIds))
            .RuleFor(ie => ie.MedianIncome, f => f.Random.Int(45000, 120000))
            .RuleFor(ie => ie.EmploymentRate, f => f.Random.Decimal(0.75m, 0.95m))
            .RuleFor(ie => ie.WhiteCollarRatio, f => f.Random.Decimal(0.3m, 0.8m))
            .RuleFor(ie => ie.JobGrowthRate, f => f.Random.Decimal(-0.05m, 0.15m))
            .RuleFor(ie => ie.SnapshotDate, f => f.Date.Between(DateTime.UtcNow.AddMonths(-12), DateTime.UtcNow));

        var incomeEmployments = incomeEmploymentFaker.Generate(100);
        await _context.IncomeEmployments.AddRangeAsync(incomeEmployments);
    }

    private async Task SeedPopulationSuppliesAsync()
    {
        var suburbIds = await _context.Suburbs.Select(s => s.Id).ToListAsync();
        var landSupplyTypes = new[] { "High", "Medium", "Low", "Very Low", "Constrained" };

        var populationSupplyFaker = new Faker<PopulationSupply>()
            .RuleFor(ps => ps.SuburbId, f => f.PickRandom(suburbIds))
            .RuleFor(ps => ps.DevProjectsCount, f => f.Random.Int(0, 50))
            .RuleFor(ps => ps.DemandSupplyRatio, f => f.Random.Decimal(0.5m, 2.0m))
            .RuleFor(ps => ps.RentersRatio, f => f.Random.Decimal(0.2m, 0.7m))
            .RuleFor(ps => ps.BuildingApprovals12M, f => f.Random.Int(50, 2000))
            .RuleFor(ps => ps.SnapshotDate, f => f.Date.Between(DateTime.UtcNow.AddMonths(-12), DateTime.UtcNow));

        var populationSupplies = populationSupplyFaker.Generate(100);
        await _context.PopulationSupplies.AddRangeAsync(populationSupplies);
    }

    private async Task SeedLivabilitiesAsync()
    {
        var suburbIds = await _context.Suburbs.Select(s => s.Id).ToListAsync();

        var livabilityFaker = new Faker<Livability>()
            .RuleFor(l => l.SuburbId, f => f.PickRandom(suburbIds))
            .RuleFor(l => l.TransportScore, f => f.Random.Decimal(1.0m, 10.0m))
            .RuleFor(l => l.SupermarketQuantity, f => f.Random.Int(2, 20))
            .RuleFor(l => l.HospitalQuantity, f => f.Random.Int(1, 10))
            .RuleFor(l => l.PrimarySchoolRating, f => f.Random.Decimal(6.0m, 10.0m))
            .RuleFor(l => l.SecondarySchoolRating, f => f.Random.Decimal(6.0m, 10.0m))
            .RuleFor(l => l.HospitalDensity, f => f.Random.Decimal(0.1m, 5.0m))
            .RuleFor(l => l.SnapshotDate, f => f.Date.Between(DateTime.UtcNow.AddMonths(-12), DateTime.UtcNow));

        var livabilities = livabilityFaker.Generate(100);
        await _context.Livabilities.AddRangeAsync(livabilities);
    }

    private async Task SeedRiskDevelopmentsAsync()
    {
        var suburbIds = await _context.Suburbs.Select(s => s.Id).ToListAsync();

        var riskDevelopmentFaker = new Faker<RiskDevelopment>()
            .RuleFor(rd => rd.SuburbId, f => f.PickRandom(suburbIds))
            .RuleFor(rd => rd.CrimeRate, f => f.Random.Decimal(0.5m, 8.0m))
            .RuleFor(rd => rd.SnapshotDate, f => f.Date.Between(DateTime.UtcNow.AddMonths(-12), DateTime.UtcNow));

        var riskDevelopments = riskDevelopmentFaker.Generate(100);
        await _context.RiskDevelopments.AddRangeAsync(riskDevelopments);
    }

    private async Task SeedSettlyAIScoresAsync()
    {
        var suburbIds = await _context.Suburbs.Select(s => s.Id).ToListAsync();

        var settlyAIScoreFaker = new Faker<SettlyAIScore>()
            .RuleFor(sas => sas.SuburbId, f => f.PickRandom(suburbIds))
            .RuleFor(sas => sas.AffordabilityScore, f => f.Random.Decimal(1.0m, 10.0m))
            .RuleFor(sas => sas.GrowthPotentialScore, f => f.Random.Decimal(1.0m, 10.0m))
            .RuleFor(sas => sas.SnapshotDate, f => f.Date.Between(DateTime.UtcNow.AddMonths(-6), DateTime.UtcNow));

        var settlyAIScores = settlyAIScoreFaker.Generate(100);
        await _context.SettlyAIScores.AddRangeAsync(settlyAIScores);
    }

    private async Task SeedSuperProjectionInputsAsync()
    {
        var userIds = await _context.Users.Select(u => u.Id).ToListAsync();

        var superProjectionInputFaker = new Faker<SuperProjectionInput>()
            .RuleFor(spi => spi.UserId, f => f.PickRandom(userIds))
            .RuleFor(spi => spi.CurrentBalance, f => f.Random.Int(10000, 500000))
            .RuleFor(spi => spi.Salary, f => f.Random.Int(50000, 150000))
            .RuleFor(spi => spi.CurrentAge, f => f.Random.Int(25, 60))
            .RuleFor(spi => spi.RetirementAge, f => f.Random.Int(60, 70))
            .RuleFor(spi => spi.EmployerContributionRate, f => f.Random.Decimal(0.095m, 0.12m))
            .RuleFor(spi => spi.UseFhss, f => f.Random.Bool(0.3f))
            .RuleFor(spi => spi.CreatedAt, f => f.Date.Between(DateTime.UtcNow.AddYears(-1), DateTime.UtcNow));

        var superProjectionInputs = superProjectionInputFaker.Generate(75);
        await _context.SuperProjectionInputs.AddRangeAsync(superProjectionInputs);
    }

    private async Task SeedChatLogsAsync()
    {
        var userIds = await _context.Users.Select(u => u.Id).ToListAsync();
        var userMessages = new[]
        {
            "What suburbs should I consider for investment?",
            "How is the market in Melbourne?",
            "Can you analyze this property for me?",
            "What are the best growth areas?",
            "I'm looking for family-friendly suburbs",
            "What's the rental yield in this area?",
            "Are there any upcoming developments?",
            "What's the crime rate like?"
        };
        var aiResponses = new[]
        {
            "Based on current market data, I'd recommend looking at these suburbs...",
            "The Melbourne market is showing strong growth in several key areas...",
            "Let me analyze the property details and market conditions...",
            "Current growth hotspots include areas with strong infrastructure...",
            "For families, consider suburbs with good schools and amenities...",
            "The rental yield in this area is currently around...",
            "There are several major developments planned for this region...",
            "Crime statistics show this area has a relatively low crime rate..."
        };

        var chatLogs = new List<ChatLog>();
        foreach (var userId in userIds.Take(30))
        {
            var conversationLength = new Faker().Random.Int(2, 10);
            for (int i = 0; i < conversationLength; i++)
            {
                // User message
                chatLogs.Add(new ChatLog
                {
                    UserId = userId,
                    Message = new Faker().PickRandom(userMessages),
                    IsUser = true,
                    Timestamp = DateTime.UtcNow.AddDays(-new Faker().Random.Int(1, 30)).AddMinutes(-i * 2)
                });

                // AI response
                chatLogs.Add(new ChatLog
                {
                    UserId = userId,
                    Message = new Faker().PickRandom(aiResponses),
                    IsUser = false,
                    Timestamp = DateTime.UtcNow.AddDays(-new Faker().Random.Int(1, 30)).AddMinutes(-i * 2 + 1)
                });
            }
        }

        await _context.ChatLogs.AddRangeAsync(chatLogs);
    }
    private async Task SeedInspectionPlansAsync()
    {
        var userIds = await _context.Users.Select(u => u.Id).ToListAsync();
        var propertyIds = await _context.Properties.Select(p => p.Id).ToListAsync();
        var inspectionNotes = new[]
        {
            "First inspection - interested in the property",
            "Second viewing with family",
            "Check the condition of the roof and plumbing",
            "Bring building inspector for detailed assessment",
            "Final inspection before making an offer",
            "Compare with other properties in the area",
            "Check neighbourhood and local amenities"
        };

        var inspectionPlans = new List<InspectionPlan>();
        foreach (var userId in userIds.Take(25))
        {
            var inspectionCount = new Faker().Random.Int(1, 4);
            var selectedProperties = new Faker().PickRandom(propertyIds, inspectionCount).ToList();

            foreach (var propertyId in selectedProperties)
            {
                inspectionPlans.Add(new InspectionPlan
                {
                    UserId = userId,
                    PropertyId = propertyId,
                    ScheduledTime = new Faker().Date.Between(DateTime.UtcNow.AddDays(1), DateTime.UtcNow.AddDays(30)),
                    Note = new Faker().PickRandom(inspectionNotes),
                    CreatedAt = new Faker().Date.Between(DateTime.UtcNow.AddDays(-7), DateTime.UtcNow)
                });
            }
        }

        await _context.InspectionPlans.AddRangeAsync(inspectionPlans);
    }

    private async Task SeedLoanCalculationsAsync()
    {
        var userIds = await _context.Users.Select(u => u.Id).ToListAsync();
        var propertyIds = await _context.Properties.Select(p => p.Id).ToListAsync();
        var repaymentTypes = new[] { "Principal and Interest", "Interest Only" };

        var loanCalculations = new List<LoanCalculation>();
        foreach (var userId in userIds.Take(30))
        {
            var calculationCount = new Faker().Random.Int(1, 3);
            var selectedProperties = new Faker().PickRandom(propertyIds, calculationCount).ToList();

            foreach (var propertyId in selectedProperties)
            {
                var faker = new Faker();
                var depositAmount = faker.Random.Int(50000, 400000);
                var loanAmount = faker.Random.Int(300000, 1200000);
                var interestRate = faker.Random.Decimal(0.03m, 0.07m);
                var income = faker.Random.Int(60000, 180000);
                var monthlyRepayment = faker.Random.Int(1500, 6000);
                var totalInterest = faker.Random.Int(200000, 800000);

                loanCalculations.Add(new LoanCalculation
                {
                    UserId = userId,
                    PropertyId = propertyId,
                    DepositAmount = depositAmount,
                    LoanAmount = loanAmount,
                    InterestRate = interestRate,
                    LoanTermYears = faker.Random.Int(20, 30),
                    RepaymentType = faker.PickRandom(repaymentTypes),
                    Income = income,
                    MonthlyRepayment = monthlyRepayment,
                    TotalInterest = totalInterest,
                    TotalCost = loanAmount + totalInterest,
                    RepaymentToIncomeRatio = (decimal)monthlyRepayment * 12 / income,
                    StampDuty = faker.Random.Int(15000, 60000),
                    LegalFees = faker.Random.Int(1000, 3000),
                    InspectionFees = faker.Random.Int(400, 800),
                    ApplicationFee = faker.Random.Int(200, 600),
                    OtherUpfrontCosts = faker.Random.Int(2000, 8000),
                    StressInterestRate = interestRate + 0.03m,
                    StressMonthlyRepayment = (int)(monthlyRepayment * 1.3),
                    StressResultNote = faker.Random.Bool(0.7f) ? "Passes stress test" : "Marginal under stress conditions",
                    FixedMonthly = monthlyRepayment,
                    VariableMonthly = (int)(monthlyRepayment * faker.Random.Decimal(0.95m, 1.05m)),
                    DifferenceNote = faker.Lorem.Sentence(6, 10),
                    CreatedAt = faker.Date.Between(DateTime.UtcNow.AddMonths(-3), DateTime.UtcNow)
                });
            }
        }

        await _context.LoanCalculations.AddRangeAsync(loanCalculations);
    }

    private async Task SeedSuperProjectionResultsAsync()
    {
        var inputIds = await _context.SuperProjectionInputs.Select(spi => spi.Id).ToListAsync();

        var superProjectionResults = new List<SuperProjectionResult>();
        foreach (var inputId in inputIds)
        {
            var faker = new Faker();
            var projectedBalance = faker.Random.Int(500000, 2000000);
            var fhssAmount = faker.Random.Int(30000, 50000);

            superProjectionResults.Add(new SuperProjectionResult
            {
                InputId = inputId,
                ProjectedBalanceAtRetirement = projectedBalance,
                BalanceWithFhss = projectedBalance - fhssAmount,
                BalanceWithoutFhss = projectedBalance,
                NetDifference = fhssAmount,
                FhssWithdrawableAmount = fhssAmount
            });
        }

        await _context.SuperProjectionResults.AddRangeAsync(superProjectionResults);
    }

    private async Task SeedSuperProjectionInsightsAsync()
    {
        var inputIds = await _context.SuperProjectionInputs.Select(spi => spi.Id).ToListAsync();

        var summaryTemplates = new[]
        {
            "Your superannuation is projected to grow significantly over the next {0} years.",
            "Based on current contributions and market performance, your retirement savings are on track.",
            "Your super balance shows strong growth potential with current contribution rates.",
            "The projection indicates a comfortable retirement income based on current settings."
        };

        var recommendationTemplates = new[]
        {
            "Consider increasing voluntary contributions to maximize tax benefits and growth.",
            "Review your investment options to ensure they align with your risk tolerance.",
            "The First Home Super Saver Scheme could help you save for a home deposit.",
            "Consider salary sacrificing to boost your super while reducing taxable income.",
            "Regular reviews of your super performance can help optimize long-term outcomes."
        };

        var superProjectionInsights = new List<SuperProjectionInsight>();
        foreach (var inputId in inputIds)
        {
            var faker = new Faker();
            var yearsToRetirement = faker.Random.Int(10, 40);

            superProjectionInsights.Add(new SuperProjectionInsight
            {
                InputId = inputId,
                SummaryNote = string.Format(faker.PickRandom(summaryTemplates), yearsToRetirement),
                RecommendationNote = faker.PickRandom(recommendationTemplates)
            });
        }

        await _context.SuperProjectionInsights.AddRangeAsync(superProjectionInsights);
    }

    private async Task SeedUserFundSelectionsAsync()
    {
        var userIds = await _context.Users.Select(u => u.Id).ToListAsync();
        var fundIds = await _context.SuperFunds.Select(sf => sf.Id).ToListAsync();
        var inputIds = await _context.SuperProjectionInputs.Select(spi => spi.Id).ToListAsync();

        var userFundSelections = new List<UserFundSelection>();
        foreach (var inputId in inputIds)
        {
            var faker = new Faker();
            var userId = faker.PickRandom(userIds);
            var fundId = faker.PickRandom(fundIds);

            userFundSelections.Add(new UserFundSelection
            {
                UserId = userId,
                InputId = inputId,
                FundId = fundId
            });
        }

        await _context.UserFundSelections.AddRangeAsync(userFundSelections);
    }
}
