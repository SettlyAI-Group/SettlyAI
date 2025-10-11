export interface ProjectionPointDto {
  age: number;
  balance: number;
}

export interface SuperEstimateRequestDto {
  balance: number;
  annualIncome: number;
  age: number;
  targetAge: number;
  contributionRate: number;
  fhssAmount?: number;
  fhssSelected: boolean;
}

export interface SuperEstimateResponseDto {
  withoutFhss: ProjectionPointDto[];
  withFhss?: ProjectionPointDto[];
  netDifference?: number;
}

export async function estimateSuper(
  request: SuperEstimateRequestDto
): Promise<SuperEstimateResponseDto> {
  const response = await fetch("/api/super/estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch super estimate";

    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}
