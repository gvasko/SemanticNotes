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
        private readonly IOwnerEnsuredUnitOfWork uow;
        private readonly IMapper mapper;

        public NoteController(IOwnerEnsuredUnitOfWork uow, IMapper mapper)
        {
            this.uow = uow;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IList<NoteDto>>> GetAllNotesByUser()
        {
            try
            {
                var noteList = (await uow.GetAllNotesByOwnerAsync()).ToList();
                var noteDtoList = mapper.Map<IList<NoteDto>>(noteList);
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
    }
}
