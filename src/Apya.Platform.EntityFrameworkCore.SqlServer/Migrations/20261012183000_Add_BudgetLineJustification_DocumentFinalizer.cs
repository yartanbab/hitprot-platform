using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_BudgetLineJustification_DocumentFinalizer : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Justification",
                table: "AppProjectBudgetLines",
                type: "nvarchar(512)",
                maxLength: 512,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FinalizedAt",
                table: "AppDocumentFiles",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "FinalizedByUserId",
                table: "AppDocumentFiles",
                type: "uniqueidentifier",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Justification",
                table: "AppProjectBudgetLines");

            migrationBuilder.DropColumn(
                name: "FinalizedAt",
                table: "AppDocumentFiles");

            migrationBuilder.DropColumn(
                name: "FinalizedByUserId",
                table: "AppDocumentFiles");
        }
    }
}
