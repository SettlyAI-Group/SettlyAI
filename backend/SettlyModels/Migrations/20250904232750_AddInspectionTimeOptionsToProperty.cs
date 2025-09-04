using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SettlyModels.Migrations
{
    /// <inheritdoc />
    public partial class AddInspectionTimeOptionsToProperty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "InspectionTimeOptions",
                table: "Properties",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InspectionTimeOptions",
                table: "Properties");
        }
    }
}
