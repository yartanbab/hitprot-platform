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
                .Annotation("Npgsql:IndexInclude", new[] { "TenantId", "Status", "IsPrivate", "IsDeleted" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_TenantId_AssigneeId_DueDate",
                table: "AppTasks",
                columns: new[] { "TenantId", "AssigneeId", "DueDate" },
                filter: "\"IsDeleted\" = false")
                .Annotation("Npgsql:IndexInclude", new[] { "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_TenantId_DueDate",
                table: "AppTasks",
                columns: new[] { "TenantId", "DueDate" },
                filter: "\"IsDeleted\" = false")
                .Annotation("Npgsql:IndexInclude", new[] { "Status", "AssigneeId", "ProjectId", "IsPrivate", "CreatorId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_TenantId_Status_AssigneeId",
                table: "AppTasks",
                columns: new[] { "TenantId", "Status", "AssigneeId" })
                .Annotation("Npgsql:IndexInclude", new[] { "ProjectId", "DueDate", "IsPrivate", "CreatorId" });
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
