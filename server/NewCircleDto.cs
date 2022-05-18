namespace D3SignalServer.Dtos;

public record NewCircleDto(int X, int Y);

public record CircleDto(int Id, int X, int Y, int R, string Color);