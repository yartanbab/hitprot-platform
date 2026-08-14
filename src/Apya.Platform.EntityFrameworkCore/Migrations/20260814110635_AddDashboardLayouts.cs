using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddDashboardLayouts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppDashboardLayouts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ViewKey = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    CardsJson = table.Column<string>(type: "character varying(8000)", maxLength: 8000, nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppDashboardLayouts", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppDashboardLayouts_UserId_ViewKey",
                table: "AppDashboardLayouts",
                columns: new[] { "UserId", "ViewKey" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppDashboardLayouts");
        }
    }
}
