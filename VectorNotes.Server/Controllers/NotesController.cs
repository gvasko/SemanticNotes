using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VectorNotes.Server.DTO;

namespace VectorNotes.Server.Controllers
{
    [Route("api/notes")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IList<NoteListInfoDto>> GetAllNotesByUser()
        {
            var notes = new NoteListInfoDto[]
            {
                new(1, "Example 1", "Content 1"),
                new(2, "Example 2", "Content 2"),
                new(3, "Example 3", "Content 3"),
                new(4, "Example 4", "Content 4"),
                new(5, "Example 5", "Content 5"),
                new(6, "Example 6", "Content 6"),
                new(7, "Example 7", "Content 7")
            };

            return notes;
        }
    }
}
