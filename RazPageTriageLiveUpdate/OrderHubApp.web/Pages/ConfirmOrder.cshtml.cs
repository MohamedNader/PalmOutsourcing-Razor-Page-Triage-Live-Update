using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using OrderHubApp.web.Models;

namespace OrderHubApp.web.Pages
{
    public class ConfirmOrderModel : PageModel
    {
        [BindProperty]
        public string SchoolName { get; set; } = string.Empty;

        [BindProperty]
        public IList<LineItem> Lines { get; set; } = new List<LineItem>();

        public decimal Subtotal => Lines.Sum(l => l.UnitPrice * l.Quantity);

        // Helper simulation mimicking an isolated database engine repository context
        private static readonly List<LineItem> MockDatabase = new()
        {
            new() { Id = 1, Sku = "UNIFORM-BLAZER-M", Embroidery = "Gold Crest", UnitPrice = 45.00m, Quantity = 10 },
            new() { Id = 2, Sku = "UNIFORM-TIE-REG", Embroidery = "Striped", UnitPrice = 8.50m, Quantity = 50 }
        };

        public void OnGet()
        {
            SchoolName = "St. Mary's Academy";
            Lines = MockDatabase;
        }

        // Standard Post Action: Triggers ONLY when clicking the explicit submit button
        public IActionResult OnPost()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            // Execute database persistence or transactional commit operations here using the fully bound model
            // ProcessOrder(Lines); 

            return RedirectToPage("/Index");
        }

        // AJAX Action Handler: Triggers immediately via JavaScript background fetch on input modification
        public IActionResult OnPostUpdateQuantity([FromBody] UpdateQtyRequest request)
        {
            if (request == null || request.Quantity < 0)
            {
                return BadRequest("Invalid payload parsing parameters.");
            }

            // Secure validation: Query the true source of truth rather than trusting the DOM payload price
            var masterItem = MockDatabase.FirstOrDefault(x => x.Id == request.LineId);
            if (masterItem == null)
            {
                return NotFound("Line item index missing.");
            }

            // Update database state dynamically
            masterItem.Quantity = request.Quantity;

            var calculatedLineTotal = masterItem.UnitPrice * request.Quantity;

            return new JsonResult(new
            {
                success = true,
                lineTotal = calculatedLineTotal.ToString("F2")
            });
        }
    }
}