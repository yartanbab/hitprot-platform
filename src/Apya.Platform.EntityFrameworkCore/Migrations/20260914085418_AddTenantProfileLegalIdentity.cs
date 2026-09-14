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
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LegalName",
                table: "AppTenantProfiles",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LegalRepresentativeEmail",
                table: "AppTenantProfiles",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LegalRepresentativeTitle",
                table: "AppTenantProfiles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            // Önceden açılmış hesaplar: bu dört bilgi yalnız hesabı açan kayıt talebinde
            // duruyordu — bir kez oradan taşınır. Talebi olmayan (host'un elle açtığı)
            // hesapta unvanın en yakın karşılığı kiracı adıdır; kurum sonradan düzeltir.
            migrationBuilder.Sql(@"
                UPDATE ""AppTenantProfiles"" AS p SET
                    ""LegalName"" = r.""CompanyName"",
                    ""LegalRepresentativeTitle"" = r.""AuthorizedTitle"",
                    ""LegalRepresentativeEmail"" = r.""Email"",
                    ""EmployeeCount"" = r.""CompanySize""
                FROM ""AppRegistrationRequests"" AS r
                WHERE r.""TenantId"" = p.""TenantId"";

                UPDATE ""AppTenantProfiles"" AS p SET ""LegalName"" = t.""Name""
                FROM ""AbpTenants"" AS t
                WHERE t.""Id"" = p.""TenantId"" AND p.""LegalName"" = '';");
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
