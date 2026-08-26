using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <summary>
    /// Proje kategorisi sabit enum'dan tanım tablosuna taşınır (SQL Server tarafı).
    ///
    /// Adımların SIRASI kritiktir; scaffold'un ürettiği sıra (önce Category'yi düşür,
    /// sonra boş Guid'li CategoryId ekle) hem mevcut kategorileri siler hem de FK'yi
    /// ilk satırda ihlal ederdi. Doğru sıra: tabloyu kur → sistem satırlarını bas →
    /// kolonu ekle → veriyi taşı → eski kolonu düşür → FK'yi kur.
    ///
    /// Postgres eşleniği: Apya.Platform.EntityFrameworkCore/Migrations altındaki
    /// aynı adlı migration. İkisi birlikte değiştirilir.
    /// </summary>
    public partial class ProjectCategoryDefinitions : Migration
    {
        // ProjectCategoryConsts.SystemIds ile AYNI olmalı — kod oradaki sabitlere göre
        // arama yapar, buradaki değerler değişirse eşleşme kopar.
        private const string OtherId = "a1c0a7e0-0000-4000-8000-000000000000";
        private const string GrantId = "a1c0a7e0-0000-4000-8000-000000000001";
        private const string EventId = "a1c0a7e0-0000-4000-8000-000000000002";

        private static readonly DateTime SeedTime = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc);

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // --- 1. Tanım tablosu ---
            migrationBuilder.CreateTable(
                name: "AppProjectCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    Tone = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    SystemKey = table.Column<int>(type: "int", nullable: true),
                    ExtraProperties = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: false),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    DeleterId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppProjectCategories", x => x.Id);
                });

            // --- 2. Sistem kategorileri: TenantId null → tüm kiracılar görür ---
            SeedSystemCategories(migrationBuilder);

            // --- 3. Yeni kolon; varsayılan "Diğer / Genel" ki hiçbir satır FK'siz kalmasın ---
            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "AppProjects",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid(OtherId));

            // --- 4. Eski enum değerlerini taşı ---
            migrationBuilder.Sql($"UPDATE [AppProjects] SET [CategoryId] = '{GrantId}' WHERE [Category] = 1;");
            migrationBuilder.Sql($"UPDATE [AppProjects] SET [CategoryId] = '{EventId}' WHERE [Category] = 2;");
            migrationBuilder.Sql($"UPDATE [AppProjects] SET [CategoryId] = '{OtherId}' WHERE [Category] NOT IN (1, 2);");

            // --- 5. Eski kolon ve indeksi kaldır ---
            migrationBuilder.DropIndex(
                name: "IX_AppProjects_TenantId_Category",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "AppProjects");

            // --- 6. İndeksler ve FK ---
            migrationBuilder.CreateIndex(
                name: "IX_AppProjects_CategoryId",
                table: "AppProjects",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_AppProjects_TenantId_CategoryId",
                table: "AppProjects",
                columns: new[] { "TenantId", "CategoryId" });

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectCategories_SystemKey",
                table: "AppProjectCategories",
                column: "SystemKey");

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectCategories_TenantId_Name",
                table: "AppProjectCategories",
                columns: new[] { "TenantId", "Name" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AppProjects_AppProjectCategories_CategoryId",
                table: "AppProjects",
                column: "CategoryId",
                principalTable: "AppProjectCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        private void SeedSystemCategories(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AppProjectCategories",
                columns: new[]
                {
                    "Id", "TenantId", "Name", "Icon", "Tone", "Order", "IsActive", "SystemKey",
                    "ExtraProperties", "ConcurrencyStamp", "CreationTime", "IsDeleted"
                },
                values: new object[,]
                {
                    { new Guid(GrantId), null, "Hibe Projesi", "fa-award", "brand", 1, true, 1, "{}", "", SeedTime, false },
                    { new Guid(EventId), null, "Etkinlik", "fa-calendar-days", "warning", 2, true, 2, "{}", "", SeedTime, false },
                    { new Guid(OtherId), null, "Diğer / Genel", "fa-diagram-project", "neutral", 3, true, 0, "{}", "", SeedTime, false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Category",
                table: "AppProjects",
                type: "int",
                nullable: false,
                defaultValue: 0);

            // Geri taşıma: yalnız sistem kategorileri enum'a çevrilebilir. Kullanıcının
            // eklediği kategorilerdeki projeler "Diğer"e (0) düşer — enum'da karşılıkları yok.
            migrationBuilder.Sql($"UPDATE [AppProjects] SET [Category] = 1 WHERE [CategoryId] = '{GrantId}';");
            migrationBuilder.Sql($"UPDATE [AppProjects] SET [Category] = 2 WHERE [CategoryId] = '{EventId}';");

            migrationBuilder.DropForeignKey(
                name: "FK_AppProjects_AppProjectCategories_CategoryId",
                table: "AppProjects");

            migrationBuilder.DropTable(
                name: "AppProjectCategories");

            migrationBuilder.DropIndex(
                name: "IX_AppProjects_CategoryId",
                table: "AppProjects");

            migrationBuilder.DropIndex(
                name: "IX_AppProjects_TenantId_CategoryId",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "AppProjects");

            migrationBuilder.CreateIndex(
                name: "IX_AppProjects_TenantId_Category",
                table: "AppProjects",
                columns: new[] { "TenantId", "Category" });
        }
    }
}
