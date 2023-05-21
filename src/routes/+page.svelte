<script>
    import MenuBar from '$lib/components/MenuBar.svelte';
    import ContentArea from './ContentArea.svelte'
</script>

<div class="main-area">
    <MenuBar />
    <ContentArea />
</div>

<style>
    .main-area {
        width: 100%;
        height: 100%;
        position: absolute;
        inset: 0;
        overflow: hidden;
        background: radial-gradient(hsl(220 14% 20%), hsl(220 20% 10%));
        background-attachment: fixed;
    }
</style>
