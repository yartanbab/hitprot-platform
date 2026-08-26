using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <summary>
    /// Serbest metin "Süresi" kolonunu düşürür.
    ///
    /// Alan hiçbir ekranda OKUNMUYORDU: süreyi gösteren her yer (proje detayındaki
    /// "Kalan Süre", listedeki aciliyet sıralaması, risk rozetleri) Başlangıç/Bitiş
    /// tarihlerinden hesaplıyor. Form tarafı #252 ile kaldırılmıştı; bu migration
    /// arkada kalan kolonu da alıyor.
    ///
    /// 🔴 GERİ ALINAMAZ. Down() kolonu geri EKLER ama BOŞ olarak — içindeki metin
    /// kalıcı olarak gider. Demo verisindeki "12 ay" gibi değerler tarihlerden
    /// yeniden hesaplanabilir, ama elle girilmiş serbest metin kurtarılamaz.
    /// Uygulamadan önce veritabanı yedeği al.
    /// </summary>
    public partial class DropProjectDuration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "AppProjects");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Duration",
                table: "AppProjects",
                type: "text",
                nullable: true);
        }
    }
}
