using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Precision_ProjectCode_DigestFlag : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "TotalBudget",
                table: "AppProjects",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<decimal>(
                name: "HourlyRate",
                table: "AppProjects",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<decimal>(
                name: "Amount",
                table: "AppPayments",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AddColumn<bool>(
                name: "Digest",
                table: "AppNotificationPreferences",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            // NTF-09: Bayrak ayrılmadan önce e-postası açık olan herkes özeti de alıyordu;
            // kimsenin tercihi sessizce değişmesin diye yeni kolon eskisinden kopyalanır.
            migrationBuilder.Sql("UPDATE \"AppNotificationPreferences\" SET \"Digest\" = \"Email\";");

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAmount",
                table: "AppInvoices",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<decimal>(
                name: "TaxRate",
                table: "AppInvoices",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<decimal>(
                name: "UnitPrice",
                table: "AppInvoiceItems",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.AlterColumn<decimal>(
                name: "Quantity",
                table: "AppInvoiceItems",
                type: "numeric(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");

            migrationBuilder.CreateIndex(
                name: "IX_AppProjects_Code_Host",
                table: "AppProjects",
                column: "Code",
                unique: true,
                filter: "\"TenantId\" IS NULL AND \"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppProjects_TenantId_Code",
                table: "AppProjects",
                columns: new[] { "TenantId", "Code" },
                unique: true,
                filter: "\"TenantId\" IS NOT NULL AND \"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantIdeaInvitations_GrantCallId",
                table: "AppGrantIdeaInvitations",
                column: "GrantCallId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppProjects_Code_Host",
                table: "AppProjects");

            migrationBuilder.DropIndex(
                name: "IX_AppProjects_TenantId_Code",
                table: "AppProjects");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantIdeaInvitations_GrantCallId",
                table: "AppGrantIdeaInvitations");

            migrationBuilder.DropColumn(
                name: "Digest",
                table: "AppNotificationPreferences");

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalBudget",
                table: "AppProjects",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "HourlyRate",
                table: "AppProjects",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Amount",
                table: "AppPayments",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "TotalAmount",
                table: "AppInvoices",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "TaxRate",
                table: "AppInvoices",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "UnitPrice",
                table: "AppInvoiceItems",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");

            migrationBuilder.AlterColumn<decimal>(
                name: "Quantity",
                table: "AppInvoiceItems",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric(18,2)");
        }
    }
}
