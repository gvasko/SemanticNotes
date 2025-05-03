namespace VectorNotes.Server.DTO
{
    public record class NotePreviewDto(int Id, string Title, string ContentPreview, int NoteCollectionId, IList<TagDto> Tags)
    {
        public NotePreviewDto() : this(0, "", "", 0, [])
        {
        }
    }
}
