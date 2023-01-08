function constructPlato(values) {
    return {
        argument: (values.boolean === true && values.argument !== undefined ? values.argument :
            values.boolean === true ? "TRUE" : "UNDEFINED"),
        message: values.message,
        truth: values.truth
    };
}

function booleanPlato(boolean) {
    return {
        argument: (boolean === true ? "TRUE" : "UNDEFINED"),
        truth: boolean
    }
}

function convertPlatoFromAPI(plato) {
    return {
        argument: plato._argument,
        message: plato._message,
        truth: plato._truth
    }
}

function convertPlatoToAPI(plato) {
    return {
        _argument: plato.argument,
        _message: plato.message,
        _truth: plato.truth
    }
}