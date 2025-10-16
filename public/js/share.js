document.addEventListener('DOMContentLoaded', () => {
    // --- Share Button Logic (existing code) ---
    const shareButton = document.getElementById('shareButton');
    if (shareButton) {
        shareButton.addEventListener('click', async (event) => {
            event.preventDefault();
            const shareData = {
                title: document.title,
                text: "Check out this amazing place I found!",
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.error('Error sharing:', err);
                }
            } else {
                try {
                    await navigator.clipboard.writeText(shareData.url);
                    const originalText = shareButton.innerHTML;
                    shareButton.innerHTML = '<i class="bi bi-check-lg"></i> Copied!';
                    setTimeout(() => {
                        shareButton.innerHTML = originalText;
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy: ', err);
                }
            }
        });
    }

    // --- Save as PDF Button Logic (new code) ---
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.addEventListener('click', (event) => {
            // Prevent the link's default behavior
            event.preventDefault();
            
            // Open the browser's print dialog
            window.print();
        });
    }
});