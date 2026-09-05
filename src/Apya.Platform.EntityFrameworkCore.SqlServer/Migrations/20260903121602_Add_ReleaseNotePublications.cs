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
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Version = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    ItemKey = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false),
                    ShowInModal = table.Column<bool>(type: "bit", nullable: false),
                    ShowInHistory = table.Column<bool>(type: "bit", nullable: false),
                    Packages = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Audience = table.Column<byte>(type: "tinyint", nullable: false),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
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
