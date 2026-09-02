using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class GrantApplicationPipelineStep : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AssignedUserId",
                table: "AppGrantApplications",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CurrentStepId",
                table: "AppGrantApplications",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantApplications_CurrentStepId",
                table: "AppGrantApplications",
                column: "CurrentStepId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppGrantApplications_CurrentStepId",
                table: "AppGrantApplications");

            migrationBuilder.DropColumn(
                name: "AssignedUserId",
                table: "AppGrantApplications");

            migrationBuilder.DropColumn(
                name: "CurrentStepId",
                table: "AppGrantApplications");
        }
    }
}
