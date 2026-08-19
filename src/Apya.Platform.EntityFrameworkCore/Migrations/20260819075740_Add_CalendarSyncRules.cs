using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_CalendarSyncRules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ConflictRule",
                table: "AppExternalCalendarAccounts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "SyncProjectIds",
                table: "AppExternalCalendarAccounts",
                type: "character varying(2048)",
                maxLength: 2048,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SyncSources",
                table: "AppExternalCalendarAccounts",
                type: "character varying(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "AppCalendarSyncLogEntries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    ExternalCalendarAccountId = table.Column<Guid>(type: "uuid", nullable: false),
                    Kind = table.Column<int>(type: "integer", nullable: false),
                    Message = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    ItemCount = table.Column<int>(type: "integer", nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppCalendarSyncLogEntries", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppCalendarSyncLogEntries_ExternalCalendarAccountId_Creatio~",
                table: "AppCalendarSyncLogEntries",
                columns: new[] { "ExternalCalendarAccountId", "CreationTime" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppCalendarSyncLogEntries");

            migrationBuilder.DropColumn(
                name: "ConflictRule",
                table: "AppExternalCalendarAccounts");

            migrationBuilder.DropColumn(
                name: "SyncProjectIds",
                table: "AppExternalCalendarAccounts");

            migrationBuilder.DropColumn(
                name: "SyncSources",
                table: "AppExternalCalendarAccounts");
        }
    }
}
