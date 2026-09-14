using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class GrantInterestReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AssignedUserId",
                table: "AppGrantInterests",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConsultantNote",
                table: "AppGrantInterests",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AssignedUserId",
                table: "AppGrantInterests");

            migrationBuilder.DropColumn(
                name: "ConsultantNote",
                table: "AppGrantInterests");
        }
    }
}
