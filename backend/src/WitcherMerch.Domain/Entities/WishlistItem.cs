namespace WitcherMerch.Domain.Entities;

public class WishlistItem
{
    public Guid Id { get; set; }
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid ProductId { get; set; }
    public Product Product { get; set; } = null!;
}
