namespace VectorNotes.Server.DTO
{
    public record class NoteCollectionDto(int Id, string Name, IList<NotePreviewDto> Notes)
    {
    }
}
