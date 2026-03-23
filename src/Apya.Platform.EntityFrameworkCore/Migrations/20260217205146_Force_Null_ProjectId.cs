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
            // EF Core'un varsayılanlarını ezip kendi SQL emrimizi gönderiyoruz (Sadece varsa):
            migrationBuilder.Sql(@"
                IF EXISTS(SELECT 1 FROM sys.columns WHERE Name = N'ProjectId' AND Object_ID = Object_ID(N'AppTasks'))
                BEGIN
                    ALTER TABLE [AppTasks] ALTER COLUMN [ProjectId] uniqueidentifier NULL;
                END
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
