using FinanceApi.Repositories;
using FinanceApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

var allowLocalhostOrigins = "localhost";
var builder = WebApplication.CreateBuilder(args);

// add in API mapping
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Info.Contact = new OpenApiContact
        {
            Name = "David Lancellotti (CODUR LLC)",
            Email = "david.lancellotti.jobs+sampleProject@gmail.com"
        };
        return Task.CompletedTask;
    });
});


builder.Services.AddCors(options =>
{
    options.AddPolicy(name: allowLocalhostOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:4200","https://localhost:4200")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                      });
});
builder.Services.AddDbContext<FinancialAppContext_MSSQL>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("FinancialAppDatabase")));
//builder.Services.AddDbContext<FinancialAppContext_Postgres>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("FinancialAppDatabase")));

// Add services to the container.
builder.Services.AddControllers();
var app = builder.Build();

// maps the API
app.MapOpenApi("OpenApi/v1/OpenApiDoc.json");

// CORS
app.UseCors(allowLocalhostOrigins);

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
