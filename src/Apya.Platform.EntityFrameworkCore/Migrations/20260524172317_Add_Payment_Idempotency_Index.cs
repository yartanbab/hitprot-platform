using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_Payment_Idempotency_Index : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "AppInvoices",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_AppPayments_TenantId_InvoiceId_ReferenceNumber",
                table: "AppPayments",
                columns: new[] { "TenantId", "InvoiceId", "ReferenceNumber" },
                unique: true,
                filter: "\"ReferenceNumber\" <> ''");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppPayments_TenantId_InvoiceId_ReferenceNumber",
                table: "AppPayments");

            migrationBuilder.AlterColumn<string>(
                name: "Notes",
                table: "AppInvoices",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
