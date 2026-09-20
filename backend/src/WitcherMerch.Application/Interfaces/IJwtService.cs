using WitcherMerch.Domain.Entities;

namespace WitcherMerch.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
    string GenerateRefreshToken();
}
