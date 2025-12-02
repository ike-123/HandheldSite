using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HandheldSite.Server.Migrations
{
    /// <inheritdoc />
    public partial class handheldimg : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<byte[]>(
                name: "HandheldImg",
                table: "Handhelds",
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
                table: "Handhelds",
                keyColumn: "HandheldImg",
                keyValue: null,
                column: "HandheldImg",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "HandheldImg",
                table: "Handhelds",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(byte[]),
                oldType: "longblob",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
