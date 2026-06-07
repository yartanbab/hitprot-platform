using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_FormManagement_Fields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "AppTaskTimeLogs",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "CompletionSeconds",
                table: "AppResponses",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RespondentMetaJson",
                table: "AppResponses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "AppResponses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "TagsJson",
                table: "AppResponses",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TargetAudience",
                table: "AppProjects",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Purpose",
                table: "AppProjects",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Duration",
                table: "AppProjects",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Activities",
                table: "AppProjects",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "ReferenceNumber",
                table: "AppPayments",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "AppDocuments_Dynamic",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "AppDocuments_Dynamic",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PublishSettingsJson",
                table: "AppDocuments_Dynamic",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PublishedAt",
                table: "AppDocuments_Dynamic",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ResponseCount",
                table: "AppDocuments_Dynamic",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "AppDocuments_Dynamic",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ThemeJson",
                table: "AppDocuments_Dynamic",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "ViewCount",
                table: "AppDocuments_Dynamic",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.AlterColumn<string>(
                name: "ExternalETag",
                table: "AppCalendarSyncMappings",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateTable(
                name: "AppFormCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Color = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    Icon = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: true),
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
                    table.PrimaryKey("PK_AppFormCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppResponseComments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AppResponseId = table.Column<Guid>(type: "uuid", nullable: false),
                    Text = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppResponseComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppResponseComments_AppResponses_AppResponseId",
                        column: x => x.AppResponseId,
                        principalTable: "AppResponses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppResponses_TenantId_Status",
                table: "AppResponses",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_AppDocuments_Dynamic_CategoryId",
                table: "AppDocuments_Dynamic",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocuments_Dynamic_TenantId_Status",
                table: "AppDocuments_Dynamic",
                columns: new[] { "TenantId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_AppFormCategories_TenantId_Name",
                table: "AppFormCategories",
                columns: new[] { "TenantId", "Name" });

            migrationBuilder.CreateIndex(
                name: "IX_AppFormCategories_TenantId_Order",
                table: "AppFormCategories",
                columns: new[] { "TenantId", "Order" });

            migrationBuilder.CreateIndex(
                name: "IX_AppResponseComments_AppResponseId",
                table: "AppResponseComments",
                column: "AppResponseId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppFormCategories");

            migrationBuilder.DropTable(
                name: "AppResponseComments");

            migrationBuilder.DropIndex(
                name: "IX_AppResponses_TenantId_Status",
                table: "AppResponses");

            migrationBuilder.DropIndex(
                name: "IX_AppDocuments_Dynamic_CategoryId",
                table: "AppDocuments_Dynamic");

            migrationBuilder.DropIndex(
                name: "IX_AppDocuments_Dynamic_TenantId_Status",
                table: "AppDocuments_Dynamic");

            migrationBuilder.DropColumn(
                name: "CompletionSeconds",
                table: "AppResponses");

            migrationBuilder.DropColumn(
                name: "RespondentMetaJson",
                table: "AppResponses");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "AppResponses");

            migrationBuilder.DropColumn(
                name: "TagsJson",
                table: "AppResponses");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "AppDocuments_Dynamic");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "AppDocuments_Dynamic");

            migrationBuilder.DropColumn(
                name: "PublishSettingsJson",
                table: "AppDocuments_Dynamic");

            migrationBuilder.DropColumn(
                name: "PublishedAt",
                table: "AppDocuments_Dynamic");

            migrationBuilder.DropColumn(
                name: "ResponseCount",
                table: "AppDocuments_Dynamic");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "AppDocuments_Dynamic");

            migrationBuilder.DropColumn(
                name: "ThemeJson",
                table: "AppDocuments_Dynamic");

            migrationBuilder.DropColumn(
                name: "ViewCount",
                table: "AppDocuments_Dynamic");

            migrationBuilder.AlterColumn<string>(
                name: "Note",
                table: "AppTaskTimeLogs",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "TargetAudience",
                table: "AppProjects",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Purpose",
                table: "AppProjects",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Duration",
                table: "AppProjects",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Activities",
                table: "AppProjects",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ReferenceNumber",
                table: "AppPayments",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ExternalETag",
                table: "AppCalendarSyncMappings",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
