using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class GrantMeetingProposals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppGrantMeetingProposals",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    GrantInterestId = table.Column<Guid>(type: "uuid", nullable: false),
                    GrantCallId = table.Column<Guid>(type: "uuid", nullable: false),
                    ProposedByUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    Slot1 = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Slot2 = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Slot3 = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ConfirmedSlot = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    HostNote = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    AnsweredByUserId = table.Column<Guid>(type: "uuid", nullable: true),
                    AnsweredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
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
                    table.PrimaryKey("PK_AppGrantMeetingProposals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppGrantMeetingProposals_AppGrantInterests_GrantInterestId",
                        column: x => x.GrantInterestId,
                        principalTable: "AppGrantInterests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantMeetingProposals_GrantInterestId_Status",
                table: "AppGrantMeetingProposals",
                columns: new[] { "GrantInterestId", "Status" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppGrantMeetingProposals");
        }
    }
}
