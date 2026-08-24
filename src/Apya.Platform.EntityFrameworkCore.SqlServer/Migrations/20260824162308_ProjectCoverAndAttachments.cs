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
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "StoredFileName",
                table: "AppProjectAttachments",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                table: "AppProjectAttachments",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "ContentType",
                table: "AppProjectAttachments",
                type: "nvarchar(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "AppProjectAttachments",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "AppProjectAttachments",
                type: "nvarchar(256)",
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
                UPDATE a
                SET a.TenantId = p.TenantId
                FROM AppProjectAttachments a
                INNER JOIN AppProjects p ON p.Id = a.ProjectId
                WHERE a.TenantId IS NULL;");
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
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256);

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                table: "AppProjectAttachments",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(256)",
                oldMaxLength: 256);
        }
    }
}
