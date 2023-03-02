class CatsApi {
    constructor(apiName) {
        this.url = `https://cats.petiteweb.dev/api/single/${apiName}`
    }

    getAllCats() {
        return fetch(`${this.url}/show`)
    }

    getCurrentCat(id) {
        return fetch(`${this.url}/show/${id}`)
    }

    deleteCat(id) {
        return fetch(`${this.url}/delete/${id}`, {
          method: 'DELETE',
        })
      }
    
    addNewCat(data) {
        return fetch(`${this.url}/add`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data)
        })
      }

    editCat(data, id) {
      return fetch(`${this.url}/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    }

    editFavorite(id, boolean) {
        return fetch(`${this.url}/update/${id}`, {
            method: "PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({"favorite": boolean})
             })
    }
    }
    
    const DB_NAME = 'sergeevseo';
    const api = new CatsApi(DB_NAME);