using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using VectorNotes.DomainModel;
using VectorNotes.Server.DTO;

namespace VectorNotes.Server.Controllers
{
    [Route("api/similarity")]
    [ApiController]
    [Authorize(Policy = "ClientAppWithAuthenticatedUser")]
    public class SimilarityController : ControllerBase
    {
        private readonly IDomainUnitOfWork uow;
        private readonly INoteSimilarityFinderService simService;
        private readonly IMapper mapper;

        public SimilarityController(IDomainUnitOfWork uow, INoteSimilarityFinderService simService, IMapper mapper)
        {
            this.uow = uow;
            this.simService = simService;
            this.mapper = mapper;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NoteSimilarityResultDto>> GetSimilarNotes(int id)
        {
            var note = (await uow.GetNoteByIdAsync(id));

            if (note == null)
            {
                return Ok(Array.Empty<int>().ToList());
            }

            var result = await simService.FindSimilarNotes(note, 10);
            var resultDto = mapper.Map<NoteSimilarityResultDto>(result);
            return Ok(resultDto);
        }


    }
}
