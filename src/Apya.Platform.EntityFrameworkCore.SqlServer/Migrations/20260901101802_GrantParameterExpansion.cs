using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class GrantParameterExpansion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasAdvancePayment",
                table: "AppGrants",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MaxCompanyAgeYears",
                table: "AppGrants",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MaxRevenue",
                table: "AppGrants",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxTrl",
                table: "AppGrants",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinCompanyAgeYears",
                table: "AppGrants",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinConsortiumPartners",
                table: "AppGrants",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinRdStaffCount",
                table: "AppGrants",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MinRevenue",
                table: "AppGrants",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinStaffCount",
                table: "AppGrants",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinTrl",
                table: "AppGrants",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "PrefersFemaleEntrepreneur",
                table: "AppGrants",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "PrefersYoungEntrepreneur",
                table: "AppGrants",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ProjectDurationMonths",
                table: "AppGrants",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RepaymentType",
                table: "AppGrants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresConsortium",
                table: "AppGrants",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresGuaranteeLetter",
                table: "AppGrants",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SourceUrl",
                table: "AppGrants",
                type: "nvarchar(512)",
                maxLength: 512,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SupportRatePercent",
                table: "AppGrants",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AnnualRevenue",
                table: "AppFirmProfiles",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FoundedOn",
                table: "AppFirmProfiles",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HasConsortiumPartner",
                table: "AppFirmProfiles",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RdStaffCount",
                table: "AppFirmProfiles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StaffCount",
                table: "AppFirmProfiles",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Trl",
                table: "AppFirmProfiles",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppGrantEligibleCostItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    GrantId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Kind = table.Column<int>(type: "int", nullable: false),
                    LimitPercent = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_AppGrantEligibleCostItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppGrantEligibleCostItems_AppGrants_GrantId",
                        column: x => x.GrantId,
                        principalTable: "AppGrants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantEligibleCostItems_GrantId_Kind",
                table: "AppGrantEligibleCostItems",
                columns: new[] { "GrantId", "Kind" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppGrantEligibleCostItems");

            migrationBuilder.DropColumn(
                name: "HasAdvancePayment",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "MaxCompanyAgeYears",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "MaxRevenue",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "MaxTrl",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "MinCompanyAgeYears",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "MinConsortiumPartners",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "MinRdStaffCount",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "MinRevenue",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "MinStaffCount",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "MinTrl",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "PrefersFemaleEntrepreneur",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "PrefersYoungEntrepreneur",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "ProjectDurationMonths",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "RepaymentType",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "RequiresConsortium",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "RequiresGuaranteeLetter",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "SourceUrl",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "SupportRatePercent",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "AnnualRevenue",
                table: "AppFirmProfiles");

            migrationBuilder.DropColumn(
                name: "FoundedOn",
                table: "AppFirmProfiles");

            migrationBuilder.DropColumn(
                name: "HasConsortiumPartner",
                table: "AppFirmProfiles");

            migrationBuilder.DropColumn(
                name: "RdStaffCount",
                table: "AppFirmProfiles");

            migrationBuilder.DropColumn(
                name: "StaffCount",
                table: "AppFirmProfiles");

            migrationBuilder.DropColumn(
                name: "Trl",
                table: "AppFirmProfiles");
        }
    }
}
