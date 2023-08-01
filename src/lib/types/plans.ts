export type TPlan = {
	id: string;
	name: string;
	yearly: boolean;
	unit_amount: number;
	current: boolean;
	canceled: boolean;
	cancel_end: number | null;
};

export type TUserSubscription = {
	cancel_end: number | null;
	canceled: boolean;
	status: string;
};
