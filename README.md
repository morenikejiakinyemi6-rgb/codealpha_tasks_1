Regal Exquisite — E-Commerce Storefront

A full-stack e-commerce site built for a real tailoring business (ready-made pieces + custom-made orders), built as Task 1 for the CodeAlpha Full Stack Development internship.

Live site: https://regalexquisite.vercel.app

What it does
Browse ready-made clothing (size, color, price, live stock)
Browse a custom-style gallery and request a bespoke piece with saved measurements
Shopping cart with quantity controls, shared between ready-made and custom items
Checkout with browser-geolocation delivery address (auto reverse-geocoded, with a manual fallback) and distance-based delivery fee
Real payment via Paystack (deposit-only for custom pieces, full price for ready-made)
Order history and per-order status tracking
Admin dashboard: upload new products/styles (Cloudinary image hosting), manage/delete listings, update order status
Full authentication (signup/login/logout) with role-based access (customer vs admin)
Tech stack
Framework: Next.js (App Router, TypeScript)
Database: PostgreSQL via Prisma ORM
Auth: NextAuth v5 (Credentials provider, bcrypt password hashing)
Payments: Paystack
Image hosting: Cloudinary
Styling: Tailwind CSS
Hosting: Vercel
Running locally
bash
npm install
npx prisma migrate dev
npm run dev

Requires a .env file with DATABASE_URL, AUTH_SECRET, PAYSTACK_SECRET_KEY, NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.

Notes

Built and understood end-to-end as part of a self-directed, project-first approach to learning backend development — every design decision (data model, auth flow, payment flow, delivery-fee calculation) was made deliberately for this business's real workflow, not a generic template.