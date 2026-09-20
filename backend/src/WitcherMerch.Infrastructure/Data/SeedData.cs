using WitcherMerch.Domain.Entities;
using WitcherMerch.Domain.Enums;

namespace WitcherMerch.Infrastructure.Data;

public static class SeedData
{
    public static void Seed(AppDbContext db)
    {
        if (db.Categories.Any()) return;

        // ── Categories ──
        var swords = new Category { Id = Guid.NewGuid(), Name = "Swords & Weapons / Мечи и Оружие", Slug = "swords-weapons", Description = "Steel and silver swords. / Стальные и серебряные мечи." };
        var apparel = new Category { Id = Guid.NewGuid(), Name = "Apparel / Одежда", Slug = "apparel", Description = "Witcher-themed clothing. / Одежда в стиле Ведьмака." };
        var potions = new Category { Id = Guid.NewGuid(), Name = "Potions & Alchemy / Зелья и Алхимия", Slug = "potions-alchemy", Description = "Potion bottles and kits. / Эликсиры и наборы." };
        var books = new Category { Id = Guid.NewGuid(), Name = "Books & Lore / Книги и Лор", Slug = "books-lore", Description = "Novels and art books. / Книги и бестиарии." };
        var collectibles = new Category { Id = Guid.NewGuid(), Name = "Collectibles / Коллекционки", Slug = "collectibles", Description = "Figures and medallions. / Фигурки и медальоны." };

        db.Categories.AddRange(swords, apparel, potions, books, collectibles);

        // ── Products ──
        var products = new List<Product>();

        // 1. Swords & Weapons (10)
        products.Add(new() { Id = Guid.NewGuid(), Name = "Aerondight / Аэрондит", Slug = "aerondight-silver-sword", Description = "Legendary silver sword. / Легендарный серебряный меч.", Price = 349.99m, DiscountPrice = 299.99m, ImageUrl = "https://avatars.mds.yandex.net/i?id=d906a94de0792fb90c03008fec24c910_l-5232624-images-thumbs&n=13", StockQuantity = 15, IsFeatured = true, CategoryId = swords.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "Iris / Стальной меч Ирис", Slug = "iris-von-everec-steel-sword", Description = "Haunted steel blade. / Одержимый стальной клинок.", Price = 279.99m, ImageUrl = "https://cs1.livemaster.ru/storage/93/3d/e10ad34bd464d8015540d5eaa9mc--subkultury-sablya-iris-iz-vedmak-3-dikaya-ohota.jpg", StockQuantity = 10, IsFeatured = false, CategoryId = swords.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "Wild Hunt Crossbow / Арбалет Дикой Охоты", Slug = "crossbow-wild-hunt", Description = "Frost-touched crossbow. / Задеревеневший от мороза арбалет.", Price = 189.99m, ImageUrl = "https://gamer-mods.ru/_ld/45/44237430.jpg", StockQuantity = 20, IsFeatured = false, CategoryId = swords.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "Zirael / Ласточка (Меч Цири)", Slug = "zirael-sword-ciris-blade", Description = "Elven-forged gnomish steel. / Эльфийский меч из гномьей стали.", Price = 399.99m, DiscountPrice = 349.99m, ImageUrl = "https://basket-12.wbbasket.ru/vol1711/part171186/171186932/images/big/1.webp", StockQuantity = 8, IsFeatured = true, CategoryId = swords.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = $"Steel Sword / Стальной меч", Slug = $"witcher-steel-sword-", Description = $"Standard steel sword. / Стандартный стальной меч.", Price = 100m + 10, ImageUrl = "https://avatars.mds.yandex.net/i?id=01897caefcc0cf789025131664391582_l-9065755-images-thumbs&n=13", StockQuantity = 5, IsFeatured = false, CategoryId = swords.Id });

        // 2. Apparel (10)
        products.Add(new() { Id = Guid.NewGuid(), Name = "Wolf Medallion Hoodie / Худи Школа Волка", Slug = "wolf-school-medallion-hoodie", Description = "Premium hoodie. / Премиальное худи с вышивкой.", Price = 79.99m, ImageUrl = "https://static.eldorado.ru/img1/b/bb/36567400.jpg", StockQuantity = 50, IsFeatured = true, CategoryId = apparel.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "Gerald T-Shirt / Футболка Геральд", Slug = "kaer-morhen-training-t-shirt", Description = "Vintage workout tee. / Винтажная тренировочная футболка.", Price = 34.99m, ImageUrl = "https://avatars.mds.yandex.net/get-mpic/16866742/2a0000019959cbb2d661c0d23c37713cac5a/orig", StockQuantity = 100, IsFeatured = false, CategoryId = apparel.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "Nilfgaardian Cloak / Нильфгаардский плащ", Slug = "nilfgaardian-officer-cloak", Description = "Wool blend cloak. / Плащ офицера из шерсти.", Price = 149.99m, DiscountPrice = 119.99m, ImageUrl = "https://avatars.mds.yandex.net/get-mpic/18412796/2a0000019a47f9d149bf5614fc921aab3643/orig", StockQuantity = 25, IsFeatured = false, CategoryId = apparel.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "Yennefer Scarf / Шарф Йеннифэр", Slug = "yennefer-scarf", Description = "Lilac & Gooseberry scarf. / Шарф с запахом сирени и крыжовника.", Price = 59.99m, ImageUrl = "https://ir.ozone.ru/s3/multimedia-1-t/8033919761.jpg", StockQuantity = 40, IsFeatured = true, CategoryId = apparel.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = $"Witcher School Tee / Футболка ведьмака", Slug = $"witcher-school-shirt-", Description = $"Cotton t-shirt. / Хлопковая футболка.", Price = 25.99m, ImageUrl = "https://cdn1.ozone.ru/s3/multimedia-0/c600/6108443880.jpg", StockQuantity = 30, IsFeatured = false, CategoryId = apparel.Id });

        // 3. Potions & Alchemy (10)
        products.Add(new() { Id = Guid.NewGuid(), Name = "Elixir Thunder / Зелье Гром", Slug = "swallow-potion-bottle", Description = "Healing potion replica. / Реплика зелья.", Price = 44.99m, ImageUrl = "https://avatars.mds.yandex.net/get-shedevrum/12365046/img_19425b5def5411ee93c89a79ffaf5bd2/orig", StockQuantity = 60, IsFeatured = true, CategoryId = potions.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "Candle White Honey / Свеча Белый Мёд", Slug = "white-honey-mead-set", Description = "Clearing potion set. / Набор для очищения от интоксикации.", Price = 64.99m, ImageUrl = "https://ir.ozone.ru/s3/multimedia-1-k/wc1000/7673013668.jpg", StockQuantity = 30, IsFeatured = false, CategoryId = potions.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "Alchemy Kit / Эдиксир Баллады Лютика", Slug = "alchemy-ingredient-set", Description = "Includes 20 ingredients. / Включает 20 редких ингредиентов.", Price = 89.99m, DiscountPrice = 74.99m, ImageUrl = "https://ir.ozone.ru/s3/multimedia-1-q/wc1000/8209420406.jpg", StockQuantity = 18, IsFeatured = false, CategoryId = potions.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "Thunderbolt Candle / Свеча Гром", Slug = "thunderbolt-candle", Description = "Rain forest scent. / Аромат дремучего леса.", Price = 29.99m, ImageUrl = "https://cdn1.ozone.ru/s3/multimedia-1-j/c600/7672981159.jpg", StockQuantity = 75, IsFeatured = false, CategoryId = potions.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = $"Elixir Black Blood / Эликсир Черная кровь", Slug = $"decoction-replica-", Description = $"Mutagen decoction bottle. / Реплика отвара.", Price = 34.99m, ImageUrl = "https://ir.ozone.ru/s3/multimedia-1-8/wc1000/7384899032.jpg", StockQuantity = 20, IsFeatured = false, CategoryId = potions.Id });

        // 4. Books & Lore (10)
        products.Add(new() { Id = Guid.NewGuid(), Name = "The World of The Witcher / Мир Ведьмака", Slug = "world-of-witcher-compendium", Description = "Comprehensive lore book. / Иллюстрированная энциклопедия.", Price = 49.99m, ImageUrl = "https://ir.ozone.ru/s3/multimedia-1-i/wc1000/7322976558.jpg", StockQuantity = 35, IsFeatured = true, CategoryId = books.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "Bestiary / Бестиарий Континента", Slug = "bestiary-of-continent", Description = "Guide to every monster. / Руководство по монстрам.", Price = 69.99m, DiscountPrice = 54.99m, ImageUrl = "https://ir.ozone.ru/s3/multimedia-1-7/wc1000/8425590919.jpg", StockQuantity = 22, IsFeatured = true, CategoryId = books.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "The Ballad of Two Wolves / Баллада о двух Волках", Slug = "dandelion-ballad-collection", Description = "Songbook from the Bard. / Сборник стихов знаменитого барда.", Price = 24.99m, ImageUrl = "https://ir.ozone.ru/s3/multimedia-1-l/wc1000/8343628869.jpg", StockQuantity = 45, IsFeatured = false, CategoryId = books.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "The Last Wish / Последнее Желание", Slug = "last-wish-collectors", Description = "Collector's edition. / Коллекционное издание.", Price = 39.99m, ImageUrl = "https://ir.ozone.ru/s3/multimedia-1-t/wc1000/7179967253.jpg", StockQuantity = 55, IsFeatured = false, CategoryId = books.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = $"Histoire de The Witcher / Ведьмак. История франшизы", Slug = $"lore-journal-", Description = $"Detailed accounts. / Детальные рассказы.", Price = 19.99m, ImageUrl = "https://content.img-gorod.ru/pim/products/images/4d/88/018f5e81-9e35-7c79-8ac5-67fcd2e44d88.jpg?width=2880&height=1544", StockQuantity = 40, IsFeatured = false, CategoryId = books.Id });

        // 5. Collectibles & Figures (10)
        products.Add(new() { Id = Guid.NewGuid(), Name = "Geralt Figure / Фигурка Геральта", Slug = "geralt-premium-figure", Description = "12-inch hand-painted figure. / Окрашенная вручную фигурка.", Price = 199.99m, DiscountPrice = 169.99m, ImageUrl = "https://n.cdn.cdek.shopping/images/shopping/9ee93bdf934e4e54a824bb9b1e2c35e3.jpg?v=1", StockQuantity = 12, IsFeatured = true, CategoryId = collectibles.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "Wolf Medallion / Медальон Волка", Slug = "wolf-school-medallion-metal", Description = "Die-cast metal medallion. / Металлический медальон Школы Волка.", Price = 49.99m, ImageUrl = "https://img-edg.joomcdn.net/cae20835fb69888149bf29c04fcec8c4fb16d064_original.jpeg", StockQuantity = 80, IsFeatured = true, CategoryId = collectibles.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "Gwent Set / Набор для Гвинта", Slug = "gwent-northern-realms", Description = "Complete Northern deck. / Колода Королевств Севера.", Price = 34.99m, ImageUrl = "https://cs1.livemaster.ru/storage/c2/65/31f062dd5760fda33dc68c9503fx--aktivnyj-otdyh-i-razvlecheniya-gvint-vedmak-3-polnyj-nabor-iz.jpg", StockQuantity = 65, IsFeatured = false, CategoryId = collectibles.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = "Triss Statue / Статуэтка Трисс", Slug = "triss-merigold-statue", Description = "8-inch polystone statue. / Детализированная 8-дюймовая статуэтка.", Price = 159.99m, ImageUrl = "https://www.gamebuy.ru/sites/default/files/imagecache/screenshot_1280_accessorie/covers/witcher-3-wild-hunt-triss-merigold-series-2-b_main_cover.png", StockQuantity = 14, IsFeatured = false, CategoryId = collectibles.Id });
        products.Add(new() { Id = Guid.NewGuid(), Name = $"Gwent Pack / Бустер Гвинт", Slug = $"gwent-booster-", Description = $"Random 5 cards. / Случайные 5 карт.", Price = 9.99m, ImageUrl = "https://cdn.lifehacker.ru/wp-content/uploads/2024/12/collage_2_1733509928_lh_average_step_2.png", StockQuantity = 100, IsFeatured = false, CategoryId = collectibles.Id });

        db.Products.AddRange(products);

        // ── Admin User ──
        db.Users.Add(new User
        {
            Id = Guid.NewGuid(),
            Username = "admin",
            Email = "admin@witchermerch.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = UserRole.Admin
        });

        db.SaveChanges();
    }
}
