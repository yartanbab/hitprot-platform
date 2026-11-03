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
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresWetSignature",
                table: "AppGrantDocumentRequirements",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "EmptyFieldCount",
                table: "AppGrantApplicationDocumentVersions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasDigitalSignature",
                table: "AppGrantApplicationDocumentVersions",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "LooksScanned",
                table: "AppGrantApplicationDocumentVersions",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresStamp",
                table: "AppGrantApplicationDocuments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresWetSignature",
                table: "AppGrantApplicationDocuments",
                type: "bit",
                nullable: false,
                defaultValue: false);

            // Var olan satırlar: şart bugüne dek yalnız adda yazıyordu ("imzalı-kaşeli").
            // 🔴 GrantDocumentSignatureRules ile aynı kural; "e-imza" ıslak imza sayılmaz.
            // EXEC: betik (script) olarak üretilince UPDATE, ALTER ile aynı yığında derlenip
            // yeni kolonu bulamıyordu.
            foreach (var table in new[] { "AppGrantDocumentRequirements", "AppGrantApplicationDocuments" })
            {
                migrationBuilder.Sql($"""
                    EXEC(N'UPDATE [{table}] SET [RequiresStamp] = 1
                    WHERE [Name] LIKE N''%kaşe%'' OR [Name] LIKE N''%mühür%''');
                    """);
                migrationBuilder.Sql($"""
                    EXEC(N'UPDATE [{table}] SET [RequiresWetSignature] = 1
                    WHERE REPLACE(REPLACE([Name], N''elektronik imza'', N''''), N''e-imza'', N'''') LIKE N''%mza%''');
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
