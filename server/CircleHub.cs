using D3SignalServer.Dtos;
using D3SignalServer.Interfases;
using D3SignalServer.Models;
using Microsoft.AspNetCore.SignalR;

namespace D3SignalServer.Signal;

public class CircleHub : Hub<ICirclesClient>
{
    private readonly ICirclesContext circlesContext;

    public CircleHub(ICirclesContext circlesContext) => this.circlesContext = circlesContext;

    private static string[] ColorCodes = {"blue", "orange", "yellow", "green"};
    
    private string RandomColor()
    {
        var random = new Random();
        int index = random.Next(0, ColorCodes.Length);
        return ColorCodes[index];
    }

    public async Task CreateCircle(NewCircleDto newCircle)
    {
        Console.WriteLine($"CreateCircle (x: {newCircle.X} y: {newCircle.Y})");
        var circle = new Circle()
        {
            X = newCircle.X, 
            Y = newCircle.Y,
            R = (new Random()).Next(5, 35),
            Color = RandomColor()
        };

        circlesContext.Circles.Add(circle);
        await circlesContext.Save();
        
        // TODO: check, how to send messages to not all clients
        await Clients.All.CircleCreated(circle.CreateDto());
    }

    public async Task RemoveCircle(int id)
    {
        Console.WriteLine($"RemoveCircle by id {id}");

        var circle = (await circlesContext.Circles.FindAsync(id))
            ?? throw new Exception($"Circle not found by id {id}");
        
        circlesContext.Circles.Remove(circle);
        await circlesContext.Save();

        // TODO: check, how to send messages to not all clients
        await Clients.All.CircleRemoved(circle.Id);
    }
}