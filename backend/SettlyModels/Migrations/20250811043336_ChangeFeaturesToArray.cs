using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SettlyModels.Migrations
{
    /// <inheritdoc />
    public partial class ChangeFeaturesToArray : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. change type
            migrationBuilder.Sql(
                @"ALTER TABLE ""Properties"" 
          ALTER COLUMN ""Features"" TYPE text[] 
          USING string_to_array(""Features"", ',');"
            );

            // 2. set not null
            migrationBuilder.Sql(
                @"ALTER TABLE ""Properties"" 
          ALTER COLUMN ""Features"" SET NOT NULL;"
            );
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // 1.roll back null
            migrationBuilder.Sql(
                @"ALTER TABLE ""Properties"" 
          ALTER COLUMN ""Features"" TYPE text 
          USING array_to_string(""Features"", ',');"
            );

            // 2. set not null
            migrationBuilder.Sql(
                @"ALTER TABLE ""Properties"" 
          ALTER COLUMN ""Features"" SET NOT NULL;"
            );
        }

    }
}
