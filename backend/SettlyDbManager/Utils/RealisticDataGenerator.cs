using Bogus;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Entities;

namespace SettlyDbManager.Utils;

/// <summary>
/// 生成符合客观事实的 mock 数据生成器
/// 基于澳洲房地产市场的实际情况来生成关联性数据
/// </summary>
public class RealisticDataGenerator
{
    private readonly SettlyDbContext _context;
    private readonly Faker _faker;

    public RealisticDataGenerator(SettlyDbContext context)
    {
        _context = context;
        _faker = new Faker();
    }

    /// <summary>
    /// 为所有 Suburb 生成关联的 realistic 数据
    /// </summary>
    public async Task GenerateRealisticDataForAllSuburbsAsync()
    {
        var suburbs = await _context.Suburbs.ToListAsync();
        
        foreach (var suburb in suburbs)
        {
            await GenerateDataForSuburbAsync(suburb);
        }
        
        await _context.SaveChangesAsync();
        Console.WriteLine($"Generated realistic data for {suburbs.Count} suburbs");
    }

    /// <summary>
    /// 为单个 Suburb 生成所有关联数据
    /// </summary>
    private async Task GenerateDataForSuburbAsync(Suburb suburb)
    {
        // 基于 suburb 的特征计算基础参数
        var suburbProfile = CalculateSuburbProfile(suburb);
        
        // 生成 HousingMarket 数据
        await GenerateHousingMarketAsync(suburb, suburbProfile);
        
        // 生成 Livability 数据
        await GenerateLivabilityAsync(suburb, suburbProfile);
        
        // 生成 PopulationSupply 数据
        await GeneratePopulationSupplyAsync(suburb, suburbProfile);
        
        // 生成 IncomeEmployment 数据
        await GenerateIncomeEmploymentAsync(suburb, suburbProfile);
        
        // 生成 RiskDevelopment 数据
        await GenerateRiskDevelopmentAsync(suburb, suburbProfile);
        
        // 生成 SettlyAIScore 数据
        await GenerateSettlyAIScoreAsync(suburb, suburbProfile);
    }

    /// <summary>
    /// 计算 suburb 的基础特征档案
    /// </summary>
    private SuburbProfile CalculateSuburbProfile(Suburb suburb)
    {
        var isMajorCity = IsMajorCity(suburb.Name);
        var isCapitalCity = IsCapitalCity(suburb.Name);
        var stateFactor = GetStateFactor(suburb.State);
        var postcodeFactor = GetPostcodeFactor(suburb.Postcode);
        
        return new SuburbProfile
        {
            IsMajorCity = isMajorCity,
            IsCapitalCity = isCapitalCity,
            StateFactor = stateFactor,
            PostcodeFactor = postcodeFactor,
            PopulationBase = CalculatePopulationBase(isMajorCity, isCapitalCity, stateFactor),
            EconomicLevel = CalculateEconomicLevel(isMajorCity, isCapitalCity, stateFactor),
            DevelopmentLevel = CalculateDevelopmentLevel(isMajorCity, stateFactor)
        };
    }

    /// <summary>
    /// 生成 HousingMarket 数据
    /// </summary>
    private async Task GenerateHousingMarketAsync(Suburb suburb, SuburbProfile profile)
    {
        var population = (int)(profile.PopulationBase * _faker.Random.Decimal(0.8m, 1.2m));
        var populationGrowthRate = CalculatePopulationGrowthRate(profile);
        
        // 房价基于人口密度、地理位置和经济水平
        var medianPrice = CalculateMedianPrice(profile, population);
        var rentalYield = CalculateRentalYield(medianPrice, profile);
        
        var housingMarket = new HousingMarket
        {
            SuburbId = suburb.Id,
            Population = population,
            PopulationGrowthRate = populationGrowthRate,
            MedianPrice = medianPrice,
            RentalYield = rentalYield,
            PriceGrowth3Yr = CalculatePriceGrowth(profile),
            DaysOnMarket = CalculateDaysOnMarket(profile),
            StockOnMarket = CalculateStockOnMarket(population, profile),
            ClearanceRate = CalculateClearanceRate(profile),
            MedianRent = CalculateMedianRent(medianPrice),
            RentGrowth12M = CalculateRentGrowth(profile),
            VacancyRate = CalculateVacancyRate(profile),
            SnapshotDate = DateTime.UtcNow.AddDays(-_faker.Random.Int(1, 30))
        };

        await _context.HousingMarkets.AddAsync(housingMarket);
    }

