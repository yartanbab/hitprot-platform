using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_ConsentRecords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppConsentRecords",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    SubjectKind = table.Column<int>(type: "integer", nullable: false),
                    SubjectId = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    PolicyVersion = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    AcceptedCategories = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    Granted = table.Column<bool>(type: "boolean", nullable: false),
                    OccurredAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IpAddress = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    UserAgent = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    SourceRef = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppConsentRecords", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppConsentRecords_TenantId_Type_OccurredAt",
                table: "AppConsentRecords",
                columns: new[] { "TenantId", "Type", "OccurredAt" });

            migrationBuilder.CreateIndex(
                name: "IX_AppConsentRecords_TenantId_Type_SubjectId",
                table: "AppConsentRecords",
                columns: new[] { "TenantId", "Type", "SubjectId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppConsentRecords");
        }
    }
}
