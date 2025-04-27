<script lang="ts">
    import { onMount } from "svelte";
    import { Md5 } from "ts-md5";

    let { ArmAPI = $bindable() } = $props();

    onMount(() => {
        if (!window.qt?.webChannelTransport || !window.QWebChannel) {
            console.log("Qt environment not detected");
            return;
        }
        
        new QWebChannel(qt.webChannelTransport, (channel: any) => {
            if (!channel.objects?.ArmAPI) {
                console.warn("ArmAPI not found in Qt channel");
                return;
            }

            // Test API connection
            channel.objects.ArmAPI.signRequest("1", Md5.hashStr("2"), (response: any) => {
                ArmAPI = channel.objects.ArmAPI;
            });
        });
    })
</script>