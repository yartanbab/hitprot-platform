using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class GrantApplicationWizard : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CurrentStep",
                table: "AppGrantApplications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PendingParty",
                table: "AppGrantApplications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProjectDurationMonths",
                table: "AppGrantApplications",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectSummary",
                table: "AppGrantApplications",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectTitle",
                table: "AppGrantApplications",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubmittedAt",
                table: "AppGrantApplications",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppGrantApplicationBudgetLines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    GrantApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Kind = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Justification = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
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
                    table.PrimaryKey("PK_AppGrantApplicationBudgetLines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppGrantApplicationBudgetLines_AppGrantApplications_GrantApplicationId",
                        column: x => x.GrantApplicationId,
                        principalTable: "AppGrantApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppGrantApplicationFieldLocks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    GrantApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FieldKey = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    OwnerUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    OwnerName = table.Column<string>(type: "nvarchar(96)", maxLength: 96, nullable: false),
                    AcquiredAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastActivityAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TakeoverRequestedByUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    TakeoverRequestedByName = table.Column<string>(type: "nvarchar(96)", maxLength: 96, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppGrantApplicationFieldLocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppGrantApplicationFieldLocks_AppGrantApplications_GrantApplicationId",
                        column: x => x.GrantApplicationId,
                        principalTable: "AppGrantApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppGrantApplicationMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    GrantApplicationId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SenderUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SenderName = table.Column<string>(type: "nvarchar(96)", maxLength: 96, nullable: false),
                    SenderRole = table.Column<int>(type: "int", nullable: false),
                    Body = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppGrantApplicationMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppGrantApplicationMessages_AppGrantApplications_GrantApplicationId",
                        column: x => x.GrantApplicationId,
                        principalTable: "AppGrantApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantApplicationBudgetLines_GrantApplicationId_Kind",
                table: "AppGrantApplicationBudgetLines",
                columns: new[] { "GrantApplicationId", "Kind" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantApplicationFieldLocks_GrantApplicationId_FieldKey",
                table: "AppGrantApplicationFieldLocks",
                columns: new[] { "GrantApplicationId", "FieldKey" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantApplicationMessages_GrantApplicationId_CreationTime",
                table: "AppGrantApplicationMessages",
                columns: new[] { "GrantApplicationId", "CreationTime" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppGrantApplicationBudgetLines");

            migrationBuilder.DropTable(
                name: "AppGrantApplicationFieldLocks");

            migrationBuilder.DropTable(
                name: "AppGrantApplicationMessages");

            migrationBuilder.DropColumn(
                name: "CurrentStep",
                table: "AppGrantApplications");

            migrationBuilder.DropColumn(
                name: "PendingParty",
                table: "AppGrantApplications");

            migrationBuilder.DropColumn(
                name: "ProjectDurationMonths",
                table: "AppGrantApplications");

            migrationBuilder.DropColumn(
                name: "ProjectSummary",
                table: "AppGrantApplications");

            migrationBuilder.DropColumn(
                name: "ProjectTitle",
                table: "AppGrantApplications");

            migrationBuilder.DropColumn(
                name: "SubmittedAt",
                table: "AppGrantApplications");
        }
    }
}
