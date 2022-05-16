using Microsoft.EntityFrameworkCore;

namespace D3SignalServer.Models;

public interface ICirclesContext
{
    DbSet<Circle> Circles { get; }
}

public class CirclesContext: DbContext, ICirclesContext
{
    public CirclesContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Circle> Circles => Set<Circle>();
}