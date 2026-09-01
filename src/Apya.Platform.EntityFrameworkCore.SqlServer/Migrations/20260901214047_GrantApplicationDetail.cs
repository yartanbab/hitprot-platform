using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class GrantApplicationDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "SuccessFeePercent",
                table: "AppGrantApplications",
                type: "decimal(5,2)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppGrantApplicationActivities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    GrantApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Kind = table.Column<int>(type: "int", nullable: false),
                    ActorUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ActorName = table.Column<string>(type: "nvarchar(96)", maxLength: 96, nullable: false),
                    ActorRole = table.Column<int>(type: "int", nullable: false),
                    Context = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppGrantApplicationActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppGrantApplicationActivities_AppGrantApplications_GrantApplicationId",
                        column: x => x.GrantApplicationId,
                        principalTable: "AppGrantApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppGrantConsultingLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    GrantApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(96)", maxLength: 96, nullable: false),
                    WorkDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Hours = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    Note = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppGrantConsultingLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppGrantConsultingLogs_AppGrantApplications_GrantApplicationId",
                        column: x => x.GrantApplicationId,
                        principalTable: "AppGrantApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantApplicationActivities_GrantApplicationId_CreationTime",
                table: "AppGrantApplicationActivities",
                columns: new[] { "GrantApplicationId", "CreationTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantConsultingLogs_GrantApplicationId_WorkDate",
                table: "AppGrantConsultingLogs",
                columns: new[] { "GrantApplicationId", "WorkDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppGrantApplicationActivities");

            migrationBuilder.DropTable(
                name: "AppGrantConsultingLogs");

            migrationBuilder.DropColumn(
                name: "SuccessFeePercent",
                table: "AppGrantApplications");
        }
    }
}
