var allowLocalhostOrigins = "localhost";
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowLocalhostOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:4200",
                                              "https://localhost:4200");
                      });
});

// Add services to the container.

builder.Services.AddControllers();

var app = builder.Build();

// CORS
app.UseCors(allowLocalhostOrigins);

// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
