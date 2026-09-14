using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class GrantInterestIdeaDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DurationAndPartners",
                table: "AppGrantInterests",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlannedActivities",
                table: "AppGrantInterests",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PriorExperience",
                table: "AppGrantInterests",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProblemStatement",
                table: "AppGrantInterests",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Stakeholders",
                table: "AppGrantInterests",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupportNeeds",
                table: "AppGrantInterests",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TargetAudience",
                table: "AppGrantInterests",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TeamStructure",
                table: "AppGrantInterests",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DurationAndPartners",
                table: "AppGrantInterests");

            migrationBuilder.DropColumn(
                name: "PlannedActivities",
                table: "AppGrantInterests");

            migrationBuilder.DropColumn(
                name: "PriorExperience",
                table: "AppGrantInterests");

            migrationBuilder.DropColumn(
                name: "ProblemStatement",
                table: "AppGrantInterests");

            migrationBuilder.DropColumn(
                name: "Stakeholders",
                table: "AppGrantInterests");

            migrationBuilder.DropColumn(
                name: "SupportNeeds",
                table: "AppGrantInterests");

            migrationBuilder.DropColumn(
                name: "TargetAudience",
                table: "AppGrantInterests");

            migrationBuilder.DropColumn(
                name: "TeamStructure",
                table: "AppGrantInterests");
        }
    }
}
