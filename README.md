# Razor Page Triage

## 1. Cross-Site Scripting (XSS) Risk

The page renders the school name using `Html.Raw(Model.SchoolName)`, which bypasses Razor's built-in HTML encoding.

### Why it matters

School names are data-driven values and should be treated as untrusted input. Rendering raw HTML could allow malicious scripts to execute in a school administrator's browser.

### Recommendation

Remove `Html.Raw` and rely on Razor's automatic HTML encoding:

```cshtml
<h1>Order for @Model.SchoolName</h1>
```

---

## 2. Full Page Submission on Every Quantity Change

The page submits the entire form whenever a line item is clicked:

```javascript
function updateQty(id) {
    document.forms[0].submit();
}
```

### Why it matters

OrderHub experiences significant traffic spikes during back-to-school ordering periods. Triggering a full page reload for every quantity adjustment creates unnecessary server load and degrades the user experience for administrators managing large orders.

### Recommendation

Replace full-page postbacks with an asynchronous request that updates only the affected line item and subtotal.

---

## 3. Client-Side Behavior Coupled to Markup

User interaction is implemented through inline event handlers:

```html
<div onclick="updateQty(@line.Id)">
```

### Why it matters

Mixing presentation and behavior makes the page harder to maintain, test, and extend. As additional interactions are introduced, this pattern becomes increasingly brittle and difficult to manage.

### Recommendation

Use unobtrusive JavaScript by attaching event listeners from a dedicated script and keeping Razor responsible only for rendering HTML.
