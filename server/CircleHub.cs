using D3SignalServer.Dtos;
using D3SignalServer.Interfases;
using Microsoft.AspNetCore.SignalR;

namespace D3SignalServer.Signal;

public class CircleHub : Hub<ICirclesClient>
{
    public async Task CreateCircle(NewCircleDto newCircle)
    {
        Console.WriteLine($"CreateCircle (x: {newCircle.X} y: {newCircle.Y})");
        var circle = new CircleDto(
            X: newCircle.X, 
            Y: newCircle.Y,
            R: 20, //TODO: randomize it
            Color: "red"); //TODO: randomize it
        //TODO: add to db
        
        // TODO: check, how to send messages to not all clients
        await Clients.All.NewCircle(circle);
    }
}