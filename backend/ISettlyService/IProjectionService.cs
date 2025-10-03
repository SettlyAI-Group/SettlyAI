using SettlyModels.Dtos;
using System.Collections.Generic;

namespace ISettlyService
{
    public interface IProjectionService
    {
        List<ProjectionPointDto> ProjectWithoutFhss(SuperEstimateRequestDto request);
        List<ProjectionPointDto> ProjectWithFhss(SuperEstimateRequestDto request, decimal fhssAmount);
    }
}
