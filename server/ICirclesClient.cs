using D3SignalServer.Dtos;

namespace D3SignalServer.Interfases;

public interface ICirclesClient
{
    Task NewCircle(CircleDto dto);
}