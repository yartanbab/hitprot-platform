using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectBudgetLinesAndFunding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "BudgetLineId",
                table: "AppIncomeEntries",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "BudgetLineId",
                table: "AppExpenses",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AppBudgetRevisions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RevisionNo = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false),
                    EffectiveDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalApprovedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
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
                    table.PrimaryKey("PK_AppBudgetRevisions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppBudgetRevisions_AppProjects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "AppProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppFundingTranches",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SequenceNo = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: true),
                    PlannedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PlannedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ReceivedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ReceivedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    IncomeEntryId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Note = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: true),
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
                    table.PrimaryKey("PK_AppFundingTranches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppFundingTranches_AppProjects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "AppProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppProjectBudgetLines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ProjectId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(32)", maxLength: 32, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(128)", maxLength: 128, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false),
                    PlannedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ApprovedAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TransferLimitPercent = table.Column<decimal>(type: "decimal(5,2)", nullable: true),
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
                    table.PrimaryKey("PK_AppProjectBudgetLines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppProjectBudgetLines_AppProjects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "AppProjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppBudgetRevisionLines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BudgetRevisionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BudgetLineId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PreviousAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NewAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppBudgetRevisionLines", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppBudgetRevisionLines_AppBudgetRevisions_BudgetRevisionId",
                        column: x => x.BudgetRevisionId,
                        principalTable: "AppBudgetRevisions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppTrancheDeductions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TenantId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    TrancheId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(512)", maxLength: 512, nullable: false),
                    DeductionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Resolution = table.Column<int>(type: "int", nullable: false),
                    BudgetRevisionId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
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
                    table.PrimaryKey("PK_AppTrancheDeductions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppTrancheDeductions_AppFundingTranches_TrancheId",
                        column: x => x.TrancheId,
                        principalTable: "AppFundingTranches",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppIncomeEntries_BudgetLineId",
                table: "AppIncomeEntries",
                column: "BudgetLineId");

            migrationBuilder.CreateIndex(
                name: "IX_AppExpenses_BudgetLineId",
                table: "AppExpenses",
                column: "BudgetLineId");

            migrationBuilder.CreateIndex(
                name: "IX_AppBudgetRevisionLines_BudgetLineId",
                table: "AppBudgetRevisionLines",
                column: "BudgetLineId");

            migrationBuilder.CreateIndex(
                name: "IX_AppBudgetRevisionLines_BudgetRevisionId",
                table: "AppBudgetRevisionLines",
                column: "BudgetRevisionId");

            migrationBuilder.CreateIndex(
                name: "IX_AppBudgetRevisions_ProjectId_RevisionNo",
                table: "AppBudgetRevisions",
                columns: new[] { "ProjectId", "RevisionNo" });

            migrationBuilder.CreateIndex(
                name: "IX_AppFundingTranches_IncomeEntryId",
                table: "AppFundingTranches",
                column: "IncomeEntryId");

            migrationBuilder.CreateIndex(
                name: "IX_AppFundingTranches_ProjectId_SequenceNo",
                table: "AppFundingTranches",
                columns: new[] { "ProjectId", "SequenceNo" });

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectBudgetLines_ProjectId_Code",
                table: "AppProjectBudgetLines",
                columns: new[] { "ProjectId", "Code" });

            migrationBuilder.CreateIndex(
                name: "IX_AppProjectBudgetLines_ProjectId_Order",
                table: "AppProjectBudgetLines",
                columns: new[] { "ProjectId", "Order" });

            migrationBuilder.CreateIndex(
                name: "IX_AppTrancheDeductions_BudgetRevisionId",
                table: "AppTrancheDeductions",
                column: "BudgetRevisionId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTrancheDeductions_TrancheId",
                table: "AppTrancheDeductions",
                column: "TrancheId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppBudgetRevisionLines");

            migrationBuilder.DropTable(
                name: "AppProjectBudgetLines");

            migrationBuilder.DropTable(
                name: "AppTrancheDeductions");

            migrationBuilder.DropTable(
                name: "AppBudgetRevisions");

            migrationBuilder.DropTable(
                name: "AppFundingTranches");

            migrationBuilder.DropIndex(
                name: "IX_AppIncomeEntries_BudgetLineId",
                table: "AppIncomeEntries");

            migrationBuilder.DropIndex(
                name: "IX_AppExpenses_BudgetLineId",
                table: "AppExpenses");

            migrationBuilder.DropColumn(
                name: "BudgetLineId",
                table: "AppIncomeEntries");

            migrationBuilder.DropColumn(
                name: "BudgetLineId",
                table: "AppExpenses");
        }
    }
}
