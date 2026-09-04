using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_ReleaseNotePublications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppReleaseNotePublications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Version = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    ItemKey = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    IsApproved = table.Column<bool>(type: "boolean", nullable: false),
                    ShowInModal = table.Column<bool>(type: "boolean", nullable: false),
                    ShowInHistory = table.Column<bool>(type: "boolean", nullable: false),
                    Packages = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Audience = table.Column<byte>(type: "smallint", nullable: false),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppReleaseNotePublications", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppReleaseNotePublications_Version_ItemKey",
                table: "AppReleaseNotePublications",
                columns: new[] { "Version", "ItemKey" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppReleaseNotePublications");
        }
    }
}
