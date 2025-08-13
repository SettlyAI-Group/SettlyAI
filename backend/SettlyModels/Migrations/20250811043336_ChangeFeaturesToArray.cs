using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SettlyModels.Migrations
{
    /// <inheritdoc />
    public partial class ChangeFeaturesToArray : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string[]>(
                name: "Features",
                table: "Properties",
                type: "text[]",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.Sql(
    @"ALTER TABLE ""Properties"" ALTER COLUMN ""Features"" TYPE text[] USING string_to_array(""Features"", ',');"
);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Features",
                table: "Properties",
                type: "text",
                nullable: false,
                oldClrType: typeof(string[]),
                oldType: "text[]");
            migrationBuilder.Sql(
    @"ALTER TABLE ""Properties"" ALTER COLUMN ""Features"" TYPE text USING array_to_string(""Features"", ',');"
);
        }
    }
}
