using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <summary>
    /// Demo talebi → kayıt talebi dönüşümü (SQL Server). Postgres eşi ile AYNI
    /// işlemleri yapar; yalnız gömülü SQL'in tanımlayıcı tırnakları farklıdır.
    ///
    /// <para>🔴 EF'in kendi ürettiği taslak <c>DropTable</c> + <c>CreateTable</c> idi;
    /// bu ELLE DEĞİŞTİRİLDİ. Otomatik hâli var olan demo taleplerini — yani gerçek satış
    /// adaylarını — sessizce silerdi.</para>
    ///
    /// <para>Eski satırlar kayıt talebi olarak HAYATTA KALIR ama yetkili görevi, vergi no
    /// ve adres BOŞ gelir — demo formu bunları hiç sormuyordu. Durum sütunu olduğu gibi
    /// kalır: New(0) ve Closed(2) yeni enum'da aynı sayıyı taşıyor, Contacted(1) yalnız
    /// ad değiştirdi (InReview).</para>
    /// </summary>
    public partial class RenameDemoRequestsToRegistrationRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameTable(
                name: "AppDemoRequests",
                newName: "AppRegistrationRequests");

            // Tablo adı değişince kısıt/indeks adları KENDİLİĞİNDEN değişmez; eski adla
            // kalan bir "PK_AppDemoRequests" ileride bakan herkesi yanıltır.
            migrationBuilder.DropPrimaryKey(
                name: "PK_AppDemoRequests",
                table: "AppRegistrationRequests");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppRegistrationRequests",
                table: "AppRegistrationRequests",
                column: "Id");

            migrationBuilder.RenameIndex(
                name: "IX_AppDemoRequests_IpAddress_CreationTime",
                newName: "IX_AppRegistrationRequests_IpAddress_CreationTime",
                table: "AppRegistrationRequests");

            migrationBuilder.RenameIndex(
                name: "IX_AppDemoRequests_Status_CreationTime",
                newName: "IX_AppRegistrationRequests_Status_CreationTime",
                table: "AppRegistrationRequests");

            // --- Yeni alanlar: protokolün istediği kurum kimliği ve paket ---

            // Kurum türü ÖNCE eklenir, sonra OrganizationKind'dan doldurulur: iki enum
            // farklı sayılar kullanıyor, kör bir sütun yeniden adlandırması Dernek'i
            // Şirket yapardı.
            migrationBuilder.AddColumn<int>(
                name: "CompanyType",
                table: "AppRegistrationRequests",
                nullable: false,
                defaultValue: 6); // CompanyType.Other — türü bilinmeyen eski satırlar

            migrationBuilder.Sql(@"
                UPDATE [AppRegistrationRequests]
                SET [CompanyType] = CASE [OrganizationKind]
                    WHEN 0 THEN 1  -- Company            -> Company
                    WHEN 1 THEN 2  -- Association        -> Association
                    WHEN 2 THEN 5  -- PublicInstitution  -> PublicInstitution
                    WHEN 3 THEN 6  -- Other              -> Other
                    ELSE 6         -- NULL               -> Other
                END;");

            migrationBuilder.DropColumn(
                name: "OrganizationKind",
                table: "AppRegistrationRequests");

            migrationBuilder.AddColumn<string>(
                name: "AuthorizedTitle",
                table: "AppRegistrationRequests",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaxNumber",
                table: "AppRegistrationRequests",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TaxOffice",
                table: "AppRegistrationRequests",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "AppRegistrationRequests",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CorporateEmail",
                table: "AppRegistrationRequests",
                maxLength: 256,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OperationalContactName",
                table: "AppRegistrationRequests",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OperationalContactPhone",
                table: "AppRegistrationRequests",
                maxLength: 32,
                nullable: true);

            // Eski talepler paket seçmemişti; Standart en küçük taahhüt.
            migrationBuilder.AddColumn<int>(
                name: "RequestedPlan",
                table: "AppRegistrationRequests",
                nullable: false,
                defaultValue: 1); // SalesPlan.Standard

            migrationBuilder.AddColumn<int>(
                name: "ApprovedPlan",
                table: "AppRegistrationRequests",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OfferedAmount",
                table: "AppRegistrationRequests",
                precision: 18,
                scale: 2,
                nullable: true);

            // --- Kaldırılan proje fikri alanları (ön görüşme soruları) ---

            migrationBuilder.DropColumn(name: "TargetAudience", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "ProblemStatement", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "PlannedActivities", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "BudgetRange", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "ExpectedOutcomes", table: "AppRegistrationRequests");

            // Paket seçimi modül listesinin yerini aldı: aday artık ürünü seçiyor,
            // modülleri tek tek işaretlemiyor.
            migrationBuilder.DropColumn(name: "InterestedModules", table: "AppRegistrationRequests");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TargetAudience",
                table: "AppRegistrationRequests",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProblemStatement",
                table: "AppRegistrationRequests",
                maxLength: 1500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlannedActivities",
                table: "AppRegistrationRequests",
                maxLength: 1500,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BudgetRange",
                table: "AppRegistrationRequests",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExpectedOutcomes",
                table: "AppRegistrationRequests",
                maxLength: 1500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InterestedModules",
                table: "AppRegistrationRequests",
                maxLength: 400,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OrganizationKind",
                table: "AppRegistrationRequests",
                nullable: true);

            // Eşleme geri sarılır. Vakıf ve Şahıs şirketi eski enum'da KARŞILIĞI YOK;
            // "Diğer"e düşerler — geri alma kayıpsız değildir.
            migrationBuilder.Sql(@"
                UPDATE [AppRegistrationRequests]
                SET [OrganizationKind] = CASE [CompanyType]
                    WHEN 1 THEN 0  -- Company
                    WHEN 2 THEN 1  -- Association
                    WHEN 5 THEN 2  -- PublicInstitution
                    ELSE 3         -- Foundation / SoleProprietorship / Other
                END;");

            migrationBuilder.DropColumn(name: "CompanyType", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "AuthorizedTitle", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "TaxNumber", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "TaxOffice", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "Address", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "CorporateEmail", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "OperationalContactName", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "OperationalContactPhone", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "RequestedPlan", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "ApprovedPlan", table: "AppRegistrationRequests");
            migrationBuilder.DropColumn(name: "OfferedAmount", table: "AppRegistrationRequests");

            migrationBuilder.RenameIndex(
                name: "IX_AppRegistrationRequests_Status_CreationTime",
                newName: "IX_AppDemoRequests_Status_CreationTime",
                table: "AppRegistrationRequests");

            migrationBuilder.RenameIndex(
                name: "IX_AppRegistrationRequests_IpAddress_CreationTime",
                newName: "IX_AppDemoRequests_IpAddress_CreationTime",
                table: "AppRegistrationRequests");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppRegistrationRequests",
                table: "AppRegistrationRequests");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppDemoRequests",
                table: "AppRegistrationRequests",
                column: "Id");

            migrationBuilder.RenameTable(
                name: "AppRegistrationRequests",
                newName: "AppDemoRequests");
        }
    }
}
