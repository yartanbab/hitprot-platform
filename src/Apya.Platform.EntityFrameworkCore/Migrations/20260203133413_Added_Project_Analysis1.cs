using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Added_Project_Analysis1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AiAnalysisResult",
                table: "AppProjectAnalyses");

            migrationBuilder.DropColumn(
                name: "AiLevel",
                table: "AppProjectAnalyses");

            migrationBuilder.DropColumn(
                name: "AnnualTurnover",
                table: "AppProjectAnalyses");

            migrationBuilder.DropColumn(
                name: "CapacityScore",
                table: "AppProjectAnalyses");

            migrationBuilder.DropColumn(
                name: "ComplianceScore",
                table: "AppProjectAnalyses");

            migrationBuilder.DropColumn(
                name: "ConcurrencyStamp",
                table: "AppProjectAnalyses");

            migrationBuilder.DropColumn(
                name: "CreationMethod",
                table: "AppProjectAnalyses");

            migrationBuilder.DropColumn(
                name: "EmployeeCount",
                table: "AppProjectAnalyses");

            migrationBuilder.DropColumn(
                name: "ExportStatus",
                table: "AppProjectAnalyses");

            migrationBuilder.DropColumn(
                name: "FinalScore",
                table: "AppProjectAnalyses");

            migrationBuilder.DropColumn(
                name: "ImpactScore",
                table: "AppProjectAnalyses");

            migrationBuilder.DropColumn(
                name: "ProjectType",
                table: "AppProjectAnalyses");

            migrationBuilder.RenameColumn(
                name: "TechCompetenceLevel",
                table: "AppProjectAnalyses",
                newName: "SuccessScore");

            migrationBuilder.RenameColumn(
                name: "NaceSector",
                table: "AppProjectAnalyses",
                newName: "Summary");

            migrationBuilder.RenameColumn(
                name: "ExtraProperties",
                table: "AppProjectAnalyses",
                newName: "SuggestedTasksJson");

            migrationBuilder.RenameColumn(
                name: "City",
                table: "AppProjectAnalyses",
                newName: "Risks");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Summary",
                table: "AppProjectAnalyses",
                newName: "NaceSector");

            migrationBuilder.RenameColumn(
                name: "SuggestedTasksJson",
                table: "AppProjectAnalyses",
                newName: "ExtraProperties");

            migrationBuilder.RenameColumn(
                name: "SuccessScore",
                table: "AppProjectAnalyses",
                newName: "TechCompetenceLevel");

            migrationBuilder.RenameColumn(
                name: "Risks",
                table: "AppProjectAnalyses",
                newName: "City");

            migrationBuilder.AddColumn<string>(
                name: "AiAnalysisResult",
                table: "AppProjectAnalyses",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AiLevel",
                table: "AppProjectAnalyses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "AnnualTurnover",
                table: "AppProjectAnalyses",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<double>(
                name: "CapacityScore",
                table: "AppProjectAnalyses",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ComplianceScore",
                table: "AppProjectAnalyses",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<string>(
                name: "ConcurrencyStamp",
                table: "AppProjectAnalyses",
                type: "nvarchar(40)",
                maxLength: 40,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CreationMethod",
                table: "AppProjectAnalyses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EmployeeCount",
                table: "AppProjectAnalyses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "ExportStatus",
                table: "AppProjectAnalyses",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<double>(
                name: "FinalScore",
                table: "AppProjectAnalyses",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "ImpactScore",
                table: "AppProjectAnalyses",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "ProjectType",
                table: "AppProjectAnalyses",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
