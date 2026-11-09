using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class AddVatExemption : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VatExemptionCertificateNo",
                table: "AppProjects",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "VatExemptionValidUntil",
                table: "AppProjects",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VatExemptionReference",
                table: "AppInvoices",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VatExemptionCertificateNo",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "VatExemptionValidUntil",
                table: "AppProjects");

            migrationBuilder.DropColumn(
                name: "VatExemptionReference",
                table: "AppInvoices");
        }
    }
}
