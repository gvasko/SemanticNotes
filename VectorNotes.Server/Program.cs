using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using VectorNotes.Data;
using VectorNotes.DomainModel;
using VectorNotes.Server.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddScoped<IUserService, StrictUserService>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
//app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
