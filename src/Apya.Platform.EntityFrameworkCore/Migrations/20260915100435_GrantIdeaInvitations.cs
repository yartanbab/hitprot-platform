using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class GrantIdeaInvitations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppGrantIdeaInvitations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    GrantCallId = table.Column<Guid>(type: "uuid", nullable: true),
                    Message = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Audience = table.Column<int>(type: "integer", nullable: false),
                    SendEmail = table.Column<bool>(type: "boolean", nullable: false),
                    RemindAfterDays = table.Column<int>(type: "integer", nullable: true),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
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
                    table.PrimaryKey("PK_AppGrantIdeaInvitations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppGrantIdeaInvitationRecipients",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InvitationId = table.Column<Guid>(type: "uuid", nullable: false),
                    FirmTenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    RemindedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppGrantIdeaInvitationRecipients", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppGrantIdeaInvitationRecipients_AppGrantIdeaInvitations_In~",
                        column: x => x.InvitationId,
                        principalTable: "AppGrantIdeaInvitations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantIdeaInvitationRecipients_FirmTenantId",
                table: "AppGrantIdeaInvitationRecipients",
                column: "FirmTenantId");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantIdeaInvitationRecipients_InvitationId_FirmTenantId",
                table: "AppGrantIdeaInvitationRecipients",
                columns: new[] { "InvitationId", "FirmTenantId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantIdeaInvitations_RemindAfterDays_SentAt",
                table: "AppGrantIdeaInvitations",
                columns: new[] { "RemindAfterDays", "SentAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppGrantIdeaInvitationRecipients");

            migrationBuilder.DropTable(
                name: "AppGrantIdeaInvitations");
        }
    }
}
