using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface ITestimonialService
    {
        IEnumerable<TestimonialDto> GetTestimonials();
    }
}
