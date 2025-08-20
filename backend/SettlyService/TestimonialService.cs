using SettlyModels.Dtos;
using ISettlyService;


namespace SettlyService
{
    public class TestimonialService : ITestimonialService
    {
        public async Task<IEnumerable<TestimonialDto>> GetTestimonialsAsync()
        {
            return await Task.FromResult(new List<TestimonialDto>
            {
                new TestimonialDto
                {
                    Id = 1,
                    Name = "Alice Johnson",
                    AvatarUrl = "/static/images/avatar/1.jpg",
                    Quote = "SettlyAI made my move so much smoother. Highly recommend!"
                },
                new TestimonialDto
                {
                    Id = 2,
                    Name = "Michael Chen",
                    AvatarUrl = "/static/images/avatar/1.jpg",
                    Quote = "The reports are clear and easy to understand. Game changer!"
                },
                new TestimonialDto
                {
                    Id = 3,
                    Name = "Sofia Martinez",
                    AvatarUrl = "/static/images/avatar/1.jpg",
                    Quote = "I saved so much time with SettlyAI’s insights."
                }
            });
        }
    }
}
