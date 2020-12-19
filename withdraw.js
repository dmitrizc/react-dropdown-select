let killSwitch = false;

const zkillSwitchOn = () => {
    killSwitch = true;
}

const sleeper = (seconds) => new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
});

const pageScroll = async () => {
    console.log('Scrolling Page');

    let clientHeight = document.body.clientHeight;
    let windowHeight = window.innerHeight;
    let scrollPos = 0;
    while (scrollPos < clientHeight) {
        window.scrollTo(0, scrollPos);
        await sleeper(1);
        scrollPos += windowHeight;
    }

    await sleeper(2 + Math.random() * 2);
    console.log('Scrolling Page End');
    return true;
}

const pageScrollBottom = async () => {
    let clientHeight = document.body.clientHeight;
    let windowHeight = window.innerHeight;

    window.scrollTo(0, clientHeight - 200);

    return true;
}

const main = async () => {
    let connectionRemains = true;

    await pageScroll();

    let withdrawBtns = document.querySelectorAll('.invitation-card__action-btn.artdeco-button.artdeco-button--muted.artdeco-button--tertiary');

    for (let i = withdrawBtns.length - 1; i > 0; i--) {
        if (killSwitch) {
            break;
        }

        await pageScrollBottom();
        await sleeper(1 + Math.random() * 2);

        let withdrawBtn = withdrawBtns[i];

        if (withdrawBtn && withdrawBtn.innerText === 'Withdraw' && !withdrawBtn.disabled) {
            withdrawBtn.click();
            await sleeper(1 + Math.random() * 2);
        }

        // Check if modal open and can click Withdraw
        let withdrawConfirmBtn = document.querySelector('.artdeco-modal__confirm-dialog-btn.artdeco-button.artdeco-button--primary');
        let withdrawCancelBtn = document.querySelector('.artdeco-modal__confirm-dialog-btn.artdeco-button.artdeco-button--secondary');
        if (withdrawConfirmBtn && withdrawConfirmBtn.innerText === 'Withdraw' && !withdrawConfirmBtn.disabled && withdrawCancelBtn && withdrawCancelBtn.innerText === 'Cancel' && !withdrawCancelBtn.disabled) {
            withdrawConfirmBtn.click();
            await sleeper(1 + Math.random() * 2);
        }
    }

    console.log(`Script End`);
};

main();