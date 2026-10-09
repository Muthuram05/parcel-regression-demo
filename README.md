# Parcel regression demo

A small, owned stationery checkout app for demonstrating Verity regression testing. It calculates estimates only: there are no real orders, customers, payment details or external services. It uses Node.js 22+ with no package dependencies.

```sh
npm start
npm test
```

Open http://127.0.0.1:4180. Set `PORT` to run another preview. Each browser page starts with a fresh estimate; there is no shared mutable customer state. `/__build` reports the Git revision captured when the server starts. Restart the server after switching branches.

## Checkout rules

- A notebook costs ₹500, the pen set ₹450, and the desk pad ₹1,000.
- Quantity must be a whole number from 1 through 10.
- SAVE10 takes exactly 10% off the item subtotal, rounded to whole rupees.
- Delivery costs ₹50 below ₹1,000 after discounts and is free at or above ₹1,000.
- Promotion codes should ignore case and surrounding whitespace. Unknown codes are rejected.

## Three independent pull requests

All three branches start from the same `main` revision. They are intentionally kept unmerged.

| Branch                            | Purpose                                                                                                   | Expected checks                                                         |
| --------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `demo-101-free-delivery-boundary` | Correct bug fix: orders of exactly ₹1,000 qualify for free delivery                                       | Existing tests and the new boundary test pass                           |
| `demo-102-promo-normalization`    | Deliberately unsafe bug fix: whitespace is accepted, but the discount rate is accidentally changed to 20% | Existing ten-percent discount checks fail; this PR must remain unmerged |
| `demo-103-gift-wrapping`          | Feature: optional gift wrapping costs ₹75                                                                 | Existing checks and new wrapping tests pass                             |

The starting implementation has known delivery-boundary and promotion-whitespace defects. Baseline checks intentionally do not yet cover those acceptance cases; each bug-fix PR adds its missing check. The unsafe PR demonstrates why existing regression checks must also run. The delivery defect remains on branches that do not contain DEMO-101.

## Connect to Verity

Connect the local app URL as a project and add the checkout rules as requirements. Map the `Checkout` module to `src/checkout/`. Changes to the shared UI/server should conservatively select the full approved suite. Discover `/` without an account; no login is required. Browser locators use accessible labels and stable test IDs such as `subtotal`, `discount`, `shipping`, and `total`.

The Verity presentation uses the baseline suite plus each branch's acceptance cases explicitly. New feature assertions are kept separate from main until that feature is present. A Git PR alone does not deploy code: start a preview for its branch before running its browser scenarios. GitHub Actions executes the dependency-free unit suite for each push/PR.
