using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HandheldSite.Server.Migrations
{
    /// <inheritdoc />
    public partial class primaryimagebytes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<byte[]>(
                name: "PrimaryImage",
                table: "Reviews",
                type: "longblob",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Reviews",
                keyColumn: "PrimaryImage",
                keyValue: null,
                column: "PrimaryImage",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "PrimaryImage",
                table: "Reviews",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "longblob",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
