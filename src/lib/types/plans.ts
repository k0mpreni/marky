export type TPlan = {
	id: string;
	name: string;
	yearly: boolean;
	unit_amount: number;
};

export type TUserSubscription = {
	cancel_end: number | null;
	current: boolean;
	canceled: boolean;
	status: string;
};
