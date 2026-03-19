using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddCalendarModules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppCalendarSyncMappings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ExternalEventId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ExternalCalendarAccountId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    LastSyncedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ExternalETag = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppCalendarSyncMappings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppExternalCalendarAccounts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Provider = table.Column<int>(type: "int", nullable: false),
                    ExternalEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    AccessToken = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RefreshToken = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TokenExpiryTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsSyncEnabled = table.Column<bool>(type: "bit", nullable: false),
                    ExternalSyncToken = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastSyncTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppExternalCalendarAccounts", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppCalendarSyncMappings_ExternalEventId",
                table: "AppCalendarSyncMappings",
                column: "ExternalEventId");

            migrationBuilder.CreateIndex(
                name: "IX_AppCalendarSyncMappings_TaskId_ExternalCalendarAccountId",
                table: "AppCalendarSyncMappings",
                columns: new[] { "TaskId", "ExternalCalendarAccountId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppExternalCalendarAccounts_UserId_Provider",
                table: "AppExternalCalendarAccounts",
                columns: new[] { "UserId", "Provider" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppCalendarSyncMappings");

            migrationBuilder.DropTable(
                name: "AppExternalCalendarAccounts");
        }
    }
}
