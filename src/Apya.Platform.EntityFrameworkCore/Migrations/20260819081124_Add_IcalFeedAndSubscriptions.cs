using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_IcalFeedAndSubscriptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppCalendarFeedTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    TokenHash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    TokenProtected = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    LastAccessedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppCalendarFeedTokens", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppIcalSubscriptions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Url = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Color = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    RefreshMinutes = table.Column<int>(type: "integer", nullable: false),
                    IsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LastFetchedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastEventCount = table.Column<int>(type: "integer", nullable: false),
                    LastError = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppIcalSubscriptions", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppCalendarFeedTokens_TokenHash",
                table: "AppCalendarFeedTokens",
                column: "TokenHash",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppCalendarFeedTokens_UserId",
                table: "AppCalendarFeedTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppIcalSubscriptions_UserId",
                table: "AppIcalSubscriptions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppCalendarFeedTokens");

            migrationBuilder.DropTable(
                name: "AppIcalSubscriptions");
        }
    }
}
