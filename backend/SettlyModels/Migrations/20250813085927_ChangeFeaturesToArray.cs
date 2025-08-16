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
            migrationBuilder.DropForeignKey(
                name: "FK_Favourites_Properties_PropertyId",
                table: "Favourites");

            // First drop the default constraint if exists
            migrationBuilder.Sql(@"ALTER TABLE ""Properties"" ALTER COLUMN ""Features"" DROP DEFAULT;");
            
            // Convert string to array using PostgreSQL USING clause
            migrationBuilder.Sql(@"ALTER TABLE ""Properties"" ALTER COLUMN ""Features"" TYPE text[] USING string_to_array(""Features"", ',');");

            migrationBuilder.AlterColumn<int>(
                name: "PropertyId",
                table: "Favourites",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<string>(
                name: "Notes",
                table: "Favourites",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "Favourites",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TargetId",
                table: "Favourites",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "TargetType",
                table: "Favourites",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_Favourites_Properties_PropertyId",
                table: "Favourites",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Favourites_Properties_PropertyId",
                table: "Favourites");

            migrationBuilder.DropColumn(
                name: "Notes",
                table: "Favourites");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "Favourites");

            migrationBuilder.DropColumn(
                name: "TargetId",
                table: "Favourites");

            migrationBuilder.DropColumn(
                name: "TargetType",
                table: "Favourites");

            migrationBuilder.AlterColumn<string>(
                name: "Features",
                table: "Properties",
                type: "text",
                nullable: false,
                oldClrType: typeof(string[]),
                oldType: "text[]");

            migrationBuilder.AlterColumn<int>(
                name: "PropertyId",
                table: "Favourites",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Favourites_Properties_PropertyId",
                table: "Favourites",
                column: "PropertyId",
                principalTable: "Properties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
