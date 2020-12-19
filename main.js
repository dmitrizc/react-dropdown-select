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

    await sleeper(2);
    console.log('Scrolling Page End');
    return true;
}

const sendKeyEvent = (target) => {
  const keyboardEvent1 = document.createEvent('KeyboardEvent');
  const initMethod = typeof keyboardEvent1.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent';

  keyboardEvent1[initMethod](
    'keydown',   // event type: keydown, keyup, keypress
    true,      // bubbles
    true,      // cancelable
    window,    // view: should be window
    false,     // ctrlKey
    false,     // altKey
    false,     // shiftKey
    false,     // metaKey
    40,        // keyCode: unsigned long - the virtual key code, else 0
    0          // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
  );

  target.dispatchEvent(keyboardEvent1);

  const keyboardEvent2 = document.createEvent('KeyboardEvent');

  keyboardEvent2[initMethod](
    'keyup',   // event type: keydown, keyup, keypress
    true,      // bubbles
    true,      // cancelable
    window,    // view: should be window
    false,     // ctrlKey
    false,     // altKey
    false,     // shiftKey
    false,     // metaKey
    40,        // keyCode: unsigned long - the virtual key code, else 0
    0          // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
  );

  target.dispatchEvent(keyboardEvent2);
}

const main = async () => {
    let hasPageLeft = true;
    let continuedZeroPage = 0;
    let connectionLimited = false;
    let totalSent = 0;

    do {
        if (killSwitch) {
            break;
        }

        await pageScroll();

        // let connectBtns = document.querySelectorAll('.search-result__actions--primary');
        let connectBtns = document.querySelectorAll('.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view');
        console.log(`Get connect btns: ${connectBtns.length}`);

        let sentCount = 0;

        for (let i = 0; i < connectBtns.length; i++) {
            if (killSwitch) {
                break;
            }

            console.log(`Btn: ${i}`);
            let connectBtn = connectBtns[i];

            if(connectBtn && connectBtn.innerText === 'Connect' && !connectBtn.disabled) {
                console.log(`Click connect btn`);
                // Connect Btn found, click
                connectBtn.click();

                await sleeper(2 + Math.random() * 2);

                // Check if add window is open and AddNote, Done btn both are enabled
                let addANoteBtn = document.querySelector('.mr1.artdeco-button.artdeco-button--muted.artdeco-button--secondary');
                let addANoteBtnSpan = document.querySelector('.mr1.artdeco-button.artdeco-button--muted.artdeco-button--secondary .artdeco-button__text');
                let doneBtn = document.querySelector('.artdeco-button.artdeco-button--primary');
                let doneBtnSpan = document.querySelector('.artdeco-button.artdeco-button--primary .artdeco-button__text');
                if (addANoteBtn && addANoteBtnSpan.innerText === 'Add a note' && !addANoteBtn.disabled && doneBtn && doneBtnSpan.innerText === 'Send' && !doneBtn.disabled) {
                    console.log(`Click add note btn`);

                    // Click add note button
                    addANoteBtn.click();

                    await sleeper(1 + Math.random() * 1);

                    // Paste note into text box
                    let inputMessage = document.querySelector('#custom-message');
                    if (inputMessage) {
                        console.log(`Update input message`);
                        inputMessage.focus();
                        inputMessage.value = strMessage;
                        sendKeyEvent(inputMessage);
                        inputMessage.blur();
                    }

                    // Click send button
                    let doneBtn = document.querySelector('.artdeco-button.artdeco-button--primary');
                    doneBtn.disabled = false;
                    console.log(`Click send btn`);
                    doneBtn.click();

                    await sleeper(2);

                    // Check if connection limited
                    let warning = document.querySelector('#ip-fuse-limit-alert__header');
                    if (warning) {
                        console.log('Connection limited');
                        connectionLimited = true;
                        break;
                    }

                    sentCount ++;
                    totalSent ++;

                    await sleeper(2 + Math.random() * 2);
                } else {
                    // There is no add note button even window open, close window
                    console.log(`Not able to send message btn`);
                    let closeBtn = document.querySelector('.artdeco-modal__dismiss.artdeco-button.artdeco-button--circle.artdeco-button--muted.artdeco-button--tertiary');
                    if (closeBtn) {
                        closeBtn.click();
                    }
                }
            }
        }

        if (killSwitch) {
            break;
        }

        if (connectionLimited) {
            break;
        };

        console.log(`No more connect btns, find next btn`);
        // No more connect button, Click next if possible
        let nextPageBtn = document.querySelector('.artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--tertiary');
        if (nextPageBtn && nextPageBtn.innerText === 'Next' && !nextPageBtn.disabled) {
            console.log(`Click next page, totalSent: ${totalSent}`);

            if (sentCount === 0) {
                continuedZeroPage ++;
            } else {
                continuedZeroPage --;
            }
            nextPageBtn.click();

            await sleeper(5);
        } else {
            console.log(`No more page left`);
            hasPageLeft = false;
        }

        if (continuedZeroPage > 100) {
            console.log('No connect page continued for 100 times');
            hasPageLeft = false;
        }
    } while (hasPageLeft && !connectionLimited)

    console.log(`Script End, totalSent: ${totalSent}`);
};

main();