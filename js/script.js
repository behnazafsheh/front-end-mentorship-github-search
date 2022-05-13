const userName = document.querySelector('#userName');
const searchBtn = document.querySelector('#btnSearch');
const urlGithub = "https://api.github.com/users/";
const imgAvatar = document.querySelector('#profilePic');
const profileName = document.querySelector('#profileName');
const profileUserName = document.querySelector('#profileUserName');
const userRepos = document.querySelector('#userRepos');
const userFollowers = document.querySelector('#userFollowers');
const userFollowing = document.querySelector('#userFollowing');
const profileUserBio = document.querySelector('#profileUserBio');
const profileHireable = document.querySelector('#hireable-icon');

searchBtn.addEventListener('click', function (e) {
    getUser(userName.value);
});
function checkStatus(response) {
    // http errors 40x and 50x will go into this statement
    if (!response.ok) {
        const responseError = {
            statusText: response.statusText,
            status: response.status
        };
        throw (responseError);
    }
    else if (response.ok) {
        // handles status code 200
        return response.json();
    }
}

function httpErrorCheck(error) {
    switch (error.status) {
        case 400:
            toast('400 Bad Request, try again');
            break
        case 403:
            toast('403 Forbidden Request, try again');
            break
        case 404:
            toast('404 User Not Found, try again');
            break
        case 500:
            console.log('Internal Server Error, try again')
            break
        default:
            console.log('unhandled')
            break
    }
}
function getUser(userName) {
    if (userName.trim() === "") {
        toast('Please enter a valid username!');
    }
    else {
        fetch(`${urlGithub}${userName}`)
            .then(checkStatus)
            .then(function (data) {
                console.log(data);
                loadData(data);
            })
            .catch(function (error) {
                httpErrorCheck(error);
                document.querySelector('.profile__card').classList.add('d-none');
                console.log(error);
            })
    }
}
function loadData(data) {
    const { avatar_url, bio, following, followers, login, name, public_repos, hireable } = data;
    imgAvatar.src = avatar_url;
    userFollowing.textContent = `${following}`;
    userFollowers.textContent = `${followers}`;
    userRepos.textContent = `${public_repos}`;
    profileUserName.textContent = `${login}`;
    profileUserName.textContent = `@${login}`;
    nameValidCheck(name);
    bioValidCheck(bio);
    hireableValidCheck(hireable);
    document.querySelector('.profile__card').classList.remove("d-none");
}
function bioValidCheck(bio) {
    if (bio) {
        profileUserBio.textContent = `${bio}`;
    }
    else {
        profileUserBio.textContent = '';
    }
}
function nameValidCheck(name) {
    if (name) {
        profileName.textContent = `${name}`;
    }
    else {
        profileName.textContent = '-';
    }
}
function hireableValidCheck(hireable) {
    if (hireable) {
        profileHireable.classList.remove('d-none');
    }
    else {
        profileHireable.classList.add('d-none');
    }
}
let toast = (toastText) => {
    Toastify({
        text: toastText,
        duration: 20000,
        close: true,
        selector: 'search',
        stopOnFocus: true, // Prevents dismissing of toast on hover
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        style: {
            background: "linear-gradient(to right, #cb356b, #bd3f32)",
        }
    }).showToast();
}