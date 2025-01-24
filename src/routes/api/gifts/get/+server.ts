import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ cookies }) => {
	// Get the ReservationID from cookies
	const reservationID = cookies.get('ReservationID');

	try {
		// Fetch all gifts from the database
		const gifts = await prisma.gift.findMany({
			where: {
				active: true // Only fetch active gifts
			}
		});

		// Map through the gifts and add the ReservedByMe property
		const result = gifts.map((gift) => {
			return {
				...gift,
				ReservedByMe: gift.reservedBy ? gift.reservedBy === reservationID : null,
				reservedName: undefined,
				reservedBy: undefined
			};
		});

		return new Response(
			JSON.stringify({
				message: 'Successfully got all gifts.',
				data: result
			}),
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		);
	} catch (error) {
		console.error('Error fetching gifts:', error);
		return new Response('Internal Server Error', { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};
