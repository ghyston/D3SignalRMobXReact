using D3SignalServer.Dtos;

namespace D3SignalServer.Models;

public class Circle
{
    public int Id { get; set; }
    public int X { get; set; }
    public int Y { get; set; }
    public int R { get; set; }
    public string Color { get; set; } = string.Empty;

    public CircleDto CreateDto() => new CircleDto( // Automaaaaap
            Id: Id,
            X: X, 
            Y: Y,
            R: R,
            Color: Color);
}