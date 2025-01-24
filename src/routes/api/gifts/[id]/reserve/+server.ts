import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ cookies, params }) => {
	const { id } = params;

	if (!id) {
		return new Response('Missing ID in the request parameters.', { status: 400 });
	}

	// Check for an existing ReservationID cookie
	let reservationID = cookies.get('ReservationID');
	const reservationName = cookies.get('ReservationName');

	if (!reservationName) {
		return new Response('Missing name in cookie!', { status: 400 });
	}

	// If the cookie doesn't exist, create a new random 10-character string
	if (!reservationID) {
		reservationID = generateRandomString(10);
		cookies.set('ReservationID', reservationID, {
			path: '/', // Ensure the cookie is available site-wide
			httpOnly: false, // Allow access from client-side JavaScript
			maxAge: 60 * 60 * 24 * 365 // Cookie expires in 7 days
		});
	}

	try {
		// Check if the gift is already reserved
		const existingGift = await prisma.gift.findUnique({
			where: { id: Number(id) },
			select: { reservedBy: true }
		});

		if (!existingGift) {
			return new Response('Gift not found.', { status: 404 });
		}

		if (existingGift.reservedBy) {
			return new Response('This gift is already reserved.', { status: 400 });
		}

		// Update the reservationName and reservationID in the database
		const updatedGift = await prisma.gift.update({
			where: { id: Number(id) },
			data: {
				reservedBy: reservationID,
				reservedName: reservationName
			}
		});

		return new Response(
			JSON.stringify({
				message: 'Successfully reserved gift ' + updatedGift.id,
				data: {
					...updatedGift,
					reservedName: undefined,
					reservedBy: undefined
				}
			}),
			{
				headers: { 'Content-Type': 'application/json' }
			}
		);
	} catch (error) {
		console.error('Error updating gift reservation:', error);
		return new Response('Error updating gift reservation.', { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};

/**
 * Generate a random alphanumeric string of the given length
 * @param length Number of characters in the string
 * @returns Random alphanumeric string
 */
function generateRandomString(length: number): string {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}
