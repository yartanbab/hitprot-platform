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
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    GrantInterestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    GrantCallId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProposedByUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Slot1 = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Slot2 = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Slot3 = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ConfirmedSlot = table.Column<DateTime>(type: "datetime2", nullable: true),
                    HostNote = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    AnsweredByUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    AnsweredAt = table.Column<DateTime>(type: "datetime2", nullable: true),
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
