using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_TenantId_To_ChildEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "AppTaskComments",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "AppTaskAttachments",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "AppInvoiceItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "AppExternalCalendarAccounts",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TenantId",
                table: "AppBudgetRevisionLines",
                type: "uniqueidentifier",
                nullable: true);

            // SEC-03 / DOC-06: Var olan satırlar kiracıyı ÜST KAYITTAN alır (takvim hesabı: sahibi
            // kullanıcıdan). Üst kaydı fiziksel olarak silinmiş yetim satır NULL kalır; kiracı
            // süzgeci açıkken yalnız host bağlamında görünür.
            migrationBuilder.Sql("UPDATE [AppTaskComments] SET [TenantId] = (SELECT p.[TenantId] FROM [AppTasks] p WHERE p.[Id] = [AppTaskComments].[TaskId]);");
            migrationBuilder.Sql("UPDATE [AppTaskAttachments] SET [TenantId] = (SELECT p.[TenantId] FROM [AppTasks] p WHERE p.[Id] = [AppTaskAttachments].[TaskId]);");
            migrationBuilder.Sql("UPDATE [AppInvoiceItems] SET [TenantId] = (SELECT p.[TenantId] FROM [AppInvoices] p WHERE p.[Id] = [AppInvoiceItems].[InvoiceId]);");
            migrationBuilder.Sql("UPDATE [AppBudgetRevisionLines] SET [TenantId] = (SELECT p.[TenantId] FROM [AppBudgetRevisions] p WHERE p.[Id] = [AppBudgetRevisionLines].[BudgetRevisionId]);");
            migrationBuilder.Sql("UPDATE [AppExternalCalendarAccounts] SET [TenantId] = (SELECT p.[TenantId] FROM [AbpUsers] p WHERE p.[Id] = [AppExternalCalendarAccounts].[UserId]);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppTaskComments");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppTaskAttachments");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppInvoiceItems");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppExternalCalendarAccounts");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AppBudgetRevisionLines");
        }
    }
}
