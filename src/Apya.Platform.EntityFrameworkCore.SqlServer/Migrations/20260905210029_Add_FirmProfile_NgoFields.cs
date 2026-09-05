using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_FirmProfile_NgoFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProfessionalStaffBand",
                table: "AppFirmProfiles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProjectExperience",
                table: "AppFirmProfiles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegistryNumber",
                table: "AppFirmProfiles",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxNumber",
                table: "AppFirmProfiles",
                type: "nvarchar(16)",
                maxLength: 16,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxOffice",
                table: "AppFirmProfiles",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Type",
                table: "AppFirmProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfessionalStaffBand",
                table: "AppFirmProfiles");

            migrationBuilder.DropColumn(
                name: "ProjectExperience",
                table: "AppFirmProfiles");

            migrationBuilder.DropColumn(
                name: "RegistryNumber",
                table: "AppFirmProfiles");

            migrationBuilder.DropColumn(
                name: "TaxNumber",
                table: "AppFirmProfiles");

            migrationBuilder.DropColumn(
                name: "TaxOffice",
                table: "AppFirmProfiles");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "AppFirmProfiles");
        }
    }
}
