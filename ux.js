export function toggleLoadingSpinner(show) {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
        spinner.style.display = show ? 'block' : 'none';
    }
}
