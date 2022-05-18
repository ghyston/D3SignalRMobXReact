using D3SignalServer.Dtos;

namespace D3SignalServer.Interfases;

public interface ICirclesClient
{
    Task CircleCreated(CircleDto dto);
    Task CircleRemoved(int id);
}