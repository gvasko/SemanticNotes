using Serilog;
using System.Net;

namespace VectorNotes.Server.Middleware
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (UnauthorizedAccessException ex)
            {
                await HandleAuthExceptionAsync(context, ex);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleAuthExceptionAsync(HttpContext context, UnauthorizedAccessException exception)
        {
            Log.Error(exception, "User authorization failed");

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;

            var result = new { message = "User could not be authorized." };
            return context.Response.WriteAsJsonAsync(result);
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            Log.Error(exception, "An unhandled exception has occurred");

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var result = new { message = "An unexpected error occurred. Please try again later." };
            return context.Response.WriteAsJsonAsync(result);
        }
    }
}

