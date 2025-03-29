using AutoMapper;
using VectorNotes.DomainModel;

namespace VectorNotes.Server.DTO
{
    public class AutoMapperProfile : Profile
    {
        public const int MaxNoteContentLength = 64;
        public AutoMapperProfile()
        {
            CreateMap<User, UserInfoDto>().ReverseMap();
            CreateMap<Tag, TagDto>().ReverseMap();
            CreateMap<Note, NoteDto>().ReverseMap();
            CreateMap<Note, NotePreviewDto>().ForMember(noteDto => noteDto.ContentPreview, opt => opt.MapFrom(note => note.Content.Substring(0, Math.Min(note.Content.Length, MaxNoteContentLength))));
        }
    }
}
