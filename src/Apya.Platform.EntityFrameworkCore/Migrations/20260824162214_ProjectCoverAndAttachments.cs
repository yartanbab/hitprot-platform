using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class ProjectCoverAndAttachments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CoverImageFileName",
                table: "AppProjects",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StoredFileName",
                table: "AppProjectAttachments",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                table: "AppProjectAttachments",
                type: "character varying(256)",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "ContentType",
                table: "AppProjectAttachments",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "AppProjectAttachments",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "AppProjectAttachments",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectAttachments_ProjectId",
                table: "AppProjectAttachments",
                column: "ProjectId");

            // ProjectAttachment artık IMultiTenant. Mevcut satırların TenantId'si NULL
            // olduğu için kiracı kullanıcısı kendi eski eklerini GÖREMEZDİ; bağlı
            // projenin kiracısından dolduruluyor.
            migrationBuilder.Sql(@"
                UPDATE ""AppProjectAttachments"" a
                SET ""TenantId"" = p.""TenantId""
                FROM ""AppProjects"" p
                WHERE p.""Id"" = a.""ProjectId"" AND a.""TenantId"" IS NULL;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppProjectAttachments_ProjectId",
                table: "AppProjectAttachments");

            migrationBuilder.DropColumn(
                name: "CoverImageFileName",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "ContentType",
                table: "AppProjectAttachments");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppProjectAttachments");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "AppProjectAttachments");

            migrationBuilder.AlterColumn<string>(
                name: "StoredFileName",
                table: "AppProjectAttachments",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                table: "AppProjectAttachments",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256);
        }
    }
}
