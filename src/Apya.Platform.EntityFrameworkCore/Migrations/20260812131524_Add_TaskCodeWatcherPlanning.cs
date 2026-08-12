using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_TaskCodeWatcherPlanning : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "EstimatedHours",
                table: "AppTasks",
                type: "numeric(9,2)",
                precision: 9,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Number",
                table: "AppTasks",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Sprint",
                table: "AppTasks",
                type: "character varying(32)",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaskType",
                table: "AppTasks",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppTaskWatchers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TaskId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppTaskWatchers", x => x.Id);
                });

            /* Mevcut görevlere sıra numarası ata — aksi halde hepsi 0 kalır ve
               kullanıcıya "GRV-—" görünür. Yumuşak-silinmiş satırlar da numaralanır:
               numara geri dönüşüme girmemeli, silinen görevin kodu başkasına verilmemeli.
               Tenant başına ayrı sayaç (PARTITION BY "TenantId"). */
            migrationBuilder.Sql("""
                WITH numbered AS (
                    SELECT "Id", ROW_NUMBER() OVER (PARTITION BY "TenantId" ORDER BY "CreationTime", "Id") AS rn
                    FROM "AppTasks"
                )
                UPDATE "AppTasks" t SET "Number" = n.rn FROM numbered n WHERE t."Id" = n."Id";
                """);

            migrationBuilder.CreateIndex(
                name: "IX_AppTasks_TenantId_Number",
                table: "AppTasks",
                columns: new[] { "TenantId", "Number" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskWatchers_TaskId",
                table: "AppTaskWatchers",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskWatchers_UserId_TaskId",
                table: "AppTaskWatchers",
                columns: new[] { "UserId", "TaskId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppTaskWatchers");

            migrationBuilder.DropIndex(
                name: "IX_AppTasks_TenantId_Number",
                table: "AppTasks");

            migrationBuilder.DropColumn(
                name: "EstimatedHours",
                table: "AppTasks");

            migrationBuilder.DropColumn(
                name: "Number",
                table: "AppTasks");

            migrationBuilder.DropColumn(
                name: "Sprint",
                table: "AppTasks");

            migrationBuilder.DropColumn(
                name: "TaskType",
                table: "AppTasks");
        }
    }
}
