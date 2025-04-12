using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VectorNotes.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveOwnerFromNote : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NoteCollections_Users_OwnerId",
                schema: "vectornotes",
                table: "NoteCollections");

            migrationBuilder.DropForeignKey(
                name: "FK_Notes_Users_OwnerId",
                schema: "vectornotes",
                table: "Notes");

            migrationBuilder.DropIndex(
                name: "IX_Notes_OwnerId",
                schema: "vectornotes",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                schema: "vectornotes",
                table: "Notes");

            migrationBuilder.AlterColumn<int>(
                name: "OwnerId",
                schema: "vectornotes",
                table: "NoteCollections",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_NoteCollections_Users_OwnerId",
                schema: "vectornotes",
                table: "NoteCollections",
                column: "OwnerId",
                principalSchema: "vectornotes",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NoteCollections_Users_OwnerId",
                schema: "vectornotes",
                table: "NoteCollections");

            migrationBuilder.AddColumn<int>(
                name: "OwnerId",
                schema: "vectornotes",
                table: "Notes",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "OwnerId",
                schema: "vectornotes",
                table: "NoteCollections",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Notes_OwnerId",
                schema: "vectornotes",
                table: "Notes",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_NoteCollections_Users_OwnerId",
                schema: "vectornotes",
                table: "NoteCollections",
                column: "OwnerId",
                principalSchema: "vectornotes",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_Users_OwnerId",
                schema: "vectornotes",
                table: "Notes",
                column: "OwnerId",
                principalSchema: "vectornotes",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