    /// <summary>
    /// 生成 Livability 数据
    /// </summary>
    private async Task GenerateLivabilityAsync(Suburb suburb, SuburbProfile profile)
    {
        var population = profile.PopulationBase;
        
        // 人口越多，基础设施通常越完善
        var transportScore = CalculateTransportScore(profile);
        var supermarketQuantity = CalculateSupermarketQuantity(population);
        var hospitalQuantity = CalculateHospitalQuantity(population);
        var hospitalDensity = CalculateHospitalDensity(hospitalQuantity, population);
        
        // 学校评分通常与人口密度和经济水平相关
        var primarySchoolRating = CalculateSchoolRating(profile, true);
        var secondarySchoolRating = CalculateSchoolRating(profile, false);

        var livability = new Livability
        {
            SuburbId = suburb.Id,
            TransportScore = transportScore,
            SupermarketQuantity = supermarketQuantity,
            HospitalQuantity = hospitalQuantity,
            HospitalDensity = hospitalDensity,
            PrimarySchoolRating = primarySchoolRating,
            SecondarySchoolRating = secondarySchoolRating,
            SnapshotDate = DateTime.UtcNow.AddDays(-_faker.Random.Int(1, 30))
        };

        await _context.Livabilities.AddAsync(livability);
    }

    /// <summary>
    /// 生成 PopulationSupply 数据
    /// </summary>
    private async Task GeneratePopulationSupplyAsync(Suburb suburb, SuburbProfile profile)
    {
        var population = profile.PopulationBase;
        
        // 开发项目数量与人口密度和地理位置相关
        var devProjectsCount = CalculateDevProjectsCount(population, profile);
        var buildingApprovals12M = CalculateBuildingApprovals(population, profile);
        
        // 供需比例与经济发展水平相关
        var demandSupplyRatio = CalculateDemandSupplyRatio(profile);
        var rentersRatio = CalculateRentersRatio(profile);

        var populationSupply = new PopulationSupply
        {
            SuburbId = suburb.Id,
            DevProjectsCount = devProjectsCount,
            BuildingApprovals12M = buildingApprovals12M,
            DemandSupplyRatio = demandSupplyRatio,
            RentersRatio = rentersRatio,
            SnapshotDate = DateTime.UtcNow.AddDays(-_faker.Random.Int(1, 30))
        };

        await _context.PopulationSupplies.AddAsync(populationSupply);
    }

    /// <summary>
    /// 生成 IncomeEmployment 数据
    /// </summary>
    private async Task GenerateIncomeEmploymentAsync(Suburb suburb, SuburbProfile profile)
    {
        var medianIncome = CalculateMedianIncome(profile);
        var employmentRate = CalculateEmploymentRate(profile);
        var whiteCollarRatio = CalculateWhiteCollarRatio(profile);
        var jobGrowthRate = CalculateJobGrowthRate(profile);

        var incomeEmployment = new IncomeEmployment
        {
            SuburbId = suburb.Id,
            MedianIncome = medianIncome,
            EmploymentRate = employmentRate,
            WhiteCollarRatio = whiteCollarRatio,
            JobGrowthRate = jobGrowthRate,
            SnapshotDate = DateTime.UtcNow.AddDays(-_faker.Random.Int(1, 30))
        };

        await _context.IncomeEmployments.AddAsync(incomeEmployment);
    }

