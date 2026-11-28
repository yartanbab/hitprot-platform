using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Apya.Platform.Migrations
{
    /// <inheritdoc />
    public partial class Add_GrantParticipationVerificationAndImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CallCycle",
                table: "AppGrants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ExternalApplicantTypes",
                table: "AppGrants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GeographicScope",
                table: "AppGrants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "AppGrants",
                type: "nvarchar(512)",
                maxLength: 512,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SupportType",
                table: "AppGrants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TurkeyParticipation",
                table: "AppGrants",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "AnnouncementImageUrl",
                table: "AppGrantCalls",
                type: "nvarchar(512)",
                maxLength: 512,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ClosureReason",
                table: "AppGrantCalls",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "ImageLastCheckedAt",
                table: "AppGrantCalls",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ImageLicense",
                table: "AppGrantCalls",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ImageSourceUrl",
                table: "AppGrantCalls",
                type: "nvarchar(512)",
                maxLength: 512,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ImageStatus",
                table: "AppGrantCalls",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastVerifiedAt",
                table: "AppGrantCalls",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SourceUrl",
                table: "AppGrantCalls",
                type: "nvarchar(512)",
                maxLength: 512,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "VerificationStatus",
                table: "AppGrantCalls",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CallCycle",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "ExternalApplicantTypes",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "GeographicScope",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "LogoUrl",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "SupportType",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "TurkeyParticipation",
                table: "AppGrants");

            migrationBuilder.DropColumn(
                name: "AnnouncementImageUrl",
                table: "AppGrantCalls");

            migrationBuilder.DropColumn(
                name: "ClosureReason",
                table: "AppGrantCalls");

            migrationBuilder.DropColumn(
                name: "ImageLastCheckedAt",
                table: "AppGrantCalls");

            migrationBuilder.DropColumn(
                name: "ImageLicense",
                table: "AppGrantCalls");

            migrationBuilder.DropColumn(
                name: "ImageSourceUrl",
                table: "AppGrantCalls");

            migrationBuilder.DropColumn(
                name: "ImageStatus",
                table: "AppGrantCalls");

            migrationBuilder.DropColumn(
                name: "LastVerifiedAt",
                table: "AppGrantCalls");

            migrationBuilder.DropColumn(
                name: "SourceUrl",
                table: "AppGrantCalls");

            migrationBuilder.DropColumn(
                name: "VerificationStatus",
                table: "AppGrantCalls");
        }
    }
}
