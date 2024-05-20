const siteName = document.getElementById('siteName');
const siteURL = document.getElementById('siteURL');
const addBtn = document.getElementById('addBtn');
const tableBody = document.getElementById('tableBody');
const name_validaiton = document.querySelector(".name-validaiton");
const name_unique_validation = document.querySelector(".name-unique-validation");
const url_validation = document.querySelector(".url-validation");
let bookmark;
let currentIndex;
let bookmarksList = [];
if (localStorage.getItem("bookmarksList") === null)
    bookmarksList = [];
else {
    bookmarksList = JSON.parse(localStorage.getItem('bookmarksList'));
    display();
}
addBtn.addEventListener("click", checkStatusBtn);
function checkStatusBtn() {
    if (nameValidation() && urlValidation() && isNameUnique()) {
        if (addBtn.innerHTML === 'Add Bookmark')
            addBookmark();
        else
            addUpdatedBookmark();
        clearIcon();
        localStorage.setItem('bookmarksList', JSON.stringify(bookmarksList));
        reset();
        display();
    }
    else {
        showIconNameInput();
        showIconURLInput();
        sweetAlert();
    }
}
function addBookmark() {
    bookmark = {
        sName: siteName.value,
        sURL: siteURL.value,
    }
    bookmarksList.push(bookmark);
}
function reset() {
    siteName.value = '';
    siteURL.value = '';
}
function display() {
    let showResult = '';
    for (let i = 0; i < bookmarksList.length; i++) {
        showResult += `
        <tr>
            <td>${i + 1}</td>
            <td>${bookmarksList[i].sName}</td>
            <td><button class="btn btn-visit" id="btn-visit-${i}" onclick="visitBookmark(${i})"><span class="fa-solid fa-eye"></span> Visit</button>
            </td>
            <td><button class="btn btn-delete" id="btn-delete-${i}" onclick="deleteBookmark(${i})"><span class="fa-solid fa-trash"></span> Delete</button>
            </td>
        </tr>
        `;
    }
    tableBody.innerHTML = showResult;
}
function visitBookmark(index) {
    window.open(bookmarksList[index].sURL, '_blank');
}
function addUpdatedBookmark() {
    bookmark = {
        sName: siteName.value,
        sURL: siteURL.value,
    }
    bookmarksList[currentIndex] = bookmark;
    addBtn.innerHTML = 'Add Bookmark';
}
function deleteBookmark(index) {
    bookmarksList.splice(index, 1);
    localStorage.setItem('bookmarksList', JSON.stringify(bookmarksList));
    display();
}
siteName.addEventListener('input', nameValidation);
siteName.addEventListener('blur', nameValidation);

function nameValidation() {
    const regexName = /^[A-Za-z]{3}/;//To start with capital or small 3 letters at least.
    return regexName.test(siteName.value);
}
siteURL.addEventListener('input', urlValidation);
siteURL.addEventListener('blur', urlValidation);

function urlValidation() {
    const regexURL = /^(?:https?:\/\/)|(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
    /* is designed to match and validate URLs that start with https:// and have a domain name consisting of letters (both upper and lower case), numbers, hyphens, and periods. It also allows for optional "www." at the beginning of the domain.*/
    return regexURL.test(siteURL.value);
}
siteName.addEventListener('input', isNameUnique);
siteName.addEventListener('blur', isNameUnique);
function isNameUnique() {
    const newName = siteName.value.trim().toLowerCase();
    return !bookmarksList.some((item, index) => (item.sName.toLowerCase() === newName) && (index !== currentIndex));//so that to check it if it's uniqu & when to use the update method you still can have the same name without asking to be unique
}
siteName.addEventListener('input', showIconNameInput);
siteName.addEventListener('blur', showIconNameInput);
siteURL.addEventListener('input', showIconURLInput);
siteURL.addEventListener('blur', showIconURLInput);
function showIconNameInput() {
    if (nameValidation() && isNameUnique()) {
        siteName.classList.add('valid');
        siteName.classList.remove('invalid');
        siteName.style.borderColor = '#198754';
        siteName.style.boxShadow = '0 0 0 0.25rem rgba(25,135,84,.25)';
        name_validaiton.style.display = "none";
        name_unique_validation.style.display = "none";
    }
    else {
        siteName.classList.add('invalid');
        siteName.classList.remove('valid');
        siteName.style.borderColor = '#dc3545';
        siteName.style.boxShadow = '0 0 0 0.25rem rgba(220,53,69,.25)';
        if (!nameValidation()) {
            name_validaiton.style.display = "block";
            name_unique_validation.style.display = "none";
        }
        else if (!isNameUnique()) {
            name_unique_validation.style.display = "block";
            name_validaiton.style.display = "none";
        }
    }
}
function showIconURLInput() {
    if (urlValidation()) {
        siteURL.classList.add('valid');
        siteURL.classList.remove('invalid');
        siteURL.style.borderColor = '#198754';
        siteURL.style.boxShadow = '0 0 0 0.25rem rgba(25,135,84,.25)';
        url_validation.style.display = "none";
    }
    else {
        siteURL.classList.add('invalid');
        siteURL.classList.remove('valid');
        siteURL.style.borderColor = '#dc3545';
        siteURL.style.boxShadow = '0 0 0 0.25rem rgba(220,53,69,.25)';
        url_validation.style.display = "block";
    }
}
function clearIcon() {
    siteName.classList.remove('valid');
    siteName.style.borderColor = '#d99c39';
    siteName.style.boxShadow = '0 0 0 0.25rem #fec26055';
    siteURL.classList.remove('valid');
    siteURL.style.borderColor = '#d99c39';
    siteURL.style.boxShadow = '0 0 0 0.25rem #fec26055';
}
search.addEventListener('input', searchByName);
function searchByName() {
    let showResult = '';
    for (let i = 0; i < bookmarksList.length; i++) {
        let searchValue = search.value.trim().toLowerCase();
        if (bookmarksList[i].sName.toLowerCase().includes(searchValue)) {
            showResult += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${bookmarksList[i].sName.toLowerCase().replace(searchValue, `<span class="text-danger" style="background-color:yellow">${searchValue}</span>`)}</td>
                    <td><button class="btn btn-visit" id="btn-visit-${i}" onclick="visitBookmark(${i})"><span class="fa-solid fa-eye"></span> Visit</button>
                    </td>
                    <td><button class="btn btn-delete" id="btn-delete-${i}" onclick="deleteBookmark(${i})"><span class="fa-solid fa-trash"></span> Delete</button>
                    </td>
                </tr>
                `;
        }
    }
    tableBody.innerHTML = showResult;
}
function sweetAlert() {
    Swal.fire({
        icon: 'error',
        title: 'Site Name or Url is not valid, Please follow the rules below :',
        html: `
        <div class="sweetAlert-rules">
        <p><span class="fa fa-arrow-right"></span> Site name must contain at least 3 characters</p>
        <p><span class="fa fa-arrow-right"></span> Site URL must be a valid one</p>
         </div>
        `,
    });
}
