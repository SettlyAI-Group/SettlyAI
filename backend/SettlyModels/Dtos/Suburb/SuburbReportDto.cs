using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SettlyModels.DTOs.Suburb
{
    public class SuburbReportDto
    {
        public int MedianIncome { get; set; }
        public decimal EmploymentRate { get; set; }
        public decimal WhiteCollarRatio { get; set; }
        public decimal JobGrowthRate { get; set; }
        public decimal RentalYield { get; set; }
        public int MedianPrice { get; set; }
        public decimal PriceGrowth3Yr { get; set; }
        public int DaysOnMarket { get; set; }
        public int StockOnMarket { get; set; }
        public decimal ClearanceRate { get; set; }
        public int MedianRent { get; set; }
        public decimal RentGrowth12M { get; set; }
        public decimal VacancyRate { get; set; }
        public int Population { get; set; }
        public decimal PopulationGrowthRate { get; set; }
        public decimal RentersRatio { get; set; }
        public decimal DemandSupplyRatio { get; set; }
        public int BuildingApprovals12M { get; set; }
        public int DevProjectsCount { get; set; }
        public decimal TransportScore { get; set; }
        public int SupermarketQuantity { get; set; }
        public int HospitalQuantity { get; set; }
        public decimal PrimarySchoolRating { get; set; }
        public decimal SecondarySchoolRating { get; set; }
        public decimal HospitalDensity { get; set; }
        public decimal CrimeRate { get; set; }
        public decimal AffordabilityScore { get; set; }
        public decimal GrowthPotentialScore { get; set; }
    }
}
