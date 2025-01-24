import type { GiftItem } from '$lib';
import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ cookies }) => {
	// Get the ReservationID from cookies
	const reservationID = cookies.get('ReservationID');
	const reservationName = cookies.get('ReservationName');

	try {
		// Fetch all active gifts from the database
		const gifts = await prisma.gift.findMany({
			where: {
				active: true // Only fetch active gifts
			}
		});

		// Map through the gifts and add the ReservedByMe property
		const result: GiftItem[] = gifts.map((gift) => ({
			...gift,
			ReservedByMe: gift.reservedBy ? gift.reservedBy === reservationID : null,
			reservedName: undefined, // Exclude sensitive fields
			reservedBy: undefined
		}));

		return {
			props: {
				result,
				reservationName
			}
		};
	} catch (error) {
		console.error('Error fetching gifts:', error);
		throw new Error('Internal Server Error');
	} finally {
		await prisma.$disconnect();
	}
};
