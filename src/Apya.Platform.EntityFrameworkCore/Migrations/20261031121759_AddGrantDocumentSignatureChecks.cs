using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddGrantDocumentSignatureChecks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "RequiresStamp",
                table: "AppGrantDocumentRequirements",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresWetSignature",
                table: "AppGrantDocumentRequirements",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "EmptyFieldCount",
                table: "AppGrantApplicationDocumentVersions",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasDigitalSignature",
                table: "AppGrantApplicationDocumentVersions",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "LooksScanned",
                table: "AppGrantApplicationDocumentVersions",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresStamp",
                table: "AppGrantApplicationDocuments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresWetSignature",
                table: "AppGrantApplicationDocuments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            // Var olan satırlar: şart bugüne dek yalnız adda yazıyordu ("imzalı-kaşeli").
            // 🔴 GrantDocumentSignatureRules ile aynı kural; "e-imza" ıslak imza sayılmaz.
            foreach (var table in new[] { "AppGrantDocumentRequirements", "AppGrantApplicationDocuments" })
            {
                migrationBuilder.Sql($"""
                    UPDATE "{table}" SET "RequiresStamp" = true
                    WHERE "Name" ILIKE '%kaşe%' OR "Name" ILIKE '%mühür%';
                    """);
                migrationBuilder.Sql($"""
                    UPDATE "{table}" SET "RequiresWetSignature" = true
                    WHERE replace(replace(replace(replace("Name",
                        'elektronik imza', ''), 'Elektronik imza', ''), 'e-imza', ''), 'E-imza', '') ILIKE '%mza%';
                    """);
            }
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequiresStamp",
                table: "AppGrantDocumentRequirements");

            migrationBuilder.DropColumn(
                name: "RequiresWetSignature",
                table: "AppGrantDocumentRequirements");

            migrationBuilder.DropColumn(
                name: "EmptyFieldCount",
                table: "AppGrantApplicationDocumentVersions");

            migrationBuilder.DropColumn(
                name: "HasDigitalSignature",
                table: "AppGrantApplicationDocumentVersions");

            migrationBuilder.DropColumn(
                name: "LooksScanned",
                table: "AppGrantApplicationDocumentVersions");

            migrationBuilder.DropColumn(
                name: "RequiresStamp",
                table: "AppGrantApplicationDocuments");

            migrationBuilder.DropColumn(
                name: "RequiresWetSignature",
                table: "AppGrantApplicationDocuments");
        }
    }
}
