function Menu(cm, functions) {

}

this.loadMenu = function(filename) {

    debug.log("loading menu...");

    $.ajax({
        url : "menus/" + filename,
        success : function(data) {

        },

        error : function(data, textStatus) {
            throw "Menu File Could Not Be Found or Read";
        }
    })

}