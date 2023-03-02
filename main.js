const $container = document.querySelector("[data-container]");
const $addBtn = document.querySelector("[data-btn_add]");
const $modalAddCat = document.querySelector("[data-modal_wrapper]");
const $modalEditCat = document.querySelector("[data-modal_wrapper_edit]");
const $modalCatInfo = document.querySelector("[data-modal_cat-info]");


// Создание карточки кота
const generateCatCard = (cats) => {
    let favorite = "";      
    if (cats.favorite) {
        favorite = `<i class="fa-sharp fa-solid fa-heart"></i>`
    } else {
        favorite = `<i class="fa-sharp fa-regular fa-heart"></i>`
    }
    return (
    `<div data-card = ${cats.id} class="cat-card">
        <img class="cat-card__img" src="${cats.image}" alt="${cats.name}">
        <div class="cat-card__info">
            <p class="cat-card__text">
                <span>${cats.name}</span>, ${cats.age}
            </p>
        </div>
        <div class="cat-card__btns">
            <button data-btn_action = "open" class="cat-card__btn cat-card__btn_open">
            <i class="fa-regular fa-file-lines"></i>
            </button>
            <button data-btn_action = "delete" class="cat-card__btn cat-card__btn_delete">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <button data-btn_action = "favorite" class="cat-card__btn cat-card__btn_favorite">
                ${favorite}
            </button>
        </div>
    </div>`
    )
}

// Показать всех котов
function showCat() {
    api.getAllCats()
        .then(res => {
            return res.json()
        })
        .then(cats => {
            cats.forEach(elem => {
            $container.insertAdjacentHTML("beforeend", generateCatCard(elem))
            });
        })
        .catch (() =>{
            console.log("Что-то пошло не так")}
        )
}

// Кнопки на карточке
$container.addEventListener("click", async(event) => {
    // Переключатель любимый/нелюбимый
    if (event.target.dataset.btn_action === "favorite"){
        const id = event.target.closest("[data-card]").dataset.card;
        $btnFavorite = event.target;
        const data = await api.getCurrentCat (id);
        const cat = await data.json(); 
        if(cat.favorite){
            await api.editFavorite(id, false)
            $btnFavorite.innerHTML = `<i class="fa-sharp fa-regular fa-heart"></i>`;
        } else {
            await api.editFavorite(id, true)
            $btnFavorite.innerHTML = `<i class="fa-sharp fa-solid fa-heart"></i>`;
        }
    }
    // Удаление
    if (event.target.dataset.btn_action === "delete"){
        const id = event.target.closest("[data-card]").dataset.card;
        await api.deleteCat(id);
        $container.innerHTML = "";
        showCat();
    }
    // Подробная информация о коте
    if (event.target.dataset.btn_action === "open"){
        $modalCatInfo.classList.remove("hidden");
        const id = event.target.closest("[data-card]").dataset.card;
        showCurrentCat (id);
    }
})

// Отрисовка кота
const showCurrentCat = (id) =>{
    api.getCurrentCat(id)
    .then(res => {
        return res.json();
    })
    .then(data => {
        $modalCatInfo.querySelector(".modal-cat-card__name").innerText = data.name;
        $modalCatInfo.querySelector(".modal-cat-card__img").src = data.image;
        $modalCatInfo.querySelector(".modal-cat-card__age").innerText = `Возраст: ${data.age} ${rightAge(data.age)}`;
        showRate(data.rate);
        showFavorUnfavor(data.favorite);
        if (data.description === "") {
            $modalCatInfo.querySelector(".modal-cat-card__text").innerText = "К сожалению, у данного котика нет описания";
        } else {
            $modalCatInfo.querySelector(".modal-cat-card__text").innerText = data.description;
        }
        $modalCatInfo.dataset.id = `${data.id}`;
    })
}

// Написание год/года/лет
function rightAge(age){
    if (age === 1) {
        return "год"
    } else 
    if (age >= 2 && age <= 4) {
        return "года"
    } else 
    if (age >= 5 && age <= 20){
        return "лет"
    }
}

