using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class SoftDeleteAwareUniqueIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppTenantProfiles_TenantId",
                table: "AppTenantProfiles");

            migrationBuilder.DropIndex(
                name: "IX_AppProjectCategories_TenantId_Name",
                table: "AppProjectCategories");

            migrationBuilder.DropIndex(
                name: "IX_AppPlatformPackages_Code",
                table: "AppPlatformPackages");

            migrationBuilder.DropIndex(
                name: "IX_AppNotificationPreferences_UserId_Category",
                table: "AppNotificationPreferences");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantRecommendations_TenantId_GrantCallId",
                table: "AppGrantRecommendations");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantNotificationTemplates_TenantId_Trigger",
                table: "AppGrantNotificationTemplates");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantMatchWeights_GrantId",
                table: "AppGrantMatchWeights");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantEligibleCostItems_GrantId_Kind",
                table: "AppGrantEligibleCostItems");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantDecisions_GrantApplicationId",
                table: "AppGrantDecisions");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantApplications_TenantId_GrantCallId",
                table: "AppGrantApplications");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantApplicationBudgetLines_GrantApplicationId_Kind",
                table: "AppGrantApplicationBudgetLines");

            migrationBuilder.DropIndex(
                name: "IX_AppFirmProfiles_TenantId",
                table: "AppFirmProfiles");

            migrationBuilder.DropIndex(
                name: "IX_AppDocuments_Dynamic_Slug_Host",
                table: "AppDocuments_Dynamic");

            migrationBuilder.DropIndex(
                name: "IX_AppDocuments_Dynamic_TenantId_Slug",
                table: "AppDocuments_Dynamic");

            migrationBuilder.CreateIndex(
                name: "IX_AppTenantProfiles_TenantId",
                table: "AppTenantProfiles",
                column: "TenantId",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectCategories_TenantId_Name",
                table: "AppProjectCategories",
                columns: new[] { "TenantId", "Name" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppPlatformPackages_Code",
                table: "AppPlatformPackages",
                column: "Code",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppNotificationPreferences_UserId_Category",
                table: "AppNotificationPreferences",
                columns: new[] { "UserId", "Category" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantRecommendations_TenantId_GrantCallId",
                table: "AppGrantRecommendations",
                columns: new[] { "TenantId", "GrantCallId" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantNotificationTemplates_TenantId_Trigger",
                table: "AppGrantNotificationTemplates",
                columns: new[] { "TenantId", "Trigger" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantMatchWeights_GrantId",
                table: "AppGrantMatchWeights",
                column: "GrantId",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantEligibleCostItems_GrantId_Kind",
                table: "AppGrantEligibleCostItems",
                columns: new[] { "GrantId", "Kind" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantDecisions_GrantApplicationId",
                table: "AppGrantDecisions",
                column: "GrantApplicationId",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantApplications_TenantId_GrantCallId",
                table: "AppGrantApplications",
                columns: new[] { "TenantId", "GrantCallId" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantApplicationBudgetLines_GrantApplicationId_Kind",
                table: "AppGrantApplicationBudgetLines",
                columns: new[] { "GrantApplicationId", "Kind" },
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppFirmProfiles_TenantId",
                table: "AppFirmProfiles",
                column: "TenantId",
                unique: true,
                filter: "\"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocuments_Dynamic_Slug_Host",
                table: "AppDocuments_Dynamic",
                column: "Slug",
                unique: true,
                filter: "\"TenantId\" IS NULL AND \"IsDeleted\" = false");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocuments_Dynamic_TenantId_Slug",
                table: "AppDocuments_Dynamic",
                columns: new[] { "TenantId", "Slug" },
                unique: true,
                filter: "\"IsDeleted\" = false");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppTenantProfiles_TenantId",
                table: "AppTenantProfiles");

            migrationBuilder.DropIndex(
                name: "IX_AppProjectCategories_TenantId_Name",
                table: "AppProjectCategories");

            migrationBuilder.DropIndex(
                name: "IX_AppPlatformPackages_Code",
                table: "AppPlatformPackages");

            migrationBuilder.DropIndex(
                name: "IX_AppNotificationPreferences_UserId_Category",
                table: "AppNotificationPreferences");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantRecommendations_TenantId_GrantCallId",
                table: "AppGrantRecommendations");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantNotificationTemplates_TenantId_Trigger",
                table: "AppGrantNotificationTemplates");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantMatchWeights_GrantId",
                table: "AppGrantMatchWeights");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantEligibleCostItems_GrantId_Kind",
                table: "AppGrantEligibleCostItems");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantDecisions_GrantApplicationId",
                table: "AppGrantDecisions");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantApplications_TenantId_GrantCallId",
                table: "AppGrantApplications");

            migrationBuilder.DropIndex(
                name: "IX_AppGrantApplicationBudgetLines_GrantApplicationId_Kind",
                table: "AppGrantApplicationBudgetLines");

            migrationBuilder.DropIndex(
                name: "IX_AppFirmProfiles_TenantId",
                table: "AppFirmProfiles");

            migrationBuilder.DropIndex(
                name: "IX_AppDocuments_Dynamic_Slug_Host",
                table: "AppDocuments_Dynamic");

            migrationBuilder.DropIndex(
                name: "IX_AppDocuments_Dynamic_TenantId_Slug",
                table: "AppDocuments_Dynamic");

            migrationBuilder.CreateIndex(
                name: "IX_AppTenantProfiles_TenantId",
                table: "AppTenantProfiles",
                column: "TenantId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectCategories_TenantId_Name",
                table: "AppProjectCategories",
                columns: new[] { "TenantId", "Name" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppPlatformPackages_Code",
                table: "AppPlatformPackages",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppNotificationPreferences_UserId_Category",
                table: "AppNotificationPreferences",
                columns: new[] { "UserId", "Category" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantRecommendations_TenantId_GrantCallId",
                table: "AppGrantRecommendations",
                columns: new[] { "TenantId", "GrantCallId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantNotificationTemplates_TenantId_Trigger",
                table: "AppGrantNotificationTemplates",
                columns: new[] { "TenantId", "Trigger" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantMatchWeights_GrantId",
                table: "AppGrantMatchWeights",
                column: "GrantId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantEligibleCostItems_GrantId_Kind",
                table: "AppGrantEligibleCostItems",
                columns: new[] { "GrantId", "Kind" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantDecisions_GrantApplicationId",
                table: "AppGrantDecisions",
                column: "GrantApplicationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantApplications_TenantId_GrantCallId",
                table: "AppGrantApplications",
                columns: new[] { "TenantId", "GrantCallId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppGrantApplicationBudgetLines_GrantApplicationId_Kind",
                table: "AppGrantApplicationBudgetLines",
                columns: new[] { "GrantApplicationId", "Kind" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppFirmProfiles_TenantId",
                table: "AppFirmProfiles",
                column: "TenantId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppDocuments_Dynamic_Slug_Host",
                table: "AppDocuments_Dynamic",
                column: "Slug",
                unique: true,
                filter: "\"TenantId\" IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AppDocuments_Dynamic_TenantId_Slug",
                table: "AppDocuments_Dynamic",
                columns: new[] { "TenantId", "Slug" },
                unique: true);
        }
    }
}
