
function serializeToJson(serializer){
    let _string = '{';
    for(let ix in serializer) {
        let row = serializer[ix];
        _string += '"' + row.name + '":"' + row.value + '",';
    }
    _string = _string.substr(0, _string.length - 1) + '}';
    return JSON.parse(_string);
}


function ProxyAppEngine() {

    const getModalBtnConfirm = function () {
        return $('#app-modal-btn-confirm');
    }

    const getModelTitle = function() {
        return $('#app-modal-title');
    }

    const getModal = function() {
        return $('#app-modal');
    }

    const getModalBody = function() {
        return $('#app-modal-body');
    }

    const getForm = function(id) {
        const { ajax } = window.rxjs.ajax;
        return ajax({
            url: '/config' + (id === undefined ? '' : '?id='+id),
            method: 'GET',
            responseType: 'text/html',
            headers: {
                'Content-Type': 'text/html'
            }
        });
    }

    const dataValidation = function(data) {
        data.secure = data.secure === undefined ? false : data.secure === 'on';
        data.target_protocol = data.target_protocol === 'https' ? 'https': 'http';
        return data;
    }

    const postForm = function(data) {
        const { ajax } = window.rxjs.ajax;
        return ajax({
            url: '/config',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: dataValidation(data)
        });
    }

    const putForm = function(data, id) {
        const { ajax } = window.rxjs.ajax;
        return ajax({
            url: '/config?id=' + id,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: dataValidation(data)
        });
    }

    const deleteItem = function(id) {
        const { ajax } = window.rxjs.ajax;
        return ajax({
            url: '/config?id=' + id,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    const openModelForm = function(id, title, onConfirm) {
        getModal().modal('hide');

        getModelTitle().html(title);
        getForm(id).subscribe(html => {
            getModalBody().html('<div id="form-proxy-config">'+ html.response + '</div>');
            getModal().modal('show');
        });

        getModalBtnConfirm().off('click')
        getModalBtnConfirm().on('click', function(event) {
            onConfirm();
        });
    }

    const openDialog = function(title, message) {
       // TODO confirmation dialog
    }

    this.openModalForCreation = function() {
        openModelForm(undefined, 'Create Proxy Configuration', function() {
            postForm( serializeToJson($('#form-proxy-config form').serializeArray()) ).subscribe(response => {
                console.log(response);
            });
        });
    }

    this.openModalForEdition = function(id) {
        openModelForm(id, 'Edit Proxy Configuration', function() {
            putForm( serializeToJson($('#form-proxy-config form').serializeArray()), id).subscribe(response => {
                console.log(response);
            });
        });
    }

    this.openDialogForDeletion = function(id, name) {
        openDialog('Delete Proxy Configuration', 'Are you sure to delete proxy configuration "' + name + '" ?', function() {
            deleteItem(id).subscribe( response => {
                console.log(reponse);
            });
        });
    }
}

var ProxyApp = new ProxyAppEngine();
