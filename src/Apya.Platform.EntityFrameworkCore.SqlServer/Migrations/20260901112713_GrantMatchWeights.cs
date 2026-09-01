using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class GrantMatchWeights : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppGrantMatchWeights",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    GrantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    SectorMultiplier = table.Column<double>(type: "float", nullable: false),
                    TechnicalMaturityMultiplier = table.Column<double>(type: "float", nullable: false),
                    RdStaffMultiplier = table.Column<double>(type: "float", nullable: false),
                    RegionMultiplier = table.Column<double>(type: "float", nullable: false),
                    ProjectHistoryMultiplier = table.Column<double>(type: "float", nullable: false),
                    KeywordMultiplier = table.Column<double>(type: "float", nullable: false),
                    SizePenaltyEnabled = table.Column<bool>(type: "bit", nullable: false),
                    SkipMissingDimensions = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_AppGrantMatchWeights", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppGrantMatchWeights_AppGrants_GrantId",
                        column: x => x.GrantId,
                        principalTable: "AppGrants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantMatchWeights_GrantId",
                table: "AppGrantMatchWeights",
                column: "GrantId",
                unique: true,
                filter: "[GrantId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppGrantMatchWeights");
        }
    }
}
