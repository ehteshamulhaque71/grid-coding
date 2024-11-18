function split(val) {
    return val.split(/\s+([a-z]|[A-Z]){1}/);
}
function extractLast(term) {
    return split(term).pop();
}

function startAutocomplete(node, list, inputElement) {
    $(node).autocomplete({
        source: list,
        messages: {
            noResults: 'No results found.',
            results: function (count) {
                return count + (count > 1 ? ' results' : ' result ') + ' found. Choose a suggested option below.';
            }
        },
        // source: function (request, response) {
        //     // delegate back to autocomplete, but extract the last term
        //     response($.ui.autocomplete.filter(
        //         list, extractLast(request.term)));
        // },
        focus: function (event, ui) {
            var menu = $(this).data("uiAutocomplete").menu.element;
            var focusid = menu.find("a.ui-state-focus").attr('id');
            $(this).attr('aria-activedescendant', focusid);
            $(".ui-autocomplete a").attr('aria-selected', 'false');
            $(".ui-autocomplete a.ui-state-focus").attr('aria-selected', 'true');
        },
        open: function (event, ui) {
            inputElement.autocompleteOpen = true
            $(this).keydown(function (event) {
                if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
                    event.stopPropagation()
                }
                if (event.key == 'Enter') {
                    inputElement.autocompleteOpen = false
                }
            })
        },
        close: function (event, ui) {
            inputElement.autocompleteOpen = false
            $(this).off('keydown')
        },
        // select: function (event, ui) {
        //     var terms = split(this.value);
        //     // remove the current input
        //     terms.pop();
        //     // add the selected item
        //     terms.push(ui.item.value);
        //     // add placeholder to get the comma-and-space at the end
        //     terms.push("");
        //     this.value = terms.join(" ");
        //     return false;
        // }
    });
    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        return $("<li></li>")
            .data("item.autocomplete", item)
            .append("<a role=option>" + item.label + "</a>")
            .appendTo(ul);
    };
    $.ui.autocomplete.prototype._renderMenu = function (ul, items) {
        var that = this;
        $.each(items, function (index, item) {
            that._renderItemData(ul, item);
        });
        $(ul).attr('role', 'listbox');
        $(ul).attr('id', 'listbox-container');
        $(ul).find("li:odd").addClass("odd");
    };
    $(".ui-autocomplete").on('blur', function () {
        inputElement.autocompleteOpen = false
        $(this).autocomplete("destroy");
        startAutocomplete($(this), list);

    });
    $('.ui-helper-hidden-accessible').detach().appendTo('body');
}


