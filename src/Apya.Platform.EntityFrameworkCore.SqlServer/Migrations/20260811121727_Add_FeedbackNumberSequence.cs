using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_FeedbackNumberSequence : Migration
    {
        // Geri bildirim takip numarası ("FB-2026-000123") için bigint sequence.
        // Sequence EF MODELİNDE tanımlı değildir (SQLite testleri sequence desteklemez),
        // bu yüzden Initial migration'ında görünmez; el ile burada yaratılır.
        // Postgres'te karşılığı ExtendFeedbackManagement migration'ındaki CreateSequence'tır.
        private const string SequenceName = "AppFeedbackNumberSeq";

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence(name: SequenceName);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropSequence(name: SequenceName);
        }
    }
}
