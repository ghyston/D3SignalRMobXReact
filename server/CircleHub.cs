using D3SignalServer.Dtos;
using D3SignalServer.Interfases;
using D3SignalServer.Models;
using Microsoft.AspNetCore.SignalR;

namespace D3SignalServer.Signal;

public class CircleHub : Hub<ICirclesClient>
{
    private readonly ICirclesContext circlesContext;

    public CircleHub(ICirclesContext circlesContext) => this.circlesContext = circlesContext;

    private static string[] ColorCodes = {"blue", "orange", "yellow", "green", "red"};
    
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
        
        var createDto = circle.CreateDto();
        await Clients.Group(circle.Color).CircleCreated(createDto);
        await Clients.Caller.CircleCreated(createDto);
    }

    public async Task RemoveCircle(int id)
    {
        Console.WriteLine($"RemoveCircle by id {id}");

        var circle = (await circlesContext.Circles.FindAsync(id))
            ?? throw new Exception($"Circle not found by id {id}");
        
        circlesContext.Circles.Remove(circle);
        await circlesContext.Save();

        await Clients.Group(circle.Color).CircleRemoved(circle.Id);
        await Clients.Caller.CircleRemoved(circle.Id);
    }

    public async Task SubscribeToColor(string color)
    {
        Console.WriteLine($"Client subscribed to group {color}");
        await Groups.AddToGroupAsync(Context.ConnectionId, color);
    }

    public async Task UnsubscribeToColor(string color)
    {
        Console.WriteLine($"Client unsubscribed to group {color}");
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, color);
    }
}