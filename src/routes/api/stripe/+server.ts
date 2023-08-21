/// <reference types="stripe-event-types" />
import { STRIPE_SIGNING_SECRET } from '$env/static/private';
import { handleCheckoutCompleted, handleCheckoutUpdated } from '$lib/server/checkout';
import { stripe } from '$lib/server/stripe';
import { json, type RequestHandler } from '@sveltejs/kit';
import type Stripe from 'stripe';

export const POST: RequestHandler = async (event) => {
	const stripeSignature = event.request.headers.get('stripe-signature');

	if (!stripeSignature) {
		return json('Unauthorized', { status: 401 });
	}

	const body = await event.request.text();

	let stripeEvent;

	try {
		stripeEvent = stripe.webhooks.constructEvent(
			body,
			stripeSignature,
			STRIPE_SIGNING_SECRET
		) as Stripe.DiscriminatedEvent;
	} catch (e) {
		return json('Invalid signature', { status: 401 });
	}
	try {
		switch (stripeEvent.type) {
			case 'checkout.session.completed':
				await handleCheckoutCompleted(stripeEvent.data.object);
				break;
			case 'customer.subscription.updated':
				handleCheckoutUpdated(stripeEvent.data.object);
				break;
			default:
				return json({ received: true }, { status: 200 });
		}
	} catch (e) {
		return json(`Error processing event ${stripeEvent.type}`, { status: 500 });
	}
	return json({ received: true }, { status: 200 });
};
