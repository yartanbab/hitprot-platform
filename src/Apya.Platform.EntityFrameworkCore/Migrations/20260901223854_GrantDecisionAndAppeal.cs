using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class GrantDecisionAndAppeal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppGrantDecisions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    GrantApplicationId = table.Column<Guid>(type: "uuid", nullable: false),
                    Outcome = table.Column<int>(type: "integer", nullable: false),
                    DecidedOn = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReferenceNo = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    AppealDeadline = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AppealSubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AppealAccepted = table.Column<bool>(type: "boolean", nullable: true),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppGrantDecisions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppGrantDecisions_AppGrantApplications_GrantApplicationId",
                        column: x => x.GrantApplicationId,
                        principalTable: "AppGrantApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppGrantAppealItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    DecisionId = table.Column<Guid>(type: "uuid", nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    InstitutionText = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    OpinionSummary = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    OpinionDetail = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    Stance = table.Column<int>(type: "integer", nullable: false),
                    OpinionByName = table.Column<string>(type: "character varying(96)", maxLength: 96, nullable: true),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uuid", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppGrantAppealItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppGrantAppealItems_AppGrantDecisions_DecisionId",
                        column: x => x.DecisionId,
                        principalTable: "AppGrantDecisions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantAppealItems_DecisionId_Order",
                table: "AppGrantAppealItems",
                columns: new[] { "DecisionId", "Order" });

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantDecisions_GrantApplicationId",
                table: "AppGrantDecisions",
                column: "GrantApplicationId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppGrantAppealItems");

            migrationBuilder.DropTable(
                name: "AppGrantDecisions");
        }
    }
}
