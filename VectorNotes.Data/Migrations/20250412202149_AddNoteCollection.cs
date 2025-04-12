using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VectorNotes.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNoteCollection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notes_Users_OwnerId",
                schema: "vectornotes",
                table: "Notes");

            migrationBuilder.AlterColumn<int>(
                name: "OwnerId",
                schema: "vectornotes",
                table: "Notes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "NoteCollectionId",
                schema: "vectornotes",
                table: "Notes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "NoteCollections",
                schema: "vectornotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteCollections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NoteCollections_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalSchema: "vectornotes",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notes_NoteCollectionId",
                schema: "vectornotes",
                table: "Notes",
                column: "NoteCollectionId");

            migrationBuilder.CreateIndex(
                name: "IX_NoteCollections_OwnerId",
                schema: "vectornotes",
                table: "NoteCollections",
                column: "OwnerId");

            migrationBuilder.Sql(@"
                INSERT INTO vectornotes.NoteCollections (Name, OwnerId)
                SELECT 'Default', Id FROM vectornotes.Users
            ");

            migrationBuilder.Sql(@"
                UPDATE n SET n.NoteCollectionId = nc.Id
                FROM vectornotes.Notes n
                INNER JOIN vectornotes.NoteCollections nc
                ON n.OwnerId = nc.OwnerId
            ");

            migrationBuilder.AlterColumn<int>(
                name: "NoteCollectionId",
                schema: "vectornotes",
                table: "Notes",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_NoteCollections_NoteCollectionId",
                schema: "vectornotes",
                table: "Notes",
                column: "NoteCollectionId",
                principalSchema: "vectornotes",
                principalTable: "NoteCollections",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notes_NoteCollections_NoteCollectionId",
                schema: "vectornotes",
                table: "Notes");

            migrationBuilder.DropForeignKey(
                name: "FK_Notes_Users_OwnerId",
                schema: "vectornotes",
                table: "Notes");

            migrationBuilder.DropTable(
                name: "NoteCollections",
                schema: "vectornotes");

            migrationBuilder.DropIndex(
                name: "IX_Notes_NoteCollectionId",
                schema: "vectornotes",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "NoteCollectionId",
                schema: "vectornotes",
                table: "Notes");

            migrationBuilder.AlterColumn<int>(
                name: "OwnerId",
                schema: "vectornotes",
                table: "Notes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Notes_Users_OwnerId",
                schema: "vectornotes",
                table: "Notes",
                column: "OwnerId",
                principalSchema: "vectornotes",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
