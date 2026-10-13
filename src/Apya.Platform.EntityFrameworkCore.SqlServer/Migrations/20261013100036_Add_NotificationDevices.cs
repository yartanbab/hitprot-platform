using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_NotificationDevices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Push",
                table: "AppNotificationPreferences",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.CreateTable(
                name: "AppNotificationDevices",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Platform = table.Column<int>(type: "int", nullable: false),
                    Endpoint = table.Column<string>(type: "nvarchar(1024)", maxLength: 1024, nullable: false),
                    EndpointHash = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    P256dh = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Auth = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    DeviceLabel = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    LastSeenAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastSuccessAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastFailureAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FailureCount = table.Column<int>(type: "int", nullable: false),
                    DeactivationReason = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
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
                    table.PrimaryKey("PK_AppNotificationDevices", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppNotificationDevices_EndpointHash",
                table: "AppNotificationDevices",
                column: "EndpointHash");

            migrationBuilder.CreateIndex(
                name: "IX_AppNotificationDevices_UserId_EndpointHash",
                table: "AppNotificationDevices",
                columns: new[] { "UserId", "EndpointHash" },
                unique: true,
                filter: "[IsDeleted] = 0");

            migrationBuilder.CreateIndex(
                name: "IX_AppNotificationDevices_UserId_IsActive",
                table: "AppNotificationDevices",
                columns: new[] { "UserId", "IsActive" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppNotificationDevices");

            migrationBuilder.DropColumn(
                name: "Push",
                table: "AppNotificationPreferences");
        }
    }
}
