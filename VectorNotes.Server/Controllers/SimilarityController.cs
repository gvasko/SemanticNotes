using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Serilog;
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

        [HttpGet("{collectionId}/{noteId}")]
        public async Task<ActionResult<NoteSimilarityResultDto>> GetSimilarNotes(int collectionId, int noteId)
        {
            var note = await uow.GetNoteByIdAsync(noteId);
            var collection = await uow.GetNoteCollectionByIdAsync(collectionId);

            if (note == null || collection == null)
            {
                return Ok(Array.Empty<int>().ToList());
            }

            var result = await simService.FindSimilarNotesInCollection(note, 10, collection);
            var resultDto = mapper.Map<NoteSimilarityResultDto>(result);
            return Ok(resultDto);
        }

        [HttpGet("matrix/{noteCollectionId}")]
        public async Task<SimilarityMatrixDto> GetSimilarityMatrix(int noteCollectionId)
        {
            var notes = (await uow.GetNoteCollectionByIdAsync(noteCollectionId))?.Notes ?? [];

            var result = new SimilarityMatrixDto()
            {
                NoteIds = [.. notes.Select(n => n.Id)],
                Values = new double[notes.Count][]
            };

            for (int i = 0; i < notes.Count; i++)
            {
                Log.Information("Generating matrix row {i}/{n}", i, notes.Count);
                result.Values[i] = new double[notes.Count];
                result.Values[i][i] = 1.0;
                var vector1 = await simService.GetTextVector(notes[i]);
                for (int j = 0; j < i; j++)
                {
                    var vector2 = await simService.GetTextVector(notes[j]);
                    result.Values[i][j] = result.Values[j][i] = vector1.Similarity(vector2);
                }
            }

            return result;
        }


    }
}
