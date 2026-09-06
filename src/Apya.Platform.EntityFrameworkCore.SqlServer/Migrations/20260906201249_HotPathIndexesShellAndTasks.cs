using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class HotPathIndexesShellAndTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppTasks_ProjectId",
                table: "AppTasks");

            migrationBuilder.DropIndex(
                name: "IX_AppTasks_TenantId_Status_AssigneeId",
                table: "AppTasks");

            migrationBuilder.CreateIndex(
                name: "IX_AppWebhookDeliveryLogs_IsSuccess_CreationTime",
                table: "AppWebhookDeliveryLogs",
                columns: new[] { "IsSuccess", "CreationTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_ProjectId",
                table: "AppTasks",
                column: "ProjectId")
                .Annotation("SqlServer:Include", new[] { "TenantId", "Status", "IsPrivate", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_TenantId_AssigneeId_DueDate",
                table: "AppTasks",
                columns: new[] { "TenantId", "AssigneeId", "DueDate" },
                filter: "[IsDeleted] = 0")
                .Annotation("SqlServer:Include", new[] { "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_TenantId_DueDate",
                table: "AppTasks",
                columns: new[] { "TenantId", "DueDate" },
                filter: "[IsDeleted] = 0")
                .Annotation("SqlServer:Include", new[] { "Status", "AssigneeId", "ProjectId", "IsPrivate", "CreatorId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_TenantId_Status_AssigneeId",
                table: "AppTasks",
                columns: new[] { "TenantId", "Status", "AssigneeId" })
                .Annotation("SqlServer:Include", new[] { "ProjectId", "DueDate", "IsPrivate", "CreatorId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppWebhookDeliveryLogs_IsSuccess_CreationTime",
                table: "AppWebhookDeliveryLogs");

            migrationBuilder.DropIndex(
                name: "IX_AppTasks_ProjectId",
                table: "AppTasks");

            migrationBuilder.DropIndex(
                name: "IX_AppTasks_TenantId_AssigneeId_DueDate",
                table: "AppTasks");

            migrationBuilder.DropIndex(
                name: "IX_AppTasks_TenantId_DueDate",
                table: "AppTasks");

            migrationBuilder.DropIndex(
                name: "IX_AppTasks_TenantId_Status_AssigneeId",
                table: "AppTasks");

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_ProjectId",
                table: "AppTasks",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_TenantId_Status_AssigneeId",
                table: "AppTasks",
                columns: new[] { "TenantId", "Status", "AssigneeId" });
        }
    }
}
