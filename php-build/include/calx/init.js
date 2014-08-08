/**
 * initialize sheet object and register to internal calx.sheetRegistry
 * @param  {object} option      option to override the default option
 * @return {object}             jQuery object for chaining
 */
init : function (option) {
    this.each(function(){
        var sheetIdentifier = $(this).attr('data-calx-identifier');
        console.log(sheetIdentifier);

        if(!sheetIdentifier || typeof(calx.sheetRegistry[sheetIdentifier]) == 'undefined'){
            sheetIdentifier = 'CALX'+(new Date()).valueOf();

            calx.sheetRegistry[sheetIdentifier] = new sheet(sheetIdentifier, this, option);
        }else{
            console.log('second call should be refresh');
            calx.sheetRegistry[sheetIdentifier].refresh();
        }
    });

    for(var a in calx.sheetRegistry){
        calx.sheetRegistry[a].buildCellDependency();

        var reference = calx.sheetRegistry[a].checkCircularReference();

        if(reference.isCircular){
            var errorMessage = 'Circular reference detected, this may cause calx to stop working.\ncell : '
                                +reference.cell.getAddress()
                                +'\nformula : '
                                +reference.cell.getFormula()
                                +'\n\nPlease check each cells involved in the formula that has direct or indirect reference to '
                                +reference.cell.getAddress();

            alert(errorMessage);
            $.error(errorMessage);
        }
    }

    console.log(calx);
    return this;
}