    /// <summary>
    /// 生成 RiskDevelopment 数据
    /// </summary>
    private async Task GenerateRiskDevelopmentAsync(Suburb suburb, SuburbProfile profile)
    {
        var crimeRate = CalculateCrimeRate(profile);

        var riskDevelopment = new RiskDevelopment
        {
            SuburbId = suburb.Id,
            CrimeRate = crimeRate,
            SnapshotDate = DateTime.UtcNow.AddDays(-_faker.Random.Int(1, 30))
        };

        await _context.RiskDevelopments.AddAsync(riskDevelopment);
    }

    /// <summary>
    /// 生成 SettlyAIScore 数据
    /// </summary>
    private async Task GenerateSettlyAIScoreAsync(Suburb suburb, SuburbProfile profile)
    {
        var affordabilityScore = CalculateAffordabilityScore(profile);
        var growthPotentialScore = CalculateGrowthPotentialScore(profile);

        var settlyAIScore = new SettlyAIScore
        {
            SuburbId = suburb.Id,
            AffordabilityScore = affordabilityScore,
            GrowthPotentialScore = growthPotentialScore,
            SnapshotDate = DateTime.UtcNow.AddDays(-_faker.Random.Int(1, 30))
        };

        await _context.SettlyAIScores.AddAsync(settlyAIScore);
    }

    #region Helper Methods

    private bool IsMajorCity(string suburbName)
    {
        var majorCities = new[] { "Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton", "Warrnambool", "Mildura", "Traralgon" };
        return majorCities.Contains(suburbName, StringComparer.OrdinalIgnoreCase);
    }

    private bool IsCapitalCity(string suburbName)
    {
        // Melbourne CBD and surrounding areas
        var capitalAreas = new[] { "Melbourne", "East Melbourne", "West Melbourne", "South Wharf", "Docklands" };
        return capitalAreas.Contains(suburbName, StringComparer.OrdinalIgnoreCase);
    }

    private decimal GetStateFactor(string state)
    {
        return state switch
        {
            "NSW" => 1.2m, // 新南威尔士州经济较强
            "VIC" => 1.1m, // 维多利亚州
            "QLD" => 1.0m, // 昆士兰州
            "WA" => 1.05m, // 西澳大利亚州
            "SA" => 0.9m,  // 南澳大利亚州
            "TAS" => 0.8m, // 塔斯马尼亚州
            "ACT" => 1.15m, // 澳大利亚首都领地
            "NT" => 0.85m, // 北领地
            _ => 1.0m
        };
    }

    private decimal GetPostcodeFactor(string postcode)
    {
        // 基于维多利亚州邮编范围判断地理位置优势
        if (postcode.StartsWith("30")) return 1.4m; // Melbourne CBD and inner city
        if (postcode.StartsWith("31")) return 1.3m; // Inner Melbourne suburbs
        if (postcode.StartsWith("32")) return 1.2m; // Geelong area
        if (postcode.StartsWith("33")) return 1.1m; // Outer Melbourne suburbs
        if (postcode.StartsWith("34")) return 1.0m; // Regional Victoria
        if (postcode.StartsWith("35")) return 0.9m; // Regional Victoria
        if (postcode.StartsWith("36")) return 0.9m; // Regional Victoria
        if (postcode.StartsWith("37")) return 0.8m; // Regional Victoria
        if (postcode.StartsWith("38")) return 0.8m; // Regional Victoria
        if (postcode.StartsWith("39")) return 0.8m; // Regional Victoria
        return 1.0m; // 默认值
    }

    private int CalculatePopulationBase(bool isMajorCity, bool isCapitalCity, decimal stateFactor)
    {
        var basePopulation = isCapitalCity ? 500000 : (isMajorCity ? 100000 : 25000);
        return (int)(basePopulation * stateFactor * _faker.Random.Decimal(0.7m, 1.4m));
    }

