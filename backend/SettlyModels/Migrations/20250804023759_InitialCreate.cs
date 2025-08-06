using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace SettlyModels.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Suburbs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    State = table.Column<string>(type: "text", nullable: false),
                    Postcode = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Suburbs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SuperFunds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Return1Y = table.Column<decimal>(type: "numeric", nullable: false),
                    Return3Y = table.Column<decimal>(type: "numeric", nullable: false),
                    Return5Y = table.Column<decimal>(type: "numeric", nullable: false),
                    Return10Y = table.Column<decimal>(type: "numeric", nullable: false),
                    Fee = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SuperFunds", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    PasswordHash = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HousingMarkets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SuburbId = table.Column<int>(type: "integer", nullable: false),
                    RentalYield = table.Column<decimal>(type: "numeric", nullable: false),
                    MedianPrice = table.Column<int>(type: "integer", nullable: false),
                    PriceGrowth3Yr = table.Column<decimal>(type: "numeric", nullable: false),
                    DaysOnMarket = table.Column<int>(type: "integer", nullable: false),
                    StockOnMarket = table.Column<int>(type: "integer", nullable: false),
                    ClearanceRate = table.Column<decimal>(type: "numeric", nullable: false),
                    MedianRent = table.Column<int>(type: "integer", nullable: false),
                    RentGrowth12M = table.Column<decimal>(type: "numeric", nullable: false),
                    VacancyRate = table.Column<decimal>(type: "numeric", nullable: false),
                    Population = table.Column<int>(type: "integer", nullable: false),
                    PopulationGrowthRate = table.Column<decimal>(type: "numeric", nullable: false),
                    SnapshotDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HousingMarkets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HousingMarkets_Suburbs_SuburbId",
                        column: x => x.SuburbId,
                        principalTable: "Suburbs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IncomeEmployments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SuburbId = table.Column<int>(type: "integer", nullable: false),
                    MedianIncome = table.Column<int>(type: "integer", nullable: false),
                    EmploymentRate = table.Column<decimal>(type: "numeric", nullable: false),
                    WhiteCollarRatio = table.Column<decimal>(type: "numeric", nullable: false),
                    JobGrowthRate = table.Column<decimal>(type: "numeric", nullable: false),
                    SnapshotDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IncomeEmployments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IncomeEmployments_Suburbs_SuburbId",
                        column: x => x.SuburbId,
                        principalTable: "Suburbs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Livabilities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SuburbId = table.Column<int>(type: "integer", nullable: false),
                    TransportScore = table.Column<decimal>(type: "numeric", nullable: false),
                    SupermarketQuantity = table.Column<int>(type: "integer", nullable: false),
                    HospitalQuantity = table.Column<int>(type: "integer", nullable: false),
                    PrimarySchoolRating = table.Column<decimal>(type: "numeric", nullable: false),
                    SecondarySchoolRating = table.Column<decimal>(type: "numeric", nullable: false),
                    HospitalDensity = table.Column<decimal>(type: "numeric", nullable: false),
                    SnapshotDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Livabilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Livabilities_Suburbs_SuburbId",
                        column: x => x.SuburbId,
                        principalTable: "Suburbs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PolicyRules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SuburbId = table.Column<int>(type: "integer", nullable: true),
                    State = table.Column<string>(type: "text", nullable: false),
                    RuleType = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Eligibility = table.Column<string>(type: "text", nullable: false),
                    Link = table.Column<string>(type: "text", nullable: false),
                    EffectiveDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PolicyRules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PolicyRules_Suburbs_SuburbId",
                        column: x => x.SuburbId,
                        principalTable: "Suburbs",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "PopulationSupplies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SuburbId = table.Column<int>(type: "integer", nullable: false),
                    RentersRatio = table.Column<decimal>(type: "numeric", nullable: false),
                    DemandSupplyRatio = table.Column<decimal>(type: "numeric", nullable: false),
                    BuildingApprovals12M = table.Column<int>(type: "integer", nullable: false),
                    SnapshotDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DevProjectsCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PopulationSupplies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PopulationSupplies_Suburbs_SuburbId",
                        column: x => x.SuburbId,
                        principalTable: "Suburbs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Properties",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SuburbId = table.Column<int>(type: "integer", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    PropertyType = table.Column<string>(type: "text", nullable: false),
                    Bedrooms = table.Column<int>(type: "integer", nullable: false),
                    Bathrooms = table.Column<int>(type: "integer", nullable: false),
                    CarSpaces = table.Column<int>(type: "integer", nullable: false),
                    Price = table.Column<int>(type: "integer", nullable: false),
                    InternalArea = table.Column<int>(type: "integer", nullable: false),
                    LandSize = table.Column<int>(type: "integer", nullable: false),
                    YearBuilt = table.Column<int>(type: "integer", nullable: false),
                    Features = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Properties", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Properties_Suburbs_SuburbId",
                        column: x => x.SuburbId,
                        principalTable: "Suburbs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RiskDevelopments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SuburbId = table.Column<int>(type: "integer", nullable: false),
                    CrimeRate = table.Column<decimal>(type: "numeric", nullable: false),
                    SnapshotDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RiskDevelopments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RiskDevelopments_Suburbs_SuburbId",
                        column: x => x.SuburbId,
                        principalTable: "Suburbs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SettlyAIScores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SuburbId = table.Column<int>(type: "integer", nullable: false),
                    AffordabilityScore = table.Column<decimal>(type: "numeric", nullable: false),
                    GrowthPotentialScore = table.Column<decimal>(type: "numeric", nullable: false),
                    SnapshotDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SettlyAIScores", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SettlyAIScores_Suburbs_SuburbId",
                        column: x => x.SuburbId,
                        principalTable: "Suburbs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChatLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    IsUser = table.Column<bool>(type: "boolean", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChatLogs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SuperProjectionInputs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    CurrentBalance = table.Column<int>(type: "integer", nullable: false),
                    Salary = table.Column<int>(type: "integer", nullable: false),
                    CurrentAge = table.Column<int>(type: "integer", nullable: false),
                    RetirementAge = table.Column<int>(type: "integer", nullable: false),
                    EmployerContributionRate = table.Column<decimal>(type: "numeric", nullable: false),
                    UseFhss = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SuperProjectionInputs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SuperProjectionInputs_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Favourites",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Favourites", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Favourites_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Favourites_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "InspectionPlans",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    ScheduledTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Note = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InspectionPlans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InspectionPlans_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InspectionPlans_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LoanCalculations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    DepositAmount = table.Column<int>(type: "integer", nullable: false),
                    LoanAmount = table.Column<int>(type: "integer", nullable: false),
                    InterestRate = table.Column<decimal>(type: "numeric", nullable: false),
                    LoanTermYears = table.Column<int>(type: "integer", nullable: false),
                    RepaymentType = table.Column<string>(type: "text", nullable: false),
                    Income = table.Column<int>(type: "integer", nullable: false),
                    MonthlyRepayment = table.Column<int>(type: "integer", nullable: false),
                    TotalInterest = table.Column<int>(type: "integer", nullable: false),
                    TotalCost = table.Column<int>(type: "integer", nullable: false),
                    RepaymentToIncomeRatio = table.Column<decimal>(type: "numeric", nullable: false),
                    StampDuty = table.Column<int>(type: "integer", nullable: false),
                    LegalFees = table.Column<int>(type: "integer", nullable: false),
                    InspectionFees = table.Column<int>(type: "integer", nullable: false),
                    ApplicationFee = table.Column<int>(type: "integer", nullable: false),
                    OtherUpfrontCosts = table.Column<int>(type: "integer", nullable: false),
                    StressInterestRate = table.Column<decimal>(type: "numeric", nullable: false),
                    StressMonthlyRepayment = table.Column<int>(type: "integer", nullable: false),
                    StressResultNote = table.Column<string>(type: "text", nullable: false),
                    FixedMonthly = table.Column<int>(type: "integer", nullable: false),
                    VariableMonthly = table.Column<int>(type: "integer", nullable: false),
                    DifferenceNote = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoanCalculations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_LoanCalculations_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_LoanCalculations_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SuperProjectionInsights",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InputId = table.Column<int>(type: "integer", nullable: false),
                    SummaryNote = table.Column<string>(type: "text", nullable: false),
                    RecommendationNote = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SuperProjectionInsights", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SuperProjectionInsights_SuperProjectionInputs_InputId",
                        column: x => x.InputId,
                        principalTable: "SuperProjectionInputs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SuperProjectionResults",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    InputId = table.Column<int>(type: "integer", nullable: false),
                    ProjectedBalanceAtRetirement = table.Column<int>(type: "integer", nullable: false),
                    BalanceWithFhss = table.Column<int>(type: "integer", nullable: false),
                    BalanceWithoutFhss = table.Column<int>(type: "integer", nullable: false),
                    NetDifference = table.Column<int>(type: "integer", nullable: false),
                    FhssWithdrawableAmount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SuperProjectionResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SuperProjectionResults_SuperProjectionInputs_InputId",
                        column: x => x.InputId,
                        principalTable: "SuperProjectionInputs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserFundSelections",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    InputId = table.Column<int>(type: "integer", nullable: false),
                    FundId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFundSelections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserFundSelections_SuperFunds_FundId",
                        column: x => x.FundId,
                        principalTable: "SuperFunds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFundSelections_SuperProjectionInputs_InputId",
                        column: x => x.InputId,
                        principalTable: "SuperProjectionInputs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFundSelections_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatLogs_UserId",
                table: "ChatLogs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Favourites_PropertyId",
                table: "Favourites",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_Favourites_UserId",
                table: "Favourites",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_HousingMarkets_SuburbId",
                table: "HousingMarkets",
                column: "SuburbId");

            migrationBuilder.CreateIndex(
                name: "IX_IncomeEmployments_SuburbId",
                table: "IncomeEmployments",
                column: "SuburbId");

            migrationBuilder.CreateIndex(
                name: "IX_InspectionPlans_PropertyId",
                table: "InspectionPlans",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_InspectionPlans_UserId",
                table: "InspectionPlans",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Livabilities_SuburbId",
                table: "Livabilities",
                column: "SuburbId");

            migrationBuilder.CreateIndex(
                name: "IX_LoanCalculations_PropertyId",
                table: "LoanCalculations",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_LoanCalculations_UserId",
                table: "LoanCalculations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PolicyRules_SuburbId",
                table: "PolicyRules",
                column: "SuburbId");

            migrationBuilder.CreateIndex(
                name: "IX_PopulationSupplies_SuburbId",
                table: "PopulationSupplies",
                column: "SuburbId");

            migrationBuilder.CreateIndex(
                name: "IX_Properties_SuburbId",
                table: "Properties",
                column: "SuburbId");

            migrationBuilder.CreateIndex(
                name: "IX_RiskDevelopments_SuburbId",
                table: "RiskDevelopments",
                column: "SuburbId");

            migrationBuilder.CreateIndex(
                name: "IX_SettlyAIScores_SuburbId",
                table: "SettlyAIScores",
                column: "SuburbId");

            migrationBuilder.CreateIndex(
                name: "IX_SuperProjectionInputs_UserId",
                table: "SuperProjectionInputs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SuperProjectionInsights_InputId",
                table: "SuperProjectionInsights",
                column: "InputId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SuperProjectionResults_InputId",
                table: "SuperProjectionResults",
                column: "InputId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserFundSelections_FundId",
                table: "UserFundSelections",
                column: "FundId");

            migrationBuilder.CreateIndex(
                name: "IX_UserFundSelections_InputId",
                table: "UserFundSelections",
                column: "InputId");

            migrationBuilder.CreateIndex(
                name: "IX_UserFundSelections_UserId",
                table: "UserFundSelections",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatLogs");

            migrationBuilder.DropTable(
                name: "Favourites");

            migrationBuilder.DropTable(
                name: "HousingMarkets");

            migrationBuilder.DropTable(
                name: "IncomeEmployments");

            migrationBuilder.DropTable(
                name: "InspectionPlans");

            migrationBuilder.DropTable(
                name: "Livabilities");

            migrationBuilder.DropTable(
                name: "LoanCalculations");

            migrationBuilder.DropTable(
                name: "PolicyRules");

            migrationBuilder.DropTable(
                name: "PopulationSupplies");

            migrationBuilder.DropTable(
                name: "RiskDevelopments");

            migrationBuilder.DropTable(
                name: "SettlyAIScores");

            migrationBuilder.DropTable(
                name: "SuperProjectionInsights");

            migrationBuilder.DropTable(
                name: "SuperProjectionResults");

            migrationBuilder.DropTable(
                name: "UserFundSelections");

            migrationBuilder.DropTable(
                name: "Properties");

            migrationBuilder.DropTable(
                name: "SuperFunds");

            migrationBuilder.DropTable(
                name: "SuperProjectionInputs");

            migrationBuilder.DropTable(
                name: "Suburbs");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
