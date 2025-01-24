<script lang="ts">
	import type { GiftItem } from '$lib';
	import GiftCard from '$lib/components/GiftCard.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import Input from '$lib/components/ui/input/input.svelte';
	export let data;

	let reservedByMe: GiftItem[] = [];
	let notReservedByMe: GiftItem[] = [];

	let reservedName = data.props.reservationName;
	let isClosed = reservedName != null;
	// Split the gifts into two arrays
	$: {
		if (data && data.props.result) {
			reservedByMe = data.props.result.filter((gift) => gift.ReservedByMe === true);
			notReservedByMe = data.props.result.filter((gift) => gift.ReservedByMe !== true);
		}
	}
</script>

<Alert.Root class="bg-blue-300 dark:bg-blue-600">
	<Alert.Title
		>{reservedName != null ? `Welcome back, ${reservedName}!` : `Please sign in.`}</Alert.Title
	>
	<Alert.Description
		>You are currently shopping for Owen's Birthday on March 3rd, 2025!</Alert.Description
	>
</Alert.Root>

<AlertDialog.Root open={isClosed == false}>
	<AlertDialog.Content>
		<AlertDialog.Header class="space-y-4 flex flex-col items-center">
			<AlertDialog.Title>Howdy stranger!</AlertDialog.Title>
			<AlertDialog.Description>
				It looks like you havent been here before, please enter a name for your reservation.
			</AlertDialog.Description>
			<AlertDialog.Description class="font-bold"
				>This isnt visible to anyone but you.</AlertDialog.Description
			>
			<Input type="text" placeholder="Some Name" class="max-w-xs" bind:value={reservedName} />
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Action
				on:click={() => {
					document.cookie = `ReservationName=${reservedName}; path=/; max-age=31536000`;
					isClosed = true;
				}}>Remember Me</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<div class="max-w-screen-sm mt-12">
	<h1 class="text-2xl font-bold">Owen's Gift List</h1>
	<p>
		Please see below for a list of gifts you can get me. All of the gifts on this list are
		thoughtful things that I need for school, work, or my hobbies and would appreciate and use for
		years to come
	</p>
	<div id="about" class="mt-4">
		<h1 class="text-2xl font-bold mb-2">How to use</h1>
		<ul>
			<li>
				<h1 class="text-xl font-semibold">1. Select a gift</h1>
				<p>Select a gift from the list that fits your price range</p>
			</li>
			<li>
				<h1 class="text-xl font-semibold">2. Reserve the gift</h1>
				<p>Hit the reserve button and fill out the information</p>
			</li>
			<li>
				<h1 class="text-xl font-semibold">3. Buy the gift!</h1>
				<p>Buy it and give it to Owen!</p>
			</li>
		</ul>

		<p class="mt-4">
			Star rating is used to show how much I want an item. The more stars, the higher priority the
			item is.
		</p>
	</div>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 mt-12">
	{#each reservedByMe as gift}
		<GiftCard {gift} />
	{/each}
	{#each notReservedByMe as gift}
		<GiftCard {gift} />
	{/each}
</div>
