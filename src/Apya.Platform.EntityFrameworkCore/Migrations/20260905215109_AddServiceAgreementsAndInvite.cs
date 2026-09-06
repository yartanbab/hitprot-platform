using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddServiceAgreementsAndInvite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "InviteExpiresAt",
                table: "AppRegistrationRequests",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "InviteIssuedAt",
                table: "AppRegistrationRequests",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InviteTokenHash",
                table: "AppRegistrationRequests",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "InviteUsedAt",
                table: "AppRegistrationRequests",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "AppRegistrationRequests",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppServiceAgreements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RegistrationRequestId = table.Column<Guid>(type: "uuid", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
                    Number = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    TemplateVersion = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    RenderedHtml = table.Column<string>(type: "text", nullable: false),
                    ContentHash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Plan = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", nullable: true),
                    SuccessFeePercent = table.Column<decimal>(type: "numeric(5,2)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ApproverName = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    ApproverTitle = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ApproverEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    ApprovedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ApprovedIp = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    ApprovedUserAgent = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    EndedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    TerminationReason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    ExtraProperties = table.Column<string>(type: "text", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppServiceAgreements", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppRegistrationRequests_InviteTokenHash",
                table: "AppRegistrationRequests",
                column: "InviteTokenHash");

            migrationBuilder.CreateIndex(
                name: "IX_AppServiceAgreements_Number",
                table: "AppServiceAgreements",
                column: "Number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppServiceAgreements_RegistrationRequestId",
                table: "AppServiceAgreements",
                column: "RegistrationRequestId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppServiceAgreements_TenantId",
                table: "AppServiceAgreements",
                column: "TenantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppServiceAgreements");

            migrationBuilder.DropIndex(
                name: "IX_AppRegistrationRequests_InviteTokenHash",
                table: "AppRegistrationRequests");

            migrationBuilder.DropColumn(
                name: "InviteExpiresAt",
                table: "AppRegistrationRequests");

            migrationBuilder.DropColumn(
                name: "InviteIssuedAt",
                table: "AppRegistrationRequests");

            migrationBuilder.DropColumn(
                name: "InviteTokenHash",
                table: "AppRegistrationRequests");

            migrationBuilder.DropColumn(
                name: "InviteUsedAt",
                table: "AppRegistrationRequests");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppRegistrationRequests");
        }
    }
}
