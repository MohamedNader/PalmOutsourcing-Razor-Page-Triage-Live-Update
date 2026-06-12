namespace OrderHubApp.web.Models;

public class LineItem
{
    public int Id { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Embroidery { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
}