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
            try
            {
                var noteList = (await uow.GetAllNotesAsync()).ToList();
                var noteDtoList = mapper.Map<IList<NotePreviewDto>>(noteList);
                return Ok(noteDtoList);
            }
            catch (InvalidOperationException exc)
            {
                // TODO: log
                return Unauthorized();
            }
            catch (Exception exc)
            {
                // TODO: log
                return Problem();
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NoteDto>> GetNoteById(int id)
        {
            try
            {
                var note = (await uow.GetNoteByIdAsync(id));
                var noteDto = mapper.Map<NoteDto>(note);
                return Ok(noteDto);
            }
            catch (InvalidOperationException exc)
            {
                // TODO: log
                return Unauthorized();
            }
            catch (Exception exc)
            {
                // TODO: log
                return Problem();
            }
        }

        [HttpPost]
        public async Task<ActionResult<NoteDto>> CreateNote(NoteDto newNote)
        {
            try
            {
                var note = mapper.Map<Note>(newNote);
                var dbNote = await uow.CreateNoteAsync(note);
                await uow.SaveAsync();
                return Ok(mapper.Map<NoteDto>(dbNote));
            }
            catch (InvalidOperationException exc)
            {
                // TODO: log
                return Unauthorized();
            }
            catch (Exception exc)
            {
                // TODO: log
                return Problem();
            }
        }

        [HttpPut]
        public async Task<ActionResult<NoteDto>> UpdateNote(NoteDto updatedNote)
        {
            try
            {
                var note = mapper.Map<Note>(updatedNote);
                var dbNote = await uow.UpdateNoteAsync(note);
                await uow.SaveAsync();
                return Ok(mapper.Map<NoteDto>(dbNote));
            }
            catch (InvalidOperationException exc)
            {
                // TODO: log
                return Unauthorized();
            }
            catch (Exception exc)
            {
                // TODO: log
                return Problem();
            }
        }
    }
}
