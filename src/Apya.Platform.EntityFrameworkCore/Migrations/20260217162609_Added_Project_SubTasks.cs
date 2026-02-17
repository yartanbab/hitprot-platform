using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Added_Project_SubTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppProjects_AppGrants_GrantId",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "AppProjectTasks");

            migrationBuilder.RenameColumn(
                name: "State",
                table: "AppProjectTasks",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "AssignedUserId",
                table: "AppProjectTasks",
                newName: "AssigneeId");

            migrationBuilder.AddColumn<int>(
                name: "Priority",
                table: "AppProjectTasks",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "AppProjectTasks",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "GrantId",
                table: "AppProjects",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.CreateTable(
                name: "AppProjectSubTasks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProjectTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false),
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
                    ProjectTaskId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
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

            migrationBuilder.AddForeignKey(
                name: "FK_AppProjects_AppGrants_GrantId",
                table: "AppProjects",
                column: "GrantId",
                principalTable: "AppGrants",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppProjects_AppGrants_GrantId",
                table: "AppProjects");

            migrationBuilder.DropTable(
                name: "AppProjectSubTasks");

            migrationBuilder.DropTable(
                name: "AppProjectTaskComments");

            migrationBuilder.DropColumn(
                name: "Priority",
                table: "AppProjectTasks");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "AppProjectTasks");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "AppProjectTasks",
                newName: "State");

            migrationBuilder.RenameColumn(
                name: "AssigneeId",
                table: "AppProjectTasks",
                newName: "AssignedUserId");

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "AppProjectTasks",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<Guid>(
                name: "GrantId",
                table: "AppProjects",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AppProjects_AppGrants_GrantId",
                table: "AppProjects",
                column: "GrantId",
                principalTable: "AppGrants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
