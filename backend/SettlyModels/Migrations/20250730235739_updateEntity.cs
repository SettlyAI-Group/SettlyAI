using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SettlyModels.Migrations
{
    /// <inheritdoc />
    public partial class updateEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DevProjectsCount",
                table: "RiskDevelopments");

            migrationBuilder.DropColumn(
                name: "LandSupply",
                table: "PopulationSupplies");

            migrationBuilder.DropColumn(
                name: "DistHospital",
                table: "Livabilities");

            migrationBuilder.DropColumn(
                name: "DistSupermarket",
                table: "Livabilities");

            migrationBuilder.RenameColumn(
                name: "PopulationGrowthRate",
                table: "PopulationSupplies",
                newName: "DemandSupplyRatio");

            migrationBuilder.RenameColumn(
                name: "Population",
                table: "PopulationSupplies",
                newName: "DevProjectsCount");

            migrationBuilder.AddColumn<int>(
                name: "HospitalQuantity",
                table: "Livabilities",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SupermarketQuantity",
                table: "Livabilities",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Population",
                table: "HousingMarkets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "PopulationGrowthRate",
                table: "HousingMarkets",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HospitalQuantity",
                table: "Livabilities");

            migrationBuilder.DropColumn(
                name: "SupermarketQuantity",
                table: "Livabilities");

            migrationBuilder.DropColumn(
                name: "Population",
                table: "HousingMarkets");

            migrationBuilder.DropColumn(
                name: "PopulationGrowthRate",
                table: "HousingMarkets");

            migrationBuilder.RenameColumn(
                name: "DevProjectsCount",
                table: "PopulationSupplies",
                newName: "Population");

            migrationBuilder.RenameColumn(
                name: "DemandSupplyRatio",
                table: "PopulationSupplies",
                newName: "PopulationGrowthRate");

            migrationBuilder.AddColumn<int>(
                name: "DevProjectsCount",
                table: "RiskDevelopments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "LandSupply",
                table: "PopulationSupplies",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "DistHospital",
                table: "Livabilities",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "DistSupermarket",
                table: "Livabilities",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }
    }
}
