using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class GrantLeads : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppGrantLeads",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GrantCallId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FirmName = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    ContactName = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    ContactTitle = table.Column<string>(type: "nvarchar(96)", maxLength: 96, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(160)", maxLength: 160, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: true),
                    Size = table.Column<int>(type: "int", nullable: true),
                    CompanyAgeYears = table.Column<int>(type: "int", nullable: true),
                    Sector = table.Column<string>(type: "nvarchar(96)", maxLength: 96, nullable: true),
                    RdStaffCount = table.Column<int>(type: "int", nullable: true),
                    Trl = table.Column<int>(type: "int", nullable: true),
                    AnnualRevenue = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    HasConsortiumPartner = table.Column<bool>(type: "bit", nullable: true),
                    PassedRuleCount = table.Column<int>(type: "int", nullable: false),
                    TotalRuleCount = table.Column<int>(type: "int", nullable: false),
                    MatchScore = table.Column<int>(type: "int", nullable: false),
                    HeatScore = table.Column<int>(type: "int", nullable: false),
                    EstimatedSupport = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: true),
                    Difficulty = table.Column<int>(type: "int", nullable: false),
                    SignalCodes = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    PreferredMeetingAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ConvertedTenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IpAddress = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true),
                    UserAgent = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
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
                    table.PrimaryKey("PK_AppGrantLeads", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantLeads_GrantCallId",
                table: "AppGrantLeads",
                column: "GrantCallId");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantLeads_IpAddress_CreationTime",
                table: "AppGrantLeads",
                columns: new[] { "IpAddress", "CreationTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantLeads_Status_HeatScore",
                table: "AppGrantLeads",
                columns: new[] { "Status", "HeatScore" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppGrantLeads");
        }
    }
}
