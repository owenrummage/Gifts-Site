<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import Button from './ui/button/button.svelte';
	import type { GiftItem } from '$lib/_types';
	import { StarFill } from 'svelte-bootstrap-icons';

	export let gift: GiftItem;

	async function toggleReservation() {
		try {
			// Determine the appropriate API endpoint based on reservation status
			const endpoint = gift.ReservedByMe
				? `/api/gifts/${gift.id}/unreserve`
				: `/api/gifts/${gift.id}/reserve`;

			// Call the appropriate endpoint
			const response = await fetch(endpoint, {
				method: 'POST'
			});

			if (!response.ok) {
				// Handle HTTP errors
				const errorMessage = await response.text();
				console.error(
					`${gift.ReservedByMe ? 'Failed to unreserve' : 'Failed to reserve'} item:`,
					errorMessage
				);
				alert(`Error: ${errorMessage}`);
				return;
			}

			// Parse the JSON response
			const result = await response.json();
			console.log(`Item ${gift.ReservedByMe ? 'unreserved' : 'reserved'} successfully:`, result);

			// Update the local state based on reservation status
			gift.ReservedByMe = gift.ReservedByMe
				? null // Unreserved, set to null
				: true; // Reserved by you, set to true

			// Optionally trigger UI updates
			// alert(
			// 	`Gift with ID ${gift.id} ${gift.ReservedByMe ? 'reserved' : 'unreserved'} successfully!`
			// );
		} catch (error) {
			// Handle network errors
			console.error(`Error ${gift.ReservedByMe ? 'unreserving' : 'reserving'} item:`, error);
			alert(`An error occurred while ${gift.ReservedByMe ? 'unreserving' : 'reserving'} the gift.`);
		}
	}
</script>

<Card.Root>
	<a href={gift.purchaseURL}>
		<Card.Header>
			<Card.Title>{gift.name}</Card.Title>
			<Card.Description>{gift.instructions || 'No instructions provided!'}</Card.Description>
		</Card.Header>
	</a>
	<Card.Content>
		<img src={gift.imageURL || '/placeholder.svg'} alt={`img-${gift.name}`} />
	</Card.Content>
	<Card.Footer class="flex flex-row items-center justify-between">
		<p class="font-bold text-xl">${gift.price}</p>
		<!-- Star Rating -->
		<div class="flex space-x-1">
			<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
			{#each Array(5) as _, index}
				<StarFill
					class={index < gift.priority ? 'text-yellow-500' : 'text-gray-300'}
					aria-label={index < gift.priority ? 'Priority Star' : 'Non-priority Star'}
				/>
			{/each}
		</div>

		<!-- Reservation Button -->
		<Button
			class={gift.ReservedByMe === true ? 'dark:bg-blue-400 bg-blue-500' : ''}
			disabled={gift.ReservedByMe === false}
			on:click={() => toggleReservation()}
		>
			{gift.ReservedByMe === true
				? 'Unreserve Item'
				: gift.ReservedByMe === null
					? 'Reserve Item'
					: 'Item was reserved'}
		</Button>
	</Card.Footer>
</Card.Root>
