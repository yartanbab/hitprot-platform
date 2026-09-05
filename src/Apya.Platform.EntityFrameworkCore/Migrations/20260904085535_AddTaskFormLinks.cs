using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddTaskFormLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TaskId",
                table: "AppResponses",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TaskShareLinkId",
                table: "AppResponses",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppTaskFormLinks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    TaskId = table.Column<Guid>(type: "uuid", nullable: false),
                    DocumentId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsGuestFillable = table.Column<bool>(type: "boolean", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppTaskFormLinks", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppResponses_TaskId_DocumentId",
                table: "AppResponses",
                columns: new[] { "TaskId", "DocumentId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskFormLinks_DocumentId",
                table: "AppTaskFormLinks",
                column: "DocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskFormLinks_TaskId_DocumentId",
                table: "AppTaskFormLinks",
                columns: new[] { "TaskId", "DocumentId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppTaskFormLinks");

            migrationBuilder.DropIndex(
                name: "IX_AppResponses_TaskId_DocumentId",
                table: "AppResponses");

            migrationBuilder.DropColumn(
                name: "TaskId",
                table: "AppResponses");

            migrationBuilder.DropColumn(
                name: "TaskShareLinkId",
                table: "AppResponses");
        }
    }
}
