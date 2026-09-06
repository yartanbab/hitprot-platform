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
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "InviteIssuedAt",
                table: "AppRegistrationRequests",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InviteTokenHash",
                table: "AppRegistrationRequests",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "InviteUsedAt",
                table: "AppRegistrationRequests",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "AppRegistrationRequests",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppServiceAgreements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RegistrationRequestId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Number = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    TemplateVersion = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    RenderedHtml = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContentHash = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Plan = table.Column<int>(type: "int", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    SuccessFeePercent = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    ApproverName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    ApproverTitle = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ApproverEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    ApprovedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ApprovedIp = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: true),
                    ApprovedUserAgent = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
                    EndedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TerminationReason = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
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
