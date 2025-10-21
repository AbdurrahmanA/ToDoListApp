using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AngularWithASP.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddUserIdToToDos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApplicationUserId",
                table: "ToDos",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_ToDos_ApplicationUserId",
                table: "ToDos",
                column: "ApplicationUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ToDos_AspNetUsers_ApplicationUserId",
                table: "ToDos",
                column: "ApplicationUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ToDos_AspNetUsers_ApplicationUserId",
                table: "ToDos");

            migrationBuilder.DropIndex(
                name: "IX_ToDos_ApplicationUserId",
                table: "ToDos");

            migrationBuilder.DropColumn(
                name: "ApplicationUserId",
                table: "ToDos");
        }
    }
}
