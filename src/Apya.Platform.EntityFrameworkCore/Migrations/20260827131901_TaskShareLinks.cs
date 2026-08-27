using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class TaskShareLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ShareLinkId",
                table: "AppTaskComments",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVisibleToGuests",
                table: "AppTaskAttachments",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "ShareLinkId",
                table: "AppTaskAttachments",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppTaskShareLinks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    TaskId = table.Column<Guid>(type: "uuid", nullable: false),
                    TokenHash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    RecipientName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    RecipientEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AllowComment = table.Column<bool>(type: "boolean", nullable: false),
                    AllowUpload = table.Column<bool>(type: "boolean", nullable: false),
                    AllowDownload = table.Column<bool>(type: "boolean", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AccessCount = table.Column<int>(type: "integer", nullable: false),
                    UploadCount = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_AppTaskShareLinks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppTaskShareAccessLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    ShareLinkId = table.Column<Guid>(type: "uuid", nullable: false),
                    Action = table.Column<int>(type: "integer", nullable: false),
                    TaskId = table.Column<Guid>(type: "uuid", nullable: true),
                    IpHash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(400)", maxLength: 400, nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppTaskShareAccessLogs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppTaskShareAccessLogs_AppTaskShareLinks_ShareLinkId",
                        column: x => x.ShareLinkId,
                        principalTable: "AppTaskShareLinks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskComments_ShareLinkId",
                table: "AppTaskComments",
                column: "ShareLinkId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskAttachments_ShareLinkId",
                table: "AppTaskAttachments",
                column: "ShareLinkId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskShareAccessLogs_ShareLinkId_CreationTime",
                table: "AppTaskShareAccessLogs",
                columns: new[] { "ShareLinkId", "CreationTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskShareLinks_TaskId",
                table: "AppTaskShareLinks",
                column: "TaskId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTaskShareLinks_TokenHash",
                table: "AppTaskShareLinks",
                column: "TokenHash",
                unique: true,
                filter: "\"IsDeleted\" = false");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppTaskShareAccessLogs");

            migrationBuilder.DropTable(
                name: "AppTaskShareLinks");

            migrationBuilder.DropIndex(
                name: "IX_AppTaskComments_ShareLinkId",
                table: "AppTaskComments");

            migrationBuilder.DropIndex(
                name: "IX_AppTaskAttachments_ShareLinkId",
                table: "AppTaskAttachments");

            migrationBuilder.DropColumn(
                name: "ShareLinkId",
                table: "AppTaskComments");

            migrationBuilder.DropColumn(
                name: "IsVisibleToGuests",
                table: "AppTaskAttachments");

            migrationBuilder.DropColumn(
                name: "ShareLinkId",
                table: "AppTaskAttachments");
        }
    }
}
