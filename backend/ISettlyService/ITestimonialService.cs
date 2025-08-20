using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface ITestimonialService
    {
        Task<IEnumerable<TestimonialDto>> GetTestimonialsAsync();
    }
}
