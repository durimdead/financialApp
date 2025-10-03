using FinanceApi.Models.Enums;
using FinanceApi.Repositories;
using FinanceApi.Repositories.Interfaces;
using FinanceApi.Services.RepositoryServices.Expenses;
using FinanceApi.Services.RepositoryServices.Expenses.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using static FinanceApi.Models.Enums.ConfigEnums;

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

// set up the correct injectables for the database type (defaults to "mssql")
var databaseType = builder.Configuration.GetValue<string>("AppSettings:DatabaseType");
if (databaseType == null || databaseType == string.Empty || databaseType.ToLower() == "mssql")
{
    builder.Services.AddDbContext<FinancialAppContext_MSSQL>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("FinancialAppDatabase_MSSQL")));
    builder.Services.AddScoped<IExpenseDbContext, FinancialAppContext_MSSQL>();
    builder.Services.AddOptions<ExpenseRepoService_MSSQL>();
    builder.Services.AddScoped<IExpensesRepository, ExpenseRepoService_MSSQL>();
}
else if (databaseType.ToLower() == "postgres")
{
    builder.Services.AddDbContext<FinancialAppContext_Postgres>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("FinancialAppDatabase_Postgres")));
    builder.Services.AddScoped<IExpenseDbContext, FinancialAppContext_Postgres>();
    builder.Services.AddOptions<ExpenseRepoService_Postgres>();
    builder.Services.AddScoped<IExpensesRepository, ExpenseRepoService_Postgres>();
}

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
