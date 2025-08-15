FROM node:20

WORKDIR /app
COPY . .
RUN dotnet restore
RUN dotnet build --no-restore

CMD ["dotnet", "run"]