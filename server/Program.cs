using D3SignalServer.Dtos;
using D3SignalServer.Models;
using D3SignalServer.Signal;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add database
var connectionString = builder.Configuration.GetConnectionString("db");
builder.Services.AddDbContext<CirclesContext>(ops => 
    ops.UseNpgsql(connectionString));
builder.Services.AddScoped<ICirclesContext>(p => p.GetService<CirclesContext>()!);

// Add Services
builder.Services.AddSignalR();
builder.Services.AddCors(opt => //TODO: investigate, which policies are really needed
{
    opt.AddPolicy("ClientPermission", policy => {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .WithOrigins("http://localhost:3000")
            .AllowCredentials();
    });
});

var app = builder.Build();

// automigration
var context = app.Services
    .CreateScope()
    .ServiceProvider
    .GetService<CirclesContext>();

context?
    .Database
    .Migrate();

app.UseCors("ClientPermission");

app.MapHub<CircleHub>("/hub/circle");
app.MapGet("/", () => "Hello World!");
app.MapGet("/circles", () => context?.Circles.Select(c => c.CreateDto()).ToList() ??  new List<CircleDto>() );

app.Run();
