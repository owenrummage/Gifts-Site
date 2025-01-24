export type GiftItem = {
	id: number;
	name: string;
	purchaseURL: string;
	imageURL: string;
	price: number;
	priority: number;
	category: string;
	instructions?: string;
	active: boolean;
	ReservedByMe: boolean | null;
};
