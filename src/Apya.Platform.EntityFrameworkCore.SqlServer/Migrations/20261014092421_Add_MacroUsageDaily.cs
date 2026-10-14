using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_MacroUsageDaily : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppMacroUsageDaily",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MacroKey = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Day = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Count = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppMacroUsageDaily", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppMacroUsageDaily_Day",
                table: "AppMacroUsageDaily",
                column: "Day");

            migrationBuilder.CreateIndex(
                name: "IX_AppMacroUsageDaily_TenantId_UserId_MacroKey_Day",
                table: "AppMacroUsageDaily",
                columns: new[] { "TenantId", "UserId", "MacroKey", "Day" },
                unique: true,
                filter: "[TenantId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppMacroUsageDaily");
        }
    }
}