    private EconomicLevel CalculateEconomicLevel(bool isMajorCity, bool isCapitalCity, decimal stateFactor)
    {
        if (isCapitalCity) return EconomicLevel.High;
        if (isMajorCity && stateFactor > 1.0m) return EconomicLevel.MediumHigh;
        if (isMajorCity) return EconomicLevel.Medium;
        return EconomicLevel.MediumLow;
    }

    private DevelopmentLevel CalculateDevelopmentLevel(bool isMajorCity, decimal stateFactor)
    {
        if (isMajorCity && stateFactor > 1.1m) return DevelopmentLevel.High;
        if (isMajorCity) return DevelopmentLevel.Medium;
        return DevelopmentLevel.Low;
    }

    private decimal CalculatePopulationGrowthRate(SuburbProfile profile)
    {
        var baseRate = profile.EconomicLevel switch
        {
            EconomicLevel.High => 0.03m,
            EconomicLevel.MediumHigh => 0.02m,
            EconomicLevel.Medium => 0.015m,
            _ => 0.01m
        };
        
        return baseRate + _faker.Random.Decimal(-0.01m, 0.02m);
    }

    private int CalculateMedianPrice(SuburbProfile profile, int population)
    {
        var basePrice = profile.EconomicLevel switch
        {
            EconomicLevel.High => 1200000,
            EconomicLevel.MediumHigh => 800000,
            EconomicLevel.Medium => 600000,
            _ => 450000
        };

        // 人口密度影响
        var populationFactor = Math.Min(population / 100000m, 2.0m);
        return (int)(basePrice * profile.StateFactor * profile.PostcodeFactor * (0.8m + populationFactor * 0.2m));
    }

    private decimal CalculateRentalYield(int medianPrice, SuburbProfile profile)
    {
        // 房价越高，租金收益率通常越低
        var baseYield = medianPrice > 1000000 ? 0.025m : 
                       medianPrice > 700000 ? 0.035m : 
                       medianPrice > 500000 ? 0.045m : 0.055m;
        
        return baseYield + _faker.Random.Decimal(-0.005m, 0.01m);
    }

    private decimal CalculatePriceGrowth(SuburbProfile profile)
    {
        var baseGrowth = profile.EconomicLevel switch
        {
            EconomicLevel.High => 0.08m,
            EconomicLevel.MediumHigh => 0.06m,
            EconomicLevel.Medium => 0.04m,
            _ => 0.02m
        };
        
        return baseGrowth + _faker.Random.Decimal(-0.02m, 0.04m);
    }

    private int CalculateDaysOnMarket(SuburbProfile profile)
    {
        var baseDays = profile.EconomicLevel switch
        {
            EconomicLevel.High => 25,
            EconomicLevel.MediumHigh => 35,
            EconomicLevel.Medium => 45,
            _ => 60
        };
        
        return baseDays + _faker.Random.Int(-10, 15);
    }

    private int CalculateStockOnMarket(int population, SuburbProfile profile)
    {
        var stockPerCapita = profile.EconomicLevel switch
        {
            EconomicLevel.High => 0.002m,
            EconomicLevel.MediumHigh => 0.003m,
            EconomicLevel.Medium => 0.004m,
            _ => 0.005m
        };
        
        return (int)(population * stockPerCapita) + _faker.Random.Int(-5, 10);
    }

    private decimal CalculateClearanceRate(SuburbProfile profile)
    {
        var baseRate = profile.EconomicLevel switch
        {
            EconomicLevel.High => 0.75m,
            EconomicLevel.MediumHigh => 0.65m,
            EconomicLevel.Medium => 0.55m,
            _ => 0.45m
        };
        
        return baseRate + _faker.Random.Decimal(-0.1m, 0.1m);
    }

    private int CalculateMedianRent(int medianPrice)
    {
        // 租金通常为房价的 3-5%
        var annualRentRatio = _faker.Random.Decimal(0.03m, 0.05m);
        return (int)(medianPrice * annualRentRatio / 52); // 周租金
    }

