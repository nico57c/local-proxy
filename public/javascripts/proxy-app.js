
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

    const modalBtnConfirm = $('#app-modal-btn-confirm');
    const modalTitle = $('#app-modal-title');
    const modal = $('#app-modal');
    const modalBody = $('#app-modal-body');
    const modalError = $('#app-modal-error');


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

    const openModalForm = function(id, title, onConfirm) {
        modal.modal('hide');
        modalError.html('');
        modalTitle.html(title);
        getForm(id).subscribe(html => {
            modalBody.html('<div id="form-proxy-config">'+ html.response + '</div>');
            modal.modal('show');
        });
        modalBtnConfirm.html('Save');
        modalBtnConfirm.off('click');
        modalBtnConfirm.on('click', onConfirm);
    }

    const openDialog = function(title, message, onConfirm) {
        modal.modal('hide');
        modalError.html('');
        modalTitle.html(title);
        modalBody.html(message);
        modalBtnConfirm.html('Delete');
        modalBtnConfirm.off('click');
        modalBtnConfirm.on('click', onConfirm);
        modal.modal('show');
    }

    this.openModalForCreation = function() {
        openModalForm(undefined, 'Create Proxy Configuration', function(event) {
            postForm( serializeToJson($('#form-proxy-config form').serializeArray()) ).subscribe(res => {
                if(res.status == 200 && res.response.success === true) {
                    modalBtnConfirm.off('click');
                    modal.modal('hide');
                } else {
                    modalError.html(res.response.error === undefined? 'An error occurred during creation.': res.response.error);
                }
            });
        });
    }

    this.openModalForEdition = function(id) {
        openModalForm(id, 'Edit Proxy Configuration', function(event) {
            putForm( serializeToJson($('#form-proxy-config form').serializeArray()), id).subscribe(res => {
                if(res.status === 200 && res.response.success === true) {
                    modalBtnConfirm.off('click');
                    modal.modal('hide');
                } else {
                    modalError.html(res.response.error === undefined? 'An error occurred during edition.': res.response.error);
                }
            });
        });
    }

    this.openDialogForDeletion = function(id, name) {
        openDialog('Delete Proxy Configuration', 'Are you sure to delete proxy configuration "' + name + '" ?', function(event) {
            deleteItem(id).subscribe( res => {
                if(res.status === 200 && res.response.success === true) {
                    modal.modal('hide');
                    modalBtnConfirm.off('click');
                } else {
                    modalError.html(res.response.error === undefined? 'An error occurred during deletion.': res.response.error);
                }
            });
        });
    }
}

var ProxyApp = new ProxyAppEngine();
