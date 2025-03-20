using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
            IList<NoteDto>? noteDtoList = null;
            try
            {
                var noteList = (await uow.GetAllNotesByOwnerAsync()).ToList();
                noteDtoList = mapper.Map<IList<NoteDto>>(noteList);
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
            return Ok(noteDtoList);
        }
    }
}
