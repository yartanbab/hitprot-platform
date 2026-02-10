using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Added_ProjectTask : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppProjectAnalyses_AppProjects_ProjectId",
                table: "AppProjectAnalyses");

            migrationBuilder.DropIndex(
                name: "IX_AppProjectAnalyses_ProjectId",
                table: "AppProjectAnalyses");

            migrationBuilder.DropColumn(
                name: "Deadline",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "MaxSupportAmount",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "SupportRate",
                table: "AppGrants");

            migrationBuilder.RenameColumn(
                name: "Agency",
                table: "AppGrants",
                newName: "Issuer");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "AppProjects",
                type: "nvarchar(32)",
                maxLength: 32,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<int>(
                name: "MinMatchScore",
                table: "AppGrants",
                type: "int",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AddColumn<decimal>(
                name: "MaxAmount",
                table: "AppGrants",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "AppProjectTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
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
                    table.PrimaryKey("PK_AppProjectTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppProjectTasks_AppProjects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "AppProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectTasks_ProjectId",
                table: "AppProjectTasks",
                column: "ProjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppProjectTasks");

            migrationBuilder.DropColumn(
                name: "MaxAmount",
                table: "AppGrants");

            migrationBuilder.RenameColumn(
                name: "Issuer",
                table: "AppGrants",
                newName: "Agency");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "AppProjects",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<double>(
                name: "MinMatchScore",
                table: "AppGrants",
                type: "float",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<DateTime>(
                name: "Deadline",
                table: "AppGrants",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "AppGrants",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MaxSupportAmount",
                table: "AppGrants",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "SupportRate",
                table: "AppGrants",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectAnalyses_ProjectId",
                table: "AppProjectAnalyses",
                column: "ProjectId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AppProjectAnalyses_AppProjects_ProjectId",
                table: "AppProjectAnalyses",
                column: "ProjectId",
                principalTable: "AppProjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
