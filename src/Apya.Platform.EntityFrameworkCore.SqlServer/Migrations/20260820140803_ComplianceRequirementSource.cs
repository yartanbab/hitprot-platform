using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class ComplianceRequirementSource : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Source",
                table: "AppComplianceRequirements",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<Guid>(
                name: "SourceEntityId",
                table: "AppComplianceRequirements",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppComplianceRequirements_SourceEntityId",
                table: "AppComplianceRequirements",
                column: "SourceEntityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppComplianceRequirements_SourceEntityId",
                table: "AppComplianceRequirements");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "AppComplianceRequirements");

            migrationBuilder.DropColumn(
                name: "SourceEntityId",
                table: "AppComplianceRequirements");
        }
    }
}
