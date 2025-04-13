namespace VectorNotes.Server.DTO
{
    public record class NoteDto(int Id, string Title, string Content, int NoteCollectionId, IList<TagDto> Tags)
    {
    }
}
