# marky

A template for SaaS built with Svelte, Supabase and Stripe

Why? So you can quickly bootstrap and focus on your idea

## Todo

[] Base Supabase setup with profiles and subscription / payment
[] Deployment somewhere
[] Better tailwind / components

And a lot other stuff that I will build while learning more about SaaS, like good landing pages and so on

## Development

Clone the repo then copy the `.env.example` into a `.env` file and add your env variables

```
cd marky
npm install
npm run dev
```

## Setup Supabase

Sign into Supabase
Create a project
In "Authentication", set the wanted providers and add them into the `login` page
https://supabase.com/docs/guides/auth/social-login

## Setup Stripe

Sign into Stripe
Go to Products and add the wanted products, this will be the plans shown on the site

## Useful links

How to set prices: https://www.indiehackers.com/post/the-ultimate-guide-to-saas-pricing-7962e070de

## Thanks

The free Tailwind components from https://www.tailbits.com/components/free

If you are building stuff with this, I would love to see what you built, feel free to ping me!
