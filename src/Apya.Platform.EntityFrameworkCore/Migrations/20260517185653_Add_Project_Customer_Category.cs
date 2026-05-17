using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_Project_Customer_Category : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Category",
                table: "AppProjects",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "CustomerId",
                table: "AppProjects",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppProjects_CustomerId",
                table: "AppProjects",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_AppProjects_TenantId_Category",
                table: "AppProjects",
                columns: new[] { "TenantId", "Category" });

            migrationBuilder.AddForeignKey(
                name: "FK_AppProjects_AppCustomers_CustomerId",
                table: "AppProjects",
                column: "CustomerId",
                principalTable: "AppCustomers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppProjects_AppCustomers_CustomerId",
                table: "AppProjects");

            migrationBuilder.DropIndex(
                name: "IX_AppProjects_CustomerId",
                table: "AppProjects");

            migrationBuilder.DropIndex(
                name: "IX_AppProjects_TenantId_Category",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "AppProjects");
        }
    }
}