    private decimal CalculateRentGrowth(SuburbProfile profile)
    {
        var baseGrowth = profile.EconomicLevel switch
        {
            EconomicLevel.High => 0.06m,
            EconomicLevel.MediumHigh => 0.04m,
            EconomicLevel.Medium => 0.03m,
            _ => 0.02m
        };
        
        return baseGrowth + _faker.Random.Decimal(-0.02m, 0.03m);
    }

    private decimal CalculateVacancyRate(SuburbProfile profile)
    {
        var baseRate = profile.EconomicLevel switch
        {
            EconomicLevel.High => 0.02m,
            EconomicLevel.MediumHigh => 0.025m,
            EconomicLevel.Medium => 0.03m,
            _ => 0.035m
        };
        
        return baseRate + _faker.Random.Decimal(-0.01m, 0.015m);
    }

    private decimal CalculateTransportScore(SuburbProfile profile)
    {
        var baseScore = profile.IsCapitalCity ? 8.5m : 
                       profile.IsMajorCity ? 7.0m : 5.5m;
        
        return baseScore + _faker.Random.Decimal(-0.5m, 1.0m);
    }

    private int CalculateSupermarketQuantity(int population)
    {
        // 每 10000 人约 1-2 个超市
        var supermarketsPer10k = _faker.Random.Decimal(1.0m, 2.5m);
        return Math.Max(1, (int)(population / 10000 * supermarketsPer10k));
    }

    private int CalculateHospitalQuantity(int population)
    {
        // 每 50000 人约 1 个医院
        var hospitalsPer50k = _faker.Random.Decimal(0.8m, 1.5m);
        return Math.Max(1, (int)(population / 50000 * hospitalsPer50k));
    }

    private decimal CalculateHospitalDensity(int hospitalQuantity, int population)
    {
        return (decimal)hospitalQuantity / (population / 10000m);
    }

    private decimal CalculateSchoolRating(SuburbProfile profile, bool isPrimary)
    {
        var baseRating = profile.EconomicLevel switch
        {
            EconomicLevel.High => 8.5m,
            EconomicLevel.MediumHigh => 7.5m,
            EconomicLevel.Medium => 6.5m,
            _ => 5.5m
        };
        
        // 中学通常评分略低
        if (!isPrimary) baseRating -= 0.5m;
        
        return baseRating + _faker.Random.Decimal(-0.5m, 0.8m);
    }

    private int CalculateDevProjectsCount(int population, SuburbProfile profile)
    {
        var projectsPer10k = profile.DevelopmentLevel switch
        {
            DevelopmentLevel.High => 2.0m,
            DevelopmentLevel.Medium => 1.0m,
            _ => 0.5m
        };
        
        return Math.Max(0, (int)(population / 10000 * projectsPer10k));
    }

    private int CalculateBuildingApprovals(int population, SuburbProfile profile)
    {
        var approvalsPer1k = profile.DevelopmentLevel switch
        {
            DevelopmentLevel.High => 0.5m,
            DevelopmentLevel.Medium => 0.3m,
            _ => 0.2m
        };
        
        return Math.Max(10, (int)(population / 1000 * approvalsPer1k));
    }

    private decimal CalculateDemandSupplyRatio(SuburbProfile profile)
    {
        var baseRatio = profile.EconomicLevel switch
        {
            EconomicLevel.High => 1.3m,
            EconomicLevel.MediumHigh => 1.1m,
            EconomicLevel.Medium => 0.9m,
            _ => 0.8m
        };
        
        return baseRatio + _faker.Random.Decimal(-0.2m, 0.3m);
    }

    private decimal CalculateRentersRatio(SuburbProfile profile)
    {
        var baseRatio = profile.EconomicLevel switch
        {
            EconomicLevel.High => 0.35m, // 高收入地区自有住房比例高
            EconomicLevel.MediumHigh => 0.45m,
            EconomicLevel.Medium => 0.55m,
            _ => 0.65m
        };
        
        return baseRatio + _faker.Random.Decimal(-0.1m, 0.1m);
    }

