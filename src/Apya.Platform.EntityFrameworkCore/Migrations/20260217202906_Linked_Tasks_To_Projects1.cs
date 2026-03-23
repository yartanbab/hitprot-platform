using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Linked_Tasks_To_Projects1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          
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
            migrationBuilder.DropColumn(
                name: "ProjectId",
                table: "AppTasks");
        }
    }
}
