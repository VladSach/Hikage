<script>
	const size = '240px';
	const duration = '2.1s';
</script>

<div id="back"></div>
<div id="loader" style="--size: {size};">
	{#each Array(2) as _}
		<div style="--duration: {duration};"/>
	{/each}
</div>

<style>
	#back {
		position: absolute;
		height: 100%;
		width: 100%;
        background-color: #f9f9f9;
        opacity: 0.2;
        z-index: 3;
	}

	#loader {
		position: absolute;
		height: calc(var(--size) / 15);
		width: calc(var(--size) * 2);
		background-color: rgba(69, 64, 79, 0.7);
		background-clip: padding-box;
		overflow: hidden;
        text-align: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
	}

	div > div {
		height: calc(var(--size) / 15);
		background-color: rgba(165, 128, 186, 1.0);
		position: absolute;
		overflow: hidden;
		background-clip: padding-box;
		display: block;
		border-radius: 2px;

		will-change: left, right;
		animation-fill-mode: forwards;
	}

	div > div:nth-child(1) {
		animation:
			var(--duration)
			cubic-bezier(0.65, 0.815, 0.735, 0.395)
			0s
			infinite normal none running long;

	}

	div > div:nth-child(2) {
		animation:
			var(--duration)
			cubic-bezier(0.165, 0.84, 0.44, 1)
			calc((var(--duration) + 0.1s) / 2)
			infinite normal none running short;
	}

	@keyframes long {
		0% {
			left: -35%;
			right: 100%;
		}
		60% {
			left: 100%;
			right: -90%;
		}
		100% {
			left: 100%;
			right: -90%;
		}
	}

	@keyframes short {
		0% {
			left: -200%;
			right: 100%;
		}
		60% {
			left: 107%;
			right: -8%;
		}
		100% {
			left: 107%;
			right: -8%;
		}
	}
</style>
