using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class FinanceCoveringIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppInvoices_TenantId_Status",
                table: "AppInvoices");

            migrationBuilder.DropIndex(
                name: "IX_AppIncomeEntries_TenantId_IncomeDate",
                table: "AppIncomeEntries");

            migrationBuilder.DropIndex(
                name: "IX_AppExpenses_TenantId_ExpenseDate",
                table: "AppExpenses");

            migrationBuilder.DropIndex(
                name: "IX_AppCashMovements_TenantId_CashAccountId_MovementDate",
                table: "AppCashMovements");

            migrationBuilder.CreateIndex(
                name: "IX_AppInvoices_TenantId_InvoiceDate",
                table: "AppInvoices",
                columns: new[] { "TenantId", "InvoiceDate" },
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_AppInvoices_TenantId_Status",
                table: "AppInvoices",
                columns: new[] { "TenantId", "Status" })
                .Annotation("SqlServer:Include", new[] { "TotalAmount", "ProjectId", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_AppIncomeEntries_TenantId_IncomeDate",
                table: "AppIncomeEntries",
                columns: new[] { "TenantId", "IncomeDate" })
                .Annotation("SqlServer:Include", new[] { "ProjectId", "Amount", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_AppExpenses_TenantId_ExpenseDate",
                table: "AppExpenses",
                columns: new[] { "TenantId", "ExpenseDate" })
                .Annotation("SqlServer:Include", new[] { "ProjectId", "Amount", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_AppCashMovements_TenantId_CashAccountId_MovementDate",
                table: "AppCashMovements",
                columns: new[] { "TenantId", "CashAccountId", "MovementDate" })
                .Annotation("SqlServer:Include", new[] { "Direction", "Amount", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_AppCashMovements_TenantId_MovementDate",
                table: "AppCashMovements",
                columns: new[] { "TenantId", "MovementDate" },
                filter: "[IsDeleted] = 0")
                .Annotation("SqlServer:Include", new[] { "CashAccountId", "Direction", "Amount" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppInvoices_TenantId_InvoiceDate",
                table: "AppInvoices");

            migrationBuilder.DropIndex(
                name: "IX_AppInvoices_TenantId_Status",
                table: "AppInvoices");

            migrationBuilder.DropIndex(
                name: "IX_AppIncomeEntries_TenantId_IncomeDate",
                table: "AppIncomeEntries");

            migrationBuilder.DropIndex(
                name: "IX_AppExpenses_TenantId_ExpenseDate",
                table: "AppExpenses");

            migrationBuilder.DropIndex(
                name: "IX_AppCashMovements_TenantId_CashAccountId_MovementDate",
                table: "AppCashMovements");

            migrationBuilder.DropIndex(
                name: "IX_AppCashMovements_TenantId_MovementDate",
                table: "AppCashMovements");

            migrationBuilder.CreateIndex(
                name: "IX_AppInvoices_TenantId_Status",
                table: "AppInvoices",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_AppIncomeEntries_TenantId_IncomeDate",
                table: "AppIncomeEntries",
                columns: new[] { "TenantId", "IncomeDate" });

            migrationBuilder.CreateIndex(
                name: "IX_AppExpenses_TenantId_ExpenseDate",
                table: "AppExpenses",
                columns: new[] { "TenantId", "ExpenseDate" });

            migrationBuilder.CreateIndex(
                name: "IX_AppCashMovements_TenantId_CashAccountId_MovementDate",
                table: "AppCashMovements",
                columns: new[] { "TenantId", "CashAccountId", "MovementDate" });
        }
    }
}
