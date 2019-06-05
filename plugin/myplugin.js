/* eslint-disable no-plusplus */
/* eslint-disable flowtype/require-return-type */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* @flow */

const PAYPAL_VERIFIED_SELLER_LIST = {
    'macy\'s':   'https://www.macys.com',
    'localhost': 'http://localhost:1337',
    'kohl\'s':     'https://www.kohls.com',
    'carter\'s':   'https://www.carters.com',
    'Walmart':     'https://www.walmart.com'
};


const checkIfURLVerified = (currentUrl) => {
    // eslint-disable-next-line compat/compat
    return Object.values(PAYPAL_VERIFIED_SELLER_LIST).find(x => currentUrl.indexOf(x) === 0);
};

const checkIfPayPalVerified = () => {
    setTimeout(() => {
        // eslint-disable-next-line no-undef
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            const currentUrl = tabs[0].url;
            if (checkIfURLVerified(currentUrl)) {
                document.getElementsByClassName('spinner')[0].style.display = 'none';
                document.getElementById('paypalverified').style.display = 'block';
            } else {
                document.getElementsByClassName('spinner')[0].style.display = 'none';
                document.getElementById('notverified').style.display = 'block';
            }
        });

    }, 1000);
};

function autocomplete(inp, arr) {

    let currentFocus;

    function closeAllLists(elmnt) {
     
        const x = document.getElementsByClassName('autocomplete-items');
        for (let i = 0; i < x.length; i++) {
            if (elmnt !== x[i] && elmnt !== inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    inp.addEventListener('input', function(_e) {
        let b;
        let i;
        const val = this.value;
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        const a = document.createElement('DIV');
        a.setAttribute('id', `${ this.id }autocomplete-list`);
        a.setAttribute('class', 'autocomplete-items');
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() === val.toUpperCase()) {
                b = document.createElement('DIV');
                b.innerHTML = `<img class='autoImg' src=${ arr[i] }.png/>`;
                b.innerHTML += `<span class='autoText'><strong>${ arr[i].substr(0, val.length) }</strong>${ arr[i].substr(val.length) }</span>`;
                b.innerHTML += `<input type='hidden' value='${ arr[i] }'>`;
                
                b.addEventListener('click', function(e) {
                    window.open(PAYPAL_VERIFIED_SELLER_LIST[e.srcElement.innerText]);
                    inp.value = this.getElementsByTagName('input')[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    // eslint-disable-next-line prefer-arrow-callback
    document.addEventListener('click', function (e) {
        closeAllLists(e.target);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    checkIfPayPalVerified();
    autocomplete(document.getElementById('searchinput'), Object.keys(PAYPAL_VERIFIED_SELLER_LIST));
    
});

// function removeActive(x) {
//     for (let i = 0; i < x.length; i++) {
//         x[i].classList.remove('autocomplete-active');
//     }
// }

// function addActive(x) {
//     if (!x) {
//         return false;
//     }
//     removeActive(x);
//     if (currentFocus >= x.length) {
//         currentFocus = 0;
//     }
//     if (currentFocus < 0) {
//         currentFocus = (x.length - 1);
//     }
//     x[currentFocus].classList.add('autocomplete-active');
// }
// inp.addEventListener('keydown', function(e) {
//     let x = document.getElementById(`${ this.id }autocomplete-list`);
//     if (x) {
//         x = x.getElementsByTagName('div');
//     }
//     if (e.keyCode === 40) {
//         currentFocus++;
//         addActive(x);
//     } else if (e.keyCode === 38) {
//         currentFocus--;
//         addActive(x);
//     } else if (e.keyCode === 13) {
//         e.preventDefault();
//         if (currentFocus > -1) {
//             if (x) {
//                 x[currentFocus].click();
//             }
//         }
//     }
// });

