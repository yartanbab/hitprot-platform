using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class ExtendFeedbackManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence(
                name: "AppFeedbackNumberSeq");

            migrationBuilder.AddColumn<string>(
                name: "ActionCode",
                table: "AppFeedbacks",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "AllowContact",
                table: "AppFeedbacks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "AssignedUserId",
                table: "AppFeedbacks",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AssignedUserName",
                table: "AppFeedbacks",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ComponentCode",
                table: "AppFeedbacks",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DetailsJson",
                table: "AppFeedbacks",
                type: "character varying(8000)",
                maxLength: 8000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FeedbackNumber",
                table: "AppFeedbacks",
                type: "character varying(16)",
                maxLength: 16,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Impact",
                table: "AppFeedbacks",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAnonymous",
                table: "AppFeedbacks",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "LastClientErrorId",
                table: "AppFeedbacks",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModuleCode",
                table: "AppFeedbacks",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "RelatedEntityId",
                table: "AppFeedbacks",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RelatedEntityType",
                table: "AppFeedbacks",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Severity",
                table: "AppFeedbacks",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppFeedbackActivities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    FeedbackId = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    OldValue = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NewValue = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Note = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    ActorName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    IsInternal = table.Column<bool>(type: "boolean", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppFeedbackActivities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppFeedbackActivities_AppFeedbacks_FeedbackId",
                        column: x => x.FeedbackId,
                        principalTable: "AppFeedbacks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppFeedbackAttachments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    FeedbackId = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    StoredFileName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    ContentType = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    SizeBytes = table.Column<long>(type: "bigint", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppFeedbackAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppFeedbackAttachments_AppFeedbacks_FeedbackId",
                        column: x => x.FeedbackId,
                        principalTable: "AppFeedbacks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Backfill: mevcut kayıtlara sequence'tan numara ata — aşağıdaki unique
            // index birden fazla boş ("") değeri kabul etmeyeceği için index'ten ÖNCE.
            migrationBuilder.Sql(
                """
                UPDATE "AppFeedbacks"
                SET "FeedbackNumber" = 'FB-' || to_char("CreationTime", 'YYYY') || '-' ||
                                       lpad(nextval('"AppFeedbackNumberSeq"')::text, 6, '0')
                WHERE "FeedbackNumber" = '';
                """);

            migrationBuilder.CreateIndex(
                name: "IX_AppFeedbacks_AssignedUserId",
                table: "AppFeedbacks",
                column: "AssignedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppFeedbacks_FeedbackNumber",
                table: "AppFeedbacks",
                column: "FeedbackNumber",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppFeedbacks_ModuleCode",
                table: "AppFeedbacks",
                column: "ModuleCode");

            migrationBuilder.CreateIndex(
                name: "IX_AppFeedbackActivities_FeedbackId_CreationTime",
                table: "AppFeedbackActivities",
                columns: new[] { "FeedbackId", "CreationTime" });

            migrationBuilder.CreateIndex(
                name: "IX_AppFeedbackAttachments_FeedbackId",
                table: "AppFeedbackAttachments",
                column: "FeedbackId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppFeedbackActivities");

            migrationBuilder.DropTable(
                name: "AppFeedbackAttachments");

            migrationBuilder.DropIndex(
                name: "IX_AppFeedbacks_AssignedUserId",
                table: "AppFeedbacks");

            migrationBuilder.DropIndex(
                name: "IX_AppFeedbacks_FeedbackNumber",
                table: "AppFeedbacks");

            migrationBuilder.DropIndex(
                name: "IX_AppFeedbacks_ModuleCode",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "ActionCode",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "AllowContact",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "AssignedUserId",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "AssignedUserName",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "ComponentCode",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "DetailsJson",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "FeedbackNumber",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "Impact",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "IsAnonymous",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "LastClientErrorId",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "ModuleCode",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "RelatedEntityId",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "RelatedEntityType",
                table: "AppFeedbacks");

            migrationBuilder.DropColumn(
                name: "Severity",
                table: "AppFeedbacks");

            migrationBuilder.DropSequence(
                name: "AppFeedbackNumberSeq");
        }
    }
}
