using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.Versioning;
using VectorNotes.DomainModel;
using VectorNotes.Server.DTO;

namespace VectorNotes.Server.Controllers
{
    [Route("api/note")]
    [ApiController]
    [Authorize(Policy = "ClientAppWithAuthenticatedUser")]
    public class NoteController : ControllerBase
    {
        private readonly IDomainUnitOfWork uow;
        private readonly IMapper mapper;

        public NoteController(IDomainUnitOfWork uow, IMapper mapper)
        {
            this.uow = uow;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IList<NotePreviewDto>>> GetAllNotes()
        {
            var noteList = (await uow.GetAllNotesAsync()).ToList();
            var noteDtoList = mapper.Map<IList<NotePreviewDto>>(noteList);
            return Ok(noteDtoList);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NoteDto>> GetNoteById(int id)
        {
            var note = (await uow.GetNoteByIdAsync(id));
            var noteDto = mapper.Map<NoteDto>(note);
            return Ok(noteDto);
        }

        [HttpPost]
        public async Task<ActionResult<NoteDto>> CreateNote(NoteDto newNote)
        {
            var note = mapper.Map<Note>(newNote);
            var dbNote = await uow.CreateNoteAsync(note);
            await uow.SaveAsync();
            return Ok(mapper.Map<NoteDto>(dbNote));
        }

        [HttpPut]
        public async Task<ActionResult<NoteDto>> UpdateNote(NoteDto updatedNote)
        {
            var note = mapper.Map<Note>(updatedNote);
            var dbNote = await uow.UpdateNoteAsync(note);
            await uow.SaveAsync();
            return Ok(mapper.Map<NoteDto>(dbNote));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteNote(int id)
        {
            await uow.DeleteNoteByIdAsync(id);
            return Ok();
        }
    }
}