// Отрисовка рейтинга кота
function showRate(rate){
    const ratingBD = rate;
    const $ratingFront = $modalCatInfo.querySelector(".modal-cat-card__rating");
    while($ratingFront.firstChild){
        $ratingFront.firstChild.remove();
    }
    for(let i = 1; i<=5; i++){
        const $star = document.createElement("i");
        if (i<=ratingBD) {
            $star.classList.add("fa-solid", "fa-star");
            $ratingFront.appendChild($star);
        } else {
            $star.classList.add("fa-regular", "fa-star");
            $ratingFront.appendChild($star);
        }
    }
}

// Отрисовка любимый/нелюбимый 
function showFavorUnfavor(favorite) {
    const $favorite = $modalCatInfo.querySelector(".modal-cat-card__favorite");
    if (favorite) {
        $favorite.innerHTML = `<i class="fa-sharp fa-solid fa-heart"></i>`;
    } else {
        $favorite.innerHTML = `<i class="fa-sharp fa-regular fa-heart"></i>`;
    }
}

// EventListener на карточку кота
$modalCatInfo.addEventListener("click",  async(event) =>{
    // Закрыть карточку кота
    if (event.target.dataset.btn_action === "modal-close" || event.target.classList.contains("modal-cat-info")){
        $modalCatInfo.classList.add("hidden")
    }

    // Открыть и заполнить изменение кота
    if (event.target.dataset.btn_action === "modal-edit") {
        const id = $modalCatInfo.dataset.id;
        $modalCatInfo.classList.add("hidden")
        $modalEditCat.classList.remove("hidden")
        const editCurrentCat = await api.getCurrentCat(id);
        data = await editCurrentCat.json();
        $editForm = document.forms.editCat;
        $editForm.name.value = data.name;
        $editForm.image.value = data.image;
        $editForm.age.value = data.age;
        $editForm.rate.value = data.rate;
        $editForm.description.value = data.description;
        $editForm.favorite = "false";
        $editForm.favorite.checked = data.favorite;
        
    }
})

// Добавление кота
$addBtn.addEventListener("click", (event) => {
    $modalAddCat.classList.remove("hidden");
})

$modalAddCat.addEventListener("click", (event) => {
    if(event.target.dataset.btn_action === "modal-close"||event.target.classList.contains("modal-wrapper")){
        $modalAddCat.classList.add("hidden");
    }
})

document.forms.addCat.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.id = Math.floor(Math.random()*10e7);
    data.age = Number(data.age);
    data.rate = Number(data.rate);
    data.favorite = !!data.favorite;
    await api.addNewCat(data);
    $modalAddCat.classList.add("hidden");
    $container.innerHTML = "";
    showCat();
})

// Изменение кота
$modalEditCat.addEventListener("click", (event) => {
    if(event.target.dataset.btn_action === "modal-close"||event.target.classList.contains("modal-wrapper-edit")){
        $modalEditCat.classList.add("hidden");
    }
})

document.forms.editCat.addEventListener("submit", async (event) => {
    event.preventDefault(); 
    const data = Object.fromEntries(new FormData(event.target).entries());
    data.favorite = !!data.favorite;
    const id = $modalCatInfo.dataset.id;
    await api.editCat(data, id);
    $modalEditCat.classList.add("hidden");
    showCurrentCat(id);
    $modalCatInfo.classList.remove("hidden");
    $container.innerHTML = "";
    showCat();
})

// LocalStorage
document.forms.addCat.addEventListener("input", event => {
    const data = Object.fromEntries(new FormData(document.forms.addCat).entries());
    localStorage.setItem("addCat", JSON.stringify(data));
})

const dataFromLS = localStorage.getItem("addCat");
const parsedDataFromLS = dataFromLS ? JSON.parse(dataFromLS) : null;

if (parsedDataFromLS) {
    for (key in parsedDataFromLS) {
        document.forms.addCat[key].value = parsedDataFromLS[key];
    }
}

showCat();


// Пытаюсь что-то сделать с Git