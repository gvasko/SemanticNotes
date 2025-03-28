using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using Serilog;
using VectorNotes.Data;
using VectorNotes.Data.Infrastructure;
using VectorNotes.DomainModel;
using VectorNotes.Server.DTO;
using VectorNotes.Server.Infrastructure;

Log.Logger = new LoggerConfiguration().MinimumLevel.Debug().WriteTo.Console().CreateLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSerilog(lc => lc.ReadFrom.Configuration(builder.Configuration));

builder.Services.AddHttpContextAccessor();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(options =>
    {
        builder.Configuration.Bind("AzureAd", options);
        options.IncludeErrorDetails = true;
        //options.TokenValidationParameters.NameClaimType = "name";
        //options.Events = new JwtBearerEvents();

        //options.Events.OnTokenValidated = context =>
        //{

        //    string? clientappId = context?.Principal?.Claims
        //        .FirstOrDefault(x => x.Type == "azp" || x.Type == "appid")?.Value;

        //    //Log.Information("ClientAppId: {clientappid}", clientappId);
        //    return Task.CompletedTask;
        //};

        //options.Events.OnForbidden = context =>
        //{
        //    //Log.Warning("forbidden");
        //    return Task.CompletedTask;
        //};

    }, options => { builder.Configuration.Bind("AzureAd", options); }, subscribeToJwtBearerMiddlewareDiagnosticsEvents: true);

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("ClientApp", policy =>
        policy.RequireScope("Notes.Manage"))
    .AddPolicy("ClientAppWithAuthenticatedUser", policy =>
        policy.RequireScope("Notes.Manage")
        .RequireAuthenticatedUser());

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<VectorNotesContext>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, StrictUserService>();
builder.Services.AddScoped<IBasicUnitOfWork, BasicUnitOfWork>();
builder.Services.AddScoped<IDomainUnitOfWork, DomainUnitOfWork>();
builder.Services.AddScoped<ITextVectorBuilder, TextVectorBuilder>();
builder.Services.AddScoped<INoteSimilarityFinderService, NoteSimilarityFinderService>();
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));


var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<VectorNotesContext>();
    dbContext.Database.Migrate();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseDeveloperExceptionPage();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
