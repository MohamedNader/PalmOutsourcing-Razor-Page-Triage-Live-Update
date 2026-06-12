document.addEventListener("DOMContentLoaded", () => {
    const orderForm = document.getElementById("orderForm");
    if (!orderForm) return;

    let debounceTimer;

    orderForm.addEventListener("input", (event) => {
        if (!event.target.classList.contains("line-qty-input")) return;

        const input = event.target;
        const row = input.closest(".order-line-row");
        const lineId = parseInt(row.dataset.lineId, 10);
        const unitPrice = parseFloat(row.dataset.unitPrice);
        const quantity = parseInt(input.value, 10) || 0;

        if (quantity < 0) return;

        // 1. Instant client-side feedback loop for zero visual lag
        const immediateLineTotal = unitPrice * quantity;
        row.querySelector(".line-total").textContent = `£${immediateLineTotal.toFixed(2)}`;
        recalculateSubtotal();

        // 2. Debounce server synchronization to prevent overloading the thread pipeline
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            syncQuantityWithServer(lineId, quantity, row);
        }, 350);
    });

    async function syncQuantityWithServer(lineId, quantity, row) {
        const payload = { lineId, quantity };
        const tokenInput = document.querySelector('input[name="__RequestVerificationToken"]');

        try {
            const data = await HttpClient.postJson("?handler=UpdateQuantity", payload);

            if (data.success) {
                row.querySelector(".line-total").textContent = `£${data.lineTotal}`;
                recalculateSubtotal();
            }
        } catch (error) {
            console.error("Async tracking synchronization state fault:", error);
        }
    }

    function recalculateSubtotal() {
        let total = 0;
        document.querySelectorAll(".order-line-row").forEach(row => {
            const price = parseFloat(row.dataset.unitPrice);
            const qty = parseInt(row.querySelector(".line-qty-input").value, 10) || 0;
            total += price * qty;
        });
        document.getElementById("orderSubtotal").textContent = `£${total.toFixed(2)}`;
    }
});