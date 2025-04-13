using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VectorNotes.DomainModel;
using VectorNotes.Server.DTO;

namespace VectorNotes.Server.Controllers
{
    [Route("api/notecollection")]
    [ApiController]
    [Authorize(Policy = "ClientAppWithAuthenticatedUser")]
    public class NoteCollectionController : ControllerBase
    {
        private readonly IDomainUnitOfWork uow;
        private readonly IMapper mapper;

        public NoteCollectionController(IDomainUnitOfWork uow, IMapper mapper)
        {
            this.uow = uow;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IList<NoteCollectionPreviewDto>>> GetAllNoteCollections()
        {
            var noteCollections = await uow.GetAllNoteCollectionsAsync();
            var noteCollectionsDto = mapper.Map<IList<NoteCollectionPreviewDto>>(noteCollections);
            return Ok(noteCollectionsDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NoteCollectionDto>> GetNoteCollectionById(int id)
        {
            var noteCollection = await uow.GetNoteCollectionByIdAsync(id);
            var noteCollectionDto = mapper.Map<NoteCollectionDto>(noteCollection);
            return Ok(noteCollectionDto);
        }
    }
}
