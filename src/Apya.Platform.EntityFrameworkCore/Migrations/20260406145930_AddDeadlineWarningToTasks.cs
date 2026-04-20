using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddDeadlineWarningToTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppProjectSubTasks");

            migrationBuilder.DropTable(
                name: "AppProjectTaskComments");

            migrationBuilder.DropTable(
                name: "AppProjectTasks");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeadlineWarningSent",
                table: "AppTasks",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_ProjectId",
                table: "AppTasks",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_Status_AssigneeId",
                table: "AppTasks",
                columns: new[] { "Status", "AssigneeId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppTasks_ProjectId",
                table: "AppTasks");

            migrationBuilder.DropIndex(
                name: "IX_AppTasks_Status_AssigneeId",
                table: "AppTasks");

            migrationBuilder.DropColumn(
                name: "IsDeadlineWarningSent",
                table: "AppTasks");

            migrationBuilder.CreateTable(
                name: "AppProjectTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AssigneeId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeleterId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Priority = table.Column<int>(type: "int", nullable: false),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false)
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

            migrationBuilder.CreateTable(
                name: "AppProjectSubTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeleterId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ProjectTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppProjectSubTasks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppProjectSubTasks_AppProjectTasks_ProjectTaskId",
                        column: x => x.ProjectTaskId,
                        principalTable: "AppProjectTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppProjectTaskComments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeleterId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ProjectTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppProjectTaskComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppProjectTaskComments_AppProjectTasks_ProjectTaskId",
                        column: x => x.ProjectTaskId,
                        principalTable: "AppProjectTasks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectSubTasks_ProjectTaskId",
                table: "AppProjectSubTasks",
                column: "ProjectTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectTaskComments_ProjectTaskId",
                table: "AppProjectTaskComments",
                column: "ProjectTaskId");

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectTasks_ProjectId",
                table: "AppProjectTasks",
                column: "ProjectId");
        }
    }
}
