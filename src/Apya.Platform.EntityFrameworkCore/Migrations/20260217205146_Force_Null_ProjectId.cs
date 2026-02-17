using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Force_Null_ProjectId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // EF Core'un varsayılanlarını ezip kendi SQL emrimizi gönderiyoruz:
            migrationBuilder.Sql("ALTER TABLE [AppTasks] ALTER COLUMN [ProjectId] uniqueidentifier NULL;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
