using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddFxLedgerFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DonorCurrency",
                table: "AppProjects",
                type: "character varying(3)",
                maxLength: 3,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "FixedDonorRate",
                table: "AppProjects",
                type: "numeric(18,6)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FxPolicy",
                table: "AppProjects",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "BookAmount",
                table: "AppIncomeEntries",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "BookRate",
                table: "AppIncomeEntries",
                type: "numeric(18,6)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "DonorAmount",
                table: "AppIncomeEntries",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DonorRate",
                table: "AppIncomeEntries",
                type: "numeric(18,6)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RateLocked",
                table: "AppIncomeEntries",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "BookAmount",
                table: "AppExpenses",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "BookRate",
                table: "AppExpenses",
                type: "numeric(18,6)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "DonorAmount",
                table: "AppExpenses",
                type: "numeric(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DonorRate",
                table: "AppExpenses",
                type: "numeric(18,6)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RateLocked",
                table: "AppExpenses",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            // GERIYE DONUK DOLDURMA: bu degisiklikten onceki TUM kayitlar TRY.
            // BookAmount varsayilani 0 gelirse eski kayitlar "₺ defterde 0" gorunur
            // ve Gelir-Gider toplamlari sessizce yanlis olur. BookRate icin de ayni:
            // 0 kur, sonraki her hesaplamayi bozardi.
            migrationBuilder.Sql(@"UPDATE ""AppExpenses"" SET ""BookAmount"" = ""Amount"", ""BookRate"" = 1;");
            migrationBuilder.Sql(@"UPDATE ""AppIncomeEntries"" SET ""BookAmount"" = ""Amount"", ""BookRate"" = 1;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DonorCurrency",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "FixedDonorRate",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "FxPolicy",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "BookAmount",
                table: "AppIncomeEntries");

            migrationBuilder.DropColumn(
                name: "BookRate",
                table: "AppIncomeEntries");

            migrationBuilder.DropColumn(
                name: "DonorAmount",
                table: "AppIncomeEntries");

            migrationBuilder.DropColumn(
                name: "DonorRate",
                table: "AppIncomeEntries");

            migrationBuilder.DropColumn(
                name: "RateLocked",
                table: "AppIncomeEntries");

            migrationBuilder.DropColumn(
                name: "BookAmount",
                table: "AppExpenses");

            migrationBuilder.DropColumn(
                name: "BookRate",
                table: "AppExpenses");

            migrationBuilder.DropColumn(
                name: "DonorAmount",
                table: "AppExpenses");

            migrationBuilder.DropColumn(
                name: "DonorRate",
                table: "AppExpenses");

            migrationBuilder.DropColumn(
                name: "RateLocked",
                table: "AppExpenses");
        }
    }
}
