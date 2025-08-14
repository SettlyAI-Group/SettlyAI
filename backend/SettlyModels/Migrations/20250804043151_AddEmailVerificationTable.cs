using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SettlyModels.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailVerificationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmailVerification_Users_UserId",
                table: "EmailVerification");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EmailVerification",
                table: "EmailVerification");

            migrationBuilder.RenameTable(
                name: "EmailVerification",
                newName: "EmailVerifications");

            migrationBuilder.RenameIndex(
                name: "IX_EmailVerification_UserId",
                table: "EmailVerifications",
                newName: "IX_EmailVerifications_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EmailVerifications",
                table: "EmailVerifications",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EmailVerifications_Users_UserId",
                table: "EmailVerifications",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmailVerifications_Users_UserId",
                table: "EmailVerifications");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EmailVerifications",
                table: "EmailVerifications");

            migrationBuilder.RenameTable(
                name: "EmailVerifications",
                newName: "EmailVerification");

            migrationBuilder.RenameIndex(
                name: "IX_EmailVerifications_UserId",
                table: "EmailVerification",
                newName: "IX_EmailVerification_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EmailVerification",
                table: "EmailVerification",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EmailVerification_Users_UserId",
                table: "EmailVerification",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