    private int CalculateMedianIncome(SuburbProfile profile)
    {
        var baseIncome = profile.EconomicLevel switch
        {
            EconomicLevel.High => 95000,
            EconomicLevel.MediumHigh => 75000,
            EconomicLevel.Medium => 65000,
            _ => 55000
        };
        
        return baseIncome + _faker.Random.Int(-10000, 15000);
    }

    private decimal CalculateEmploymentRate(SuburbProfile profile)
    {
        var baseRate = profile.EconomicLevel switch
        {
            EconomicLevel.High => 0.92m,
            EconomicLevel.MediumHigh => 0.88m,
            EconomicLevel.Medium => 0.85m,
            _ => 0.82m
        };
        
        return baseRate + _faker.Random.Decimal(-0.03m, 0.02m);
    }

    private decimal CalculateWhiteCollarRatio(SuburbProfile profile)
    {
        var baseRatio = profile.EconomicLevel switch
        {
            EconomicLevel.High => 0.65m,
            EconomicLevel.MediumHigh => 0.55m,
            EconomicLevel.Medium => 0.45m,
            _ => 0.35m
        };
        
        return baseRatio + _faker.Random.Decimal(-0.1m, 0.1m);
    }

    private decimal CalculateJobGrowthRate(SuburbProfile profile)
    {
        var baseGrowth = profile.EconomicLevel switch
        {
            EconomicLevel.High => 0.04m,
            EconomicLevel.MediumHigh => 0.03m,
            EconomicLevel.Medium => 0.02m,
            _ => 0.01m
        };
        
        return baseGrowth + _faker.Random.Decimal(-0.02m, 0.03m);
    }

    private decimal CalculateCrimeRate(SuburbProfile profile)
    {
        var baseRate = profile.EconomicLevel switch
        {
            EconomicLevel.High => 2.5m, // 高收入地区犯罪率通常较低
            EconomicLevel.MediumHigh => 3.5m,
            EconomicLevel.Medium => 4.5m,
            _ => 5.5m
        };
        
        return baseRate + _faker.Random.Decimal(-1.0m, 2.0m);
    }

    private decimal CalculateAffordabilityScore(SuburbProfile profile)
    {
        // 经济水平越高，可负担性通常越低
        var baseScore = profile.EconomicLevel switch
        {
            EconomicLevel.High => 4.0m,
            EconomicLevel.MediumHigh => 5.5m,
            EconomicLevel.Medium => 7.0m,
            _ => 8.5m
        };
        
        return baseScore + _faker.Random.Decimal(-1.0m, 1.0m);
    }

    private decimal CalculateGrowthPotentialScore(SuburbProfile profile)
    {
        var baseScore = profile.EconomicLevel switch
        {
            EconomicLevel.High => 7.5m, // 已发展地区增长潜力相对较低
            EconomicLevel.MediumHigh => 8.0m,
            EconomicLevel.Medium => 8.5m,
            _ => 7.0m // 低发展地区风险也高
        };
        
        return baseScore + _faker.Random.Decimal(-1.0m, 1.0m);
    }

    #endregion
}

/// <summary>
/// Suburb 特征档案
/// </summary>
public class SuburbProfile
{
    public bool IsMajorCity { get; set; }
    public bool IsCapitalCity { get; set; }
    public decimal StateFactor { get; set; }
    public decimal PostcodeFactor { get; set; }
    public int PopulationBase { get; set; }
    public EconomicLevel EconomicLevel { get; set; }
    public DevelopmentLevel DevelopmentLevel { get; set; }
}

public enum EconomicLevel
{
    Low,
    MediumLow,
    Medium,
    MediumHigh,
    High
}

public enum DevelopmentLevel
{
    Low,
    Medium,
    High
}
