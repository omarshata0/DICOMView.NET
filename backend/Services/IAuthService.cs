using System;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(UserRegisterDto request);
        Task<TokenResponseDto?> LoginAsync(UserLoginDto request);
        Task<TokenResponseDto?> RefreshTokensAsync(RefreshTokenRequestDto request);
        Task<User?> GetUserByIdAsync(int userId);
        Task LogoutAsync(int userId);
    }
}