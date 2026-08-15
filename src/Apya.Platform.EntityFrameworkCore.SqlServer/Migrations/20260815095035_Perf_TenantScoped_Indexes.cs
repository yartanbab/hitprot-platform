using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Perf_TenantScoped_Indexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppTasks_Status_AssigneeId",
                table: "AppTasks");

            migrationBuilder.DropIndex(
                name: "IX_AppInvoices_Status",
                table: "AppInvoices");

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_TenantId_ParentTaskId",
                table: "AppTasks",
                columns: new[] { "TenantId", "ParentTaskId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_TenantId_Status_AssigneeId",
                table: "AppTasks",
                columns: new[] { "TenantId", "Status", "AssigneeId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppInvoices_TenantId_Status",
                table: "AppInvoices",
                columns: new[] { "TenantId", "Status" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppTasks_TenantId_ParentTaskId",
                table: "AppTasks");

            migrationBuilder.DropIndex(
                name: "IX_AppTasks_TenantId_Status_AssigneeId",
                table: "AppTasks");

            migrationBuilder.DropIndex(
                name: "IX_AppInvoices_TenantId_Status",
                table: "AppInvoices");

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_Status_AssigneeId",
                table: "AppTasks",
                columns: new[] { "Status", "AssigneeId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppInvoices_Status",
                table: "AppInvoices",
                column: "Status");
        }
    }
}
