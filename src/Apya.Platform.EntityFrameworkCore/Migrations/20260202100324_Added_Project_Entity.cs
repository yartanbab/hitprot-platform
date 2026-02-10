using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Added_Project_Entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstimatedBudget",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "AppProjects");

            migrationBuilder.RenameColumn(
                name: "IsGrantEligible",
                table: "AppProjects",
                newName: "IsApproved");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "AppProjects",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "AppProjects",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "GrantId",
                table: "AppProjects",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "AppProjects",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "AppProjects",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppProjects_GrantId",
                table: "AppProjects",
                column: "GrantId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppProjects_AppGrants_GrantId",
                table: "AppProjects",
                column: "GrantId",
                principalTable: "AppGrants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppProjects_AppGrants_GrantId",
                table: "AppProjects");

            migrationBuilder.DropIndex(
                name: "IX_AppProjects_GrantId",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "GrantId",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppProjects");

            migrationBuilder.RenameColumn(
                name: "IsApproved",
                table: "AppProjects",
                newName: "IsGrantEligible");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "AppProjects",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<decimal>(
                name: "EstimatedBudget",
                table: "AppProjects",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "AppProjects",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
