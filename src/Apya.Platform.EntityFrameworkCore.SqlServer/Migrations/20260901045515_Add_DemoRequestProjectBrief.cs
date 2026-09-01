using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_DemoRequestProjectBrief : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BudgetRange",
                table: "AppDemoRequests",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExpectedOutcomes",
                table: "AppDemoRequests",
                type: "nvarchar(1500)",
                maxLength: 1500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlannedActivities",
                table: "AppDemoRequests",
                type: "nvarchar(1500)",
                maxLength: 1500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProblemStatement",
                table: "AppDemoRequests",
                type: "nvarchar(1500)",
                maxLength: 1500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TargetAudience",
                table: "AppDemoRequests",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BudgetRange",
                table: "AppDemoRequests");

            migrationBuilder.DropColumn(
                name: "ExpectedOutcomes",
                table: "AppDemoRequests");

            migrationBuilder.DropColumn(
                name: "PlannedActivities",
                table: "AppDemoRequests");

            migrationBuilder.DropColumn(
                name: "ProblemStatement",
                table: "AppDemoRequests");

            migrationBuilder.DropColumn(
                name: "TargetAudience",
                table: "AppDemoRequests");
        }
    }
}
