using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddTenantProfileLegalIdentity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EmployeeCount",
                table: "AppTenantProfiles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LegalName",
                table: "AppTenantProfiles",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LegalRepresentativeEmail",
                table: "AppTenantProfiles",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LegalRepresentativeTitle",
                table: "AppTenantProfiles",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            // Önceden açılmış hesaplar: bu dört bilgi yalnız hesabı açan kayıt talebinde
            // duruyordu — bir kez oradan taşınır. Talebi olmayan (host'un elle açtığı)
            // hesapta unvanın en yakın karşılığı kiracı adıdır; kurum sonradan düzeltir.
            migrationBuilder.Sql(@"
                UPDATE p SET
                    p.LegalName = r.CompanyName,
                    p.LegalRepresentativeTitle = r.AuthorizedTitle,
                    p.LegalRepresentativeEmail = r.Email,
                    p.EmployeeCount = r.CompanySize
                FROM AppTenantProfiles p
                INNER JOIN AppRegistrationRequests r ON r.TenantId = p.TenantId;

                UPDATE p SET p.LegalName = t.Name
                FROM AppTenantProfiles p
                INNER JOIN AbpTenants t ON t.Id = p.TenantId
                WHERE p.LegalName = N'';");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmployeeCount",
                table: "AppTenantProfiles");

            migrationBuilder.DropColumn(
                name: "LegalName",
                table: "AppTenantProfiles");

            migrationBuilder.DropColumn(
                name: "LegalRepresentativeEmail",
                table: "AppTenantProfiles");

            migrationBuilder.DropColumn(
                name: "LegalRepresentativeTitle",
                table: "AppTenantProfiles");
        }
    }
}
