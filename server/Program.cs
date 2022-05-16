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
app.Services
    .CreateScope()
    .ServiceProvider
    .GetService<CirclesContext>()?
    .Database
    .Migrate();

app.UseCors("ClientPermission");

app.MapHub<CircleHub>("/hub/circle");
app.MapGet("/", () => "Hello World!");
//TODO: take from db
app.MapGet("/circles", () => new List<CircleDto> {
    new CircleDto(0, 0, 20, "blue"),
    new CircleDto(40, 50, 25, "orange"),
    new CircleDto(20, 100, 10, "green"),
 } );

app.Run();
