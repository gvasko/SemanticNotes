using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VectorNotes.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAlphabetAndCache : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Email",
                schema: "vectornotes",
                table: "Users",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateTable(
                name: "Alphabets",
                schema: "vectornotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OwnerId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alphabets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Alphabets_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalSchema: "vectornotes",
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LetterVector",
                schema: "vectornotes",
                columns: table => new
                {
                    AlphabetId = table.Column<int>(type: "int", nullable: false),
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Letter = table.Column<string>(type: "nvarchar(1)", nullable: false),
                    Vector_Data = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LetterVector", x => new { x.AlphabetId, x.Id });
                    table.ForeignKey(
                        name: "FK_LetterVector_Alphabets_AlphabetId",
                        column: x => x.AlphabetId,
                        principalSchema: "vectornotes",
                        principalTable: "Alphabets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NoteTextVectorCache",
                schema: "vectornotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NoteId = table.Column<int>(type: "int", nullable: true),
                    AlphabetId = table.Column<int>(type: "int", nullable: true),
                    Vector_Data = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteTextVectorCache", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NoteTextVectorCache_Alphabets_AlphabetId",
                        column: x => x.AlphabetId,
                        principalSchema: "vectornotes",
                        principalTable: "Alphabets",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_NoteTextVectorCache_Notes_NoteId",
                        column: x => x.NoteId,
                        principalSchema: "vectornotes",
                        principalTable: "Notes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                schema: "vectornotes",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Alphabets_OwnerId",
                schema: "vectornotes",
                table: "Alphabets",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_NoteTextVectorCache_AlphabetId",
                schema: "vectornotes",
                table: "NoteTextVectorCache",
                column: "AlphabetId");

            migrationBuilder.CreateIndex(
                name: "IX_NoteTextVectorCache_NoteId",
                schema: "vectornotes",
                table: "NoteTextVectorCache",
                column: "NoteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LetterVector",
                schema: "vectornotes");

            migrationBuilder.DropTable(
                name: "NoteTextVectorCache",
                schema: "vectornotes");

            migrationBuilder.DropTable(
                name: "Alphabets",
                schema: "vectornotes");

            migrationBuilder.DropIndex(
                name: "IX_Users_Email",
                schema: "vectornotes",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                schema: "vectornotes",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
