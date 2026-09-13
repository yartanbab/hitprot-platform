using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class GrantInterestProposal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "EstimatedBudget",
                table: "AppGrantInterests",
                type: "numeric(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "NeedsPartner",
                table: "AppGrantInterests",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PartnerName",
                table: "AppGrantInterests",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TargetStartDate",
                table: "AppGrantInterests",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "WithdrawnAt",
                table: "AppGrantInterests",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstimatedBudget",
                table: "AppGrantInterests");

            migrationBuilder.DropColumn(
                name: "NeedsPartner",
                table: "AppGrantInterests");

            migrationBuilder.DropColumn(
                name: "PartnerName",
                table: "AppGrantInterests");

            migrationBuilder.DropColumn(
                name: "TargetStartDate",
                table: "AppGrantInterests");

            migrationBuilder.DropColumn(
                name: "WithdrawnAt",
                table: "AppGrantInterests");
        }
    }
}
