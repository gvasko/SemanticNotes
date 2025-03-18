namespace VectorNotes.DomainModel
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }

        public User()
        {
            Name = string.Empty;
            Email = string.Empty;
        }
    }
}
