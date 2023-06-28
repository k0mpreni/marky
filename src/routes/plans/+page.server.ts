import { goto } from '$app/navigation';
import { stripe } from '$lib/server/stripe';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const productsRes = await stripe.products.list();
	const priceRes = await stripe.prices.list();
	const plans = productsRes.data.reduce((acc, currentEl, index) => {
		if (!currentEl.default_price) return;
		const price = priceRes.data.find((priceEl) => priceEl.id === currentEl.default_price);
		if (index && acc[index - 1] && acc[index - 1].price.unit_amount < price.unit_amount) {
			acc.push({ ...currentEl, price });
		} else {
			acc = [{ ...currentEl, price }, ...acc];
		}
		return acc;
	}, []);

	return {
		plans
	};
}
export const actions = {
	choosePlan: async ({ request, url, locals }) => {
		const data = await request.formData();
		const priceId = data.get('priceId');
		const session = await locals.getSession();
		if (!session) {
			throw redirect(303, '/login');
		}

		const res = await stripe.checkout.sessions.create({
			customer_email: session.user.email,
			line_items: [
				{
					// Provide the exact Price ID (for example, pr_1234) of the product you want to sell
					price: priceId,
					quantity: 1
				}
			],
			mode: 'subscription',
			success_url: `${url.origin}/plans/success`,
			cancel_url: `${url.origin}/plans/cancel`
		});
		if (res.url) {
			throw redirect(303, res.url);
		}
	}
};
