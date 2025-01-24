import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ params }) => {
	const { id } = params;

	// Validate the request parameters
	if (!id) {
		return new Response('Missing ID in the request parameters.', { status: 400 });
	}

	try {
		// Check if the gift exists
		const existingGift = await prisma.gift.findUnique({
			where: { id: Number(id) },
			select: { reservedBy: true } // Only fetch the reservedBy field
		});

		if (!existingGift) {
			return new Response('Gift not found.', { status: 404 });
		}

		// Check if the gift is already unreserved
		if (!existingGift.reservedBy) {
			return new Response('This gift is not currently reserved.', { status: 400 });
		}

		// Remove the reservation details from the gift
		const updatedGift = await prisma.gift.update({
			where: { id: Number(id) },
			data: {
				reservedBy: null,
				reservedName: null
			}
		});

		return new Response(
			JSON.stringify({
				message: 'Successfully unreserved gift ' + updatedGift.id,
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
		console.error('Error unreserving gift:', error);
		return new Response('Error unreserving gift.', { status: 500 });
	} finally {
		await prisma.$disconnect();
	}
};
