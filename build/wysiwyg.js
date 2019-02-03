/**
 *
 * Simple WYSIWYG editor for Bootstrap3
 * copyright 2019 W.D.M.Group, Ukraine
 * email: wdmg.com.ua@gmail.com
 * license: MIT
 *
 */
+function($) {

    "use strict";
    var _createClass = (function() {
        function defineProperties(target, props) {
            for (var key in props) {
                var prop = props[key];
                prop.configurable = true;
                if (prop.value) prop.writable = true;
            }
            Object.defineProperties(target, props);
        };
        return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    })();

    var _classCallCheck = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    };

    var WYSIWYG = (function($) {

        var className = "wysiwyg";
        var _jQueryNoConflict = $.fn[className];
        var defaults = {
            toolbar: [
                ['mode'],
                ['operations', ['undo', 'rendo', 'cut', 'copy', 'paste']],
                ['styles'],
                ['fonts', ['select', 'size']],
                ['text', ['bold', 'italic', 'underline', 'strike', 'subscript', 'superscript', 'font-color', 'bg-color']],
                ['align', ['left', 'center', 'right', 'justify']],
                ['lists', ['unordered', 'ordered', 'indent', 'outdent']],
                ['components', ['table', 'chart']],
                ['intervals', ['line-height', 'letter-spacing']],
                ['insert', ['emoji', 'link', 'image', 'video', 'symbol', 'bookmark']],
                ['special', ['print', 'unformat', 'clean']],
                ['fullscreen'],
            ],
            mode: 'editor',
            fontSizes: ['8px', '9px', '10px', '11px', '12px', '14px', '15px', '16px', '18px', '20px', '24px', '30px', '32px', '36px', '48px'],
            fontSizeDefault: ['12px'],
            fontFamilies: ['Open Sans', 'Arial', 'Arial Black', 'Courier', 'Courier New', 'Comic Sans MS', 'Helvetica', 'Impact', 'Lucida Grande', 'Lucida Sans', 'Tahoma', 'Times', 'Times New Roman', 'Verdana'],
            fontFamilyDefault: ['Open Sans'],
            colorPalette: [["rgb(0, 0, 0)","rgb(67, 67, 67)","rgb(102, 102, 102)","rgb(153, 153, 153)","rgb(183, 183, 183)","rgb(204, 204, 204)","rgb(217, 217, 217)","rgb(239, 239, 239)","rgb(243, 243, 243)","rgb(255, 255, 255)"],["rgb(152, 0, 0)","rgb(255, 0, 0)","rgb(255, 153, 0)","rgb(255, 255, 0)","rgb(0, 255, 0)","rgb(0, 255, 255)","rgb(74, 134, 232)","rgb(0, 0, 255)","rgb(153, 0, 255)","rgb(255, 0, 255)"],["rgb(230, 184, 175)","rgb(244, 204, 204)","rgb(252, 229, 205)","rgb(255, 242, 204)","rgb(217, 234, 211)","rgb(208, 224, 227)","rgb(201, 218, 248)","rgb(207, 226, 243)","rgb(217, 210, 233)","rgb(234, 209, 220)","rgb(221, 126, 107)","rgb(234, 153, 153)","rgb(249, 203, 156)","rgb(255, 229, 153)","rgb(182, 215, 168)","rgb(162, 196, 201)","rgb(164, 194, 244)","rgb(159, 197, 232)","rgb(180, 167, 214)","rgb(213, 166, 189)","rgb(204, 65, 37)","rgb(224, 102, 102)","rgb(246, 178, 107)","rgb(255, 217, 102)","rgb(147, 196, 125)","rgb(118, 165, 175)","rgb(109, 158, 235)","rgb(111, 168, 220)","rgb(142, 124, 195)","rgb(194, 123, 160)","rgb(166, 28, 0)","rgb(204, 0, 0)","rgb(230, 145, 56)","rgb(241, 194, 50)","rgb(106, 168, 79)","rgb(69, 129, 142)","rgb(60, 120, 216)","rgb(61, 133, 198)","rgb(103, 78, 167)","rgb(166, 77, 121)","rgb(133, 32, 12)","rgb(153, 0, 0)","rgb(180, 95, 6)","rgb(191, 144, 0)","rgb(56, 118, 29)","rgb(19, 79, 92)","rgb(17, 85, 204)","rgb(11, 83, 148)","rgb(53, 28, 117)","rgb(116, 27, 71)","rgb(91, 15, 0)","rgb(102, 0, 0)","rgb(120, 63, 4)","rgb(127, 96, 0)","rgb(39, 78, 19)","rgb(12, 52, 61)","rgb(28, 69, 135)","rgb(7, 55, 99)","rgb(32, 18, 77)","rgb(76, 17, 48)"]]
        };

        var Editor = (function() {

            function Editor($element, config) {
                var _this = this;
                _classCallCheck(_this, Editor);

                // Merge default and custom options
                _this._config = $.extend({}, defaults, config);

                // Configure variables
                _this._editorId = 'wysiwyg-' + (String.fromCharCode(Math.floor(Math.random() * 11)) + Math.floor(Math.random() * 1000000)).trim();
                _this._$element = $element instanceof jQuery ? $element : $($element);
                _this._inputId = _this._$element.attr('id');

                // Wrap text input to container
                _this._$editor = $('<div id="' + _this._editorId + '" aria-describedby="#' + _this._inputId + '" class="wysiwyg-editor" />');
                _this._$element.wrap(_this._$editor);

                // Add content to editor
                _this._$content = $('<div class="editor-content" contenteditable="true" />');
                _this._$content.html(_this._$element.val());
                _this._$element.before(_this._$content);
                _this._source = _this._$element.val();

                _this._popoverIsVisible = false;

                // Add toolbar to editor
                _this._$toolbar = $('<div class="wysiwyg-toolbar btn-toolbar" />');
                _this._$content.before(_this._$toolbar);

                // Add statusbar to editor
                _this._$statusbar = $('<div class="editor-statusbar" />');
                _this._$statusbar.stat = $('<span class="editor-statusbar-stat" />');
                _this._$statusbar.path = $('<span class="editor-statusbar-path" />');
                _this._$statusbar.append(_this._$statusbar.stat);
                _this._$statusbar.append(_this._$statusbar.path);
                _this._$content.after(_this._$statusbar);

                // Hide input editor
                _this._$element.addClass('hide');

                // Build toolbar by config
                if(typeof (_this._config.toolbar) == 'object') {
                    $.each(_this._config.toolbar, function (index, elem) {
                        //console.log(elem + ' comes at ' + index);
                        var $toolbar = $('<div class="btn-group" role="group" aria-label="..." />');

                        if(elem[0] === 'mode') { // Editor mode switcher

                            $toolbar.append(_this._buildTollbarButton('mode', 'editor', "fa fa-eye", null));
                            $toolbar.append(_this._buildTollbarButton('mode', 'source', "fa fa-code", null));

                        } else if(elem[0] === 'operations') { // Operations editor controls

                            $toolbar.append(_this._buildTollbarButton('operations', 'undo', "fa fa-mail-reply", null));
                            $toolbar.append(_this._buildTollbarButton('operations', 'rendo', "fa fa-mail-forward", null));
                            $toolbar.append(_this._buildTollbarButton('operations', 'cut', "fa fa-cut", null));
                            $toolbar.append(_this._buildTollbarButton('operations', 'copy', "fa fa-copy", null));
                            $toolbar.append(_this._buildTollbarButton('operations', 'paste', "fa fa-clipboard", null));

                        } else if(elem[0] === 'styles') { // Editor mode switcher

                            var styles = {
                                'Header H1': {
                                    'action': 'formatblock',
                                    'value': 'h1',
                                    'wrap': '<h1 />',
                                },
                                'Header H2': {
                                    'action': 'formatblock',
                                    'value': 'h2',
                                    'wrap': '<h2 />',
                                },
                                'Header H3': {
                                    'action': 'formatblock',
                                    'value': 'h3',
                                    'wrap': '<h3 />',
                                },
                                'Header H4': {
                                    'action': 'formatblock',
                                    'value': 'h4',
                                    'wrap': '<h4 />',
                                },
                                'Header H5': {
                                    'action': 'formatblock',
                                    'value': 'h5',
                                    'wrap': '<h5 />',
                                },
                                'Header H6': {
                                    'action': 'formatblock',
                                    'value': 'h6',
                                    'wrap': '<h6 />',
                                },
                                'Paragraph': {
                                    'action': 'formatblock',
                                    'value': 'p',
                                    'wrap': '<p />',
                                },
                                'Blockquote': {
                                    'action': 'formatblock',
                                    'value': 'blockquote',
                                    'wrap': '<blockquote />',
                                },
                                'Preformatted': {
                                    'action': 'formatblock',
                                    'value': 'pre',
                                    'wrap': '<pre />',
                                },
                                'Div block': {
                                    'action': 'formatblock',
                                    'value': 'div',
                                    'wrap': '<div />',
                                }
                            }

                            $toolbar.append(_this._buildTollbarDropdown('select-style', styles, "Paragraph"));

                        } else if(elem[0] === 'fonts') { // Font select and size

                            if(elem[1].indexOf('select', 0) !== -1) {

                                var fonts = {};
                                $.each(_this._config.fontFamilies, function(index, value) {
                                    fonts[value] = {
                                        'action': 'fontname',
                                        'value': value,
                                        'style': "font-family: " + value + ";"
                                    };
                                });

                                $toolbar.append(_this._buildTollbarDropdown('font-select', fonts, _this._config.fontFamilyDefault));
                            }

                            if(elem[1].indexOf('size', 0) !== -1) {
                                var sizes = {};
                                $.each(_this._config.fontSizes, function(index, value) {
                                    sizes[value] = {
                                        'action': 'fontsize',
                                        'value': value
                                    };
                                });
                                $toolbar.append(_this._buildTollbarDropdown('font-size', sizes, _this._config.fontSizeDefault));
                            }

                        } else if(elem[0] === 'text') { // Text decoration

                            if(elem[1].indexOf('bold', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('text', 'bold', "fa fa-bold", null));

                            if(elem[1].indexOf('italic', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('text', 'italic', "fa fa-italic", null));

                            if(elem[1].indexOf('underline', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('text', 'underline', "fa fa-underline", null));

                            if(elem[1].indexOf('strike', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('text', 'strike', "fa fa-strikethrough", null));

                            if(elem[1].indexOf('subscript', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('text', 'subscript', "fa fa-subscript", null));

                            if(elem[1].indexOf('superscript', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('text', 'superscript', "fa fa-superscript", null));

                            if(elem[1].indexOf('bg-color', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('text', 'font-color', "fa fa-font", null, "Lines interval", function() {
                                    return _this._buildColorPalette(_this._config.colorPalette, "font-color", null);
                                }));

                            if(elem[1].indexOf('bg-color', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('text', 'bg-color', "fa fa-paint-brush", null, "Lines interval", function() {
                                    return _this._buildColorPalette(_this._config.colorPalette, "bg-color", true);
                                }));

                        } else if(elem[0] === 'align') { // Text aligment

                            if(elem[1].indexOf('left', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('align', 'left', "fa fa-align-left", null, "Align left", null));

                            if(elem[1].indexOf('center', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('align', 'center', "fa fa-align-center", null, "Align center", null));

                            if(elem[1].indexOf('right', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('align', 'right', "fa fa-align-right", null, "Align right", null));

                            if(elem[1].indexOf('justify', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('align', 'justify', "fa fa-align-justify", null, "Justify content", null));

                        } else if(elem[0] === 'lists') { // Lists && outdent

                            if(elem[1].indexOf('unordered', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('lists', 'unordered', "fa fa-list-ul", null));

                            if(elem[1].indexOf('ordered', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('lists', 'ordered', "fa fa-list-ol", null));

                            if(elem[1].indexOf('indent', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('lists', 'indent', "fa fa-indent", null));

                            if(elem[1].indexOf('outdent', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('lists', 'outdent', "fa fa-outdent", null));

                        } else if(elem[0] === 'components') { // Components

                            if(elem[1].indexOf('table', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('components', 'table', "fa fa-table", null, "Insert table", function() {
                                    return _this._buildTableGrid();
                                }));

                            if(elem[1].indexOf('chart', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('components', 'chart', "fa fa-pie-chart", null));

                        } else if(elem[0] === 'intervals') { // Text properties

                            if(elem[1].indexOf('line-height', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('interval', 'line-height', "fa fa-text-height", null, "Lines interval", function() {

                                    var content = '<ul class="nav nav-pills nav-stacked">\n' +
                                        '  <li role="presentation"><a href="#" data-action="line-height" data-value="0.5">0.5</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="line-height" data-value="1.0">1.0</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="line-height" data-value="1.15">1.15</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="line-height" data-value="1.5">1.5</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="line-height" data-value="2.0">2.0</a></li>\n' +
                                        '</ul>';

                                    return content;
                                }));

                            if(elem[1].indexOf('letter-spacing', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('interval', 'letter-spacing', "fa fa-text-width", null, "Letter spacing", function() {

                                    var content = '<ul class="nav nav-pills nav-stacked">\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="-5">-5</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="-3">-3</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="-2">-2</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="-1">-1</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="0">0</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="1">1</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="2">2</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="3">3</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="5">5</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="8">8</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="10">10</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="12">12</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="15">15</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="25">25</a></li>\n' +
                                        '  <li role="presentation"><a href="#" data-action="letter-spacing" data-value="50">50</a></li>\n' +
                                        '</ul>';

                                    return content;
                                }));

                        } else if(elem[0] === 'insert') { // Inserts

                            if(elem[1].indexOf('emoji', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('insert', 'emoji', "fa fa-smile-o", null));

                            if(elem[1].indexOf('link', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('insert', 'link', "fa fa-link", null));

                            if(elem[1].indexOf('image', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('insert', 'image', "fa fa-image", null));

                            if(elem[1].indexOf('video', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('insert', 'video', "fa fa-video-camera", null));

                            if(elem[1].indexOf('symbol', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('insert', 'symbol', "fa fa-hashtag", null));

                            if(elem[1].indexOf('bookmark', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('insert', 'bookmark', "fa fa-bookmark", null));

                        } else if(elem[0] === 'special') { // Inserts

                            if(elem[1].indexOf('print', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('special', 'print', "fa fa-print", null));

                            if(elem[1].indexOf('clean', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('special', 'clean', "fa fa-eraser", null));

                            if(elem[1].indexOf('unformat', 0) !== -1)
                                $toolbar.append(_this._buildTollbarButton('special', 'unformat', "fa fa-trash-o", null));

                        } else if(elem[0] === 'fullscreen') { // Fullscreen mode

                            $toolbar.addClass('pull-right');
                            $toolbar.append(_this._buildTollbarButton('fullscreen', true, "fa fa-arrows-alt", null));

                        }

                        _this._$toolbar.append($toolbar);

                    });
                }

                // Set behavior for toolbar buttons
                if(_this._$toolbar.length) {

                    _this._$toolbar.on('click', '[data-action]', function(event) {
                        var $target = $(event.currentTarget);
                        var action = $target.data('action');
                        var value = $target.data('value');

                        if (typeof (action) !== 'undefined' && typeof (value) !== 'undefined') {

                            switch (action) {

                                case 'mode':
                                    switch (value) {
                                        case 'editor':
                                            if (_this._config.mode !== value) {
                                                _this._config.mode = value;
                                                _this._$content.html(_this._source);
                                                _this._$toolbar.find('[data-action="mode"]').removeClass('active');
                                                _this._$toolbar.find('[data-action="mode"][data-value="editor"]').addClass('active');
                                                _this._$content.addClass('editor-mode').removeClass('source-mode');
                                                _this._$content.focus();
                                            }
                                            break;

                                        case 'source':
                                            if (_this._config.mode !== value) {

                                                _this._config.mode = value;
                                                _this._source = _this._$content.html();

                                                var $source = $('<pre />');
                                                $source.text(_this._source);
                                                //_this._$content.html($source.get(0).outerHTML);
                                                //_this._$content.html($source.html());
                                                _this._$content.html(_this._trimSource($source.html()));

                                                _this._$toolbar.find('[data-action="mode"]').removeClass('active');
                                                _this._$toolbar.find('[data-action="mode"][data-value="source"]').addClass('active');

                                                _this._$content.removeClass('editor-mode').addClass('source-mode');
                                                _this._$content.focus();
                                            }
                                            break;
                                    }
                                    break;

                                case 'formatblock':
                                    _this._formatDoc('formatblock', value);
                                    break;

                                case 'fontname':
                                    _this._formatDoc('fontname', value);
                                    break;

                                case 'fontsize':
                                    var selection = document.getSelection();
                                    selection.anchorNode.parentElement.removeAttribute("size");
                                    selection.anchorNode.parentElement.style.fontSize = value;
                                    break;

                                case 'style':
                                    var selection = document.getSelection();
                                    var styles = selection.anchorNode.parentElement.style.cssText;

                                    if(styles)
                                        styles += value;
                                    else
                                        styles = value;

                                    selection.anchorNode.parentElement.removeAttribute("style");
                                    selection.anchorNode.parentElement.style = styles;
                                    break;

                                case 'fullscreen':
                                    console.log('Fire action: ' + action + ' with value: ' + value);
                                    break;

                                case 'operations':
                                    switch (value) {
                                        case 'undo':
                                            _this._formatDoc('undo');
                                            break;

                                        case 'rendo':
                                            _this._formatDoc('rendo');
                                            break;
                                        case 'cut':
                                            _this._formatDoc('cut');
                                            break;

                                        case 'copy':
                                            _this._formatDoc('copy');
                                            break;

                                        case 'paste':
                                            _this._formatDoc('paste');
                                            break;
                                    }
                                    break;

                                case 'text':
                                    switch (value) {
                                        case 'bold':
                                            _this._formatDoc('bold');
                                            break;

                                        case 'italic':
                                            _this._formatDoc('italic');
                                            break;

                                        case 'underline':
                                            _this._formatDoc('underline');
                                            break;

                                        case 'strike':
                                            _this._formatDoc('strikeThrough');
                                            break;

                                        case 'subscript':
                                            _this._formatDoc('subscript');
                                            break;

                                        case 'superscript':
                                            _this._formatDoc('superscript');
                                            break;

                                    }
                                    break;

                                case 'font-color':
                                    if(value == 'unset') {

                                        var selection = document.getSelection();
                                        if(selection.anchorNode)
                                            selection.anchorNode.parentElement.style.backgroundColor = "";

                                        if(selection.anchorNode.parentElement.style.length)
                                            selection.anchorNode.parentElement.removeAttribute("style");

                                    } else {
                                        //_this._$toolbar.find('[data-action="text"][data-value="font-color"]').css('color', value);
                                        _this._$toolbar.find('[data-action="text"][data-value="font-color"] > span').css('border-bottom-color', value);
                                        _this._formatDoc('foreColor', value);
                                    }
                                    break;

                                case 'bg-color':
                                    if(value == 'unset') {

                                        var selection = document.getSelection();
                                        if(selection.anchorNode)
                                            selection.anchorNode.parentElement.style.backgroundColor = "";

                                        if(selection.anchorNode.parentElement.style.length)
                                            selection.anchorNode.parentElement.removeAttribute("style");

                                    } else {
                                        _this._$toolbar.find('[data-action="text"][data-value="bg-color"] > span').css('border-bottom-color', value);
                                        _this._formatDoc('hiliteColor', value);
                                    }
                                    break;

                                case 'align':
                                    switch (value) {
                                        case 'left':
                                            _this._formatDoc('justifyLeft');
                                            break;

                                        case 'center':
                                            _this._formatDoc('justifyCenter');
                                            break;

                                        case 'right':
                                            _this._formatDoc('justifyRight');
                                            break;

                                        case 'justify':
                                            _this._formatDoc('justifyFull');
                                            break;
                                    }
                                    break;


                                case 'lists':
                                    switch (value) {
                                        case 'unordered':
                                            _this._formatDoc('insertUnorderedList');
                                            break;

                                        case 'ordered':
                                            _this._formatDoc('insertOrderedList');
                                            break;

                                        case 'indent':
                                            _this._formatDoc('indent');
                                            break;

                                        case 'outdent':
                                            _this._formatDoc('outdent');
                                            break;
                                    }
                                    break;

                                case 'insert-table':
                                    var selection = document.getSelection();
                                    if(selection.anchorNode) {
                                        var options = value.split('|', 2);
                                        var $parent = $(selection.anchorNode.parentElement);
                                        var content = _this._generateTable(parseFloat(options[0]), parseFloat(options[2]));
                                        $parent.after(content);
                                        console.log(content);
                                    }
                                    break;

                                case 'components':
                                    switch (value) {

                                        case 'chart':
                                            console.log('Fire action: ' + action + ' with value: ' + value);
                                            break;
                                    }
                                    break;

                                case 'line-height':

                                    var selection = document.getSelection();
                                    if(selection.anchorNode.parentElement) {
                                        var lineHeight = parseFloat(value) * 100 + "%";

                                        if (parseFloat(value) == 0)
                                            selection.anchorNode.parentElement.style.lineHeight = "inherit";
                                        else
                                            selection.anchorNode.parentElement.style.lineHeight = lineHeight;
                                    }
                                    break;

                                case 'letter-spacing':

                                    var selection = document.getSelection();
                                    if(selection.anchorNode.parentElement) {
                                        var letterSpacing = parseFloat(value) + "px";

                                        if (parseFloat(value) == 0)
                                            selection.anchorNode.parentElement.style.letterSpacing = "inherit";
                                        else
                                            selection.anchorNode.parentElement.style.letterSpacing = letterSpacing;

                                    }
                                    break;

                                case 'insert':
                                    switch (value) {
                                        case 'emoji':
                                            console.log('Fire action: ' + action + ' with value: ' + value);
                                            break;

                                        case 'link':
                                            console.log('Fire action: ' + action + ' with value: ' + value);
                                            break;

                                        case 'image':
                                            console.log('Fire action: ' + action + ' with value: ' + value);
                                            break;

                                        case 'video':
                                            console.log('Fire action: ' + action + ' with value: ' + value);
                                            break;

                                        case 'symbol':
                                            console.log('Fire action: ' + action + ' with value: ' + value);
                                            break;

                                        case 'bookmark':
                                            console.log('Fire action: ' + action + ' with value: ' + value);
                                            break;
                                    }
                                    break;

                                case 'special':
                                    switch (value) {
                                        case 'print':
                                            _this._printDoc();
                                            break;

                                        case 'clean':
                                            _this._formatDoc('removeFormat');
                                            break;

                                        case 'unformat':
                                            _this._formatDoc('selectAll');
                                            _this._formatDoc('removeFormat');
                                            var string = _this._$content.html();
                                            string = _this._stripTags(string);
                                            string = string.replace(/(\r\n|\n|\r)/g, '<!-- br -->');
                                            string = string.replace(/<!-- br -->/g, '<br/>');
                                            _this._$content.html(string);
                                            break;
                                    }
                                    break;

                                default:
                                    console.warn('Unrecognized action: ' + action + ' with value: ' + value);
                                    break;
                            }

                        }

                    });

                }

                // On selected content
                _this._$content.on('mouseup keyup', function (event) {
                    var sel = window.getSelection();

                    if (sel.getRangeAt && sel.rangeCount) {

                        /*if (sel.parentElement) {
                            var $target = $(sel.parentElement);
                            _this._updateState($target);
                        } else if (sel.parentNode) {
                            var $target = $(sel.parentNode);
                            _this._updateState($target);
                        }*/

                        if (sel.parentNode) {
                            var $target = $(sel.parentNode);
                            _this._updateState($target);
                        } else if (sel.parentElement) {
                            var $target = $(sel.parentElement);
                            _this._updateState($target);
                        }/* else {
                            _this._$toolbar.find('[data-action="text"]').removeClass('active');
                            _this._$toolbar.find('[data-action="align"]').removeClass('active');
                            _this._$toolbar.find('[data-action="insert"]').removeClass('active');
                        }*/

                        //return sel.getRangeAt(0);
                    }

                    //var $parents = $(sel.parentElement).parentsUntil('#' + _this._editorId);
                    //var $parents = $(sel.parentElement).parentsUntil('#' + _this._editorId);

                });

                // On click or keyup from content area
                _this._$content.on('click keyup', function (event) {
                    const $this = $(this);

                    var sel = window.getSelection();

                    var $target = $(event.target);
                    _this._updateState($target);
                    $this.focus();

                    $this.trigger('change');

                });

                // On content change
                _this._$content.on('change', function(event) {
                    const $this = $(this);

                    if (_this._config.mode == 'editor')
                        _this._source = $this.html();
                    else
                        _this._source = $this.text();

                    _this._$element.val(_this._source);

                });

                // On content change
                /*_this._$element.on('click keyup', function(event) {
                    const $this = $(this);

                    var position2 = _this._getTextPosition(_this._$element.get(0));
                    console.log(position2);
                });*/

            }

            _createClass(Editor, {
                element: {
                    value: function element() {
                        var _this = this;
                        return _this._$element;
                    }
                },
                _replaceAll: {
                    value: function replaceAll(search, replace, string) {
                        return string.split(search).join(replace);
                    }
                },
                _stripTags: {
                    value: function stripTags(string, tags) {

                        var key, allowed_tags = [];
                        if (tags)
                            allowed_tags = tags.match(/([a-zA-Z]+)/gi);

                        if (typeof (string) !== 'string')
                            string = string.toString();

                        var matches = string.match(/(<\/?[\S][^>]*>)/gi);

                        for (key in matches) {

                            if (isNaN(key))
                                continue;

                            var html = matches[key].toString();
                            var allowed = false;

                            for (key in allowed_tags) {

                                var tag = allowed_tags[key];
                                var i = html.toLowerCase().indexOf('<'+ tag +'>');

                                if (i != 0)
                                    i = html.toLowerCase().indexOf('<'+ tag +' ');

                                if (i != 0)
                                    i = html.toLowerCase().indexOf('</'+ tag );

                                if (i == 0) {
                                    allowed = true;
                                    break;
                                }

                            }

                            if (!allowed)
                                string = this._replaceAll(html, "", string);

                        }

                        return string;
                    }
                },
                _trimSource: {
                    value: function trimSource(str) {
                        str = str.replace(/\s{4,}/g, "");
                        str = str.replace(/\t/g, ' ');
                        str = str.toString().trim().replace(/(\r\n|\n|\r)/g,"");
                        return str;
                    }
                },
                _getPath: {
                    value: function getPath(node, restrict) {
                        var path, tags = [];
                        while (node.length) {
                            var realNode = node[0], name = realNode.localName;
                            var parent = node.parentsUntil(restrict);

                            if (!name)
                                break;
                            else
                                name = name.toLowerCase();

                            /*var sameTagSiblings = parent.children(name);
                            if (sameTagSiblings.length > 1) {
                                var allSiblings = parent.children();
                                var index = allSiblings.index(realNode) + 1;
                                if (index > 1) {
                                    name += ':nth-child(' + index + ')';
                                }
                            }*/

                            tags.push(name);

                            var id = $(realNode).attr("id");
                            if (id)
                                name += "#" + id;

                            var classname = $(realNode).attr("class");
                            if (classname)
                                name += "." + classname.replace(/\./g, '.');

                            path = name + (path ? ' > ' + path : '');
                            node = parent;
                        }

                        return {
                            path: path,
                            tags: tags
                        };
                    }
                },
                _getTextStat: {
                    value: function getTextStat(el) {

                        var words = 0, length = 0, chars = 0, normalizedValue;
                        var isContentEditable = el && el.contentEditable;

                        if (isContentEditable)
                            normalizedValue = el.innerText.replace(/\r\n/g, "\n");
                        else
                            normalizedValue = el.value.replace(/\r\n/g, "\n");

                        words = this._stripTags(normalizedValue).split(' ').length;
                        length = normalizedValue.length;
                        chars = this._trimSource(normalizedValue.replace(/\s/g, "")).length;

                        return {
                            words: words,
                            length: length,
                            chars: chars
                        }
                    }
                },
                _getTextPosition: {
                    value: function getCursorPosition(el) {

                        var line = 0, start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;
                        var isContentEditable = el && el.contentEditable;

                        if ("selectionStart" in el && document.activeElement == el) {

                            start = el.selectionStart;
                            end = el.selectionEnd;
                            normalizedValue = el.value.replace(/\r\n/g, "\n");
                            line = normalizedValue.substr(0, el.selectionStart).split("\n").length;

                        } else if (isContentEditable) {

                            start = window.getSelection().getRangeAt(0).startOffset;
                            end = window.getSelection().getRangeAt(0).endOffset;

                            normalizedValue = el.innerText.replace(/\r\n/g, "\n");
                            line = (normalizedValue.substr(0, el.selectionStart).split("\n").length - 1);

                            if(line == 0)
                                line = 1;

                        } else {

                            range = document.selection.createRange();

                            if (range && range.parentElement() == el) {
                                len = el.value.length;
                                normalizedValue = el.value.replace(/\r\n/g, "\n");

                                // Create a working TextRange that lives only in the input
                                textInputRange = el.createTextRange();
                                textInputRange.moveToBookmark(range.getBookmark());

                                // Check if the start and end of the selection are at the very end
                                // of the input, since moveStart/moveEnd doesn't return what we want
                                // in those cases
                                endRange = el.createTextRange();
                                endRange.collapse(false);

                                if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                                    start = end = len;
                                } else {
                                    start = -textInputRange.moveStart("character", -len);
                                    start += normalizedValue.slice(0, start).split("\n").length - 1;

                                    if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                                        end = len;
                                    } else {
                                        end = -textInputRange.moveEnd("character", -len);
                                        end += normalizedValue.slice(0, end).split("\n").length - 1;
                                    }
                                }
                            }
                        }
                        return {
                            line: line,
                            start: start,
                            end: end
                        }
                    }
                },
                _formatDoc: {
                    value: function formatDoc(command, value) {
                        document.execCommand(command, false, value);
                        this._$content.focus();
                    }
                },
                _printDoc: {
                    value: function printDoc() {
                        var print = window.open("","_blank","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
                        print.document.open();
                        print.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + this._$content.get(0).innerHTML + "<\/body><\/html>");
                        print.document.close();
                    }
                },
                _hideAllPopovers: {
                    value: function hideAllPopovers() {
                        console.log('_hideAllPopovers');

                        this._$toolbar.find('.popover').each(function() {
                            $(this).popover('hide');
                        });

                        /*$('.popover').each(function() {
                            $(this).popover('hide');
                        });*/

                        this._popoverIsVisible = false;
                    }
                },
                _buildTollbarButton: {
                    value: function buildTollbarButton(action, value, icon, hotkey, tooltip, popover) {

                        var _this = this;
                        var $button = $('<button type="button" class="btn btn-default" tabindex="-1" />');

                        if (action)
                            $button.attr('data-action', action);

                        if (value)
                            $button.attr('data-value', value);

                        if (hotkey)
                            $button.attr('data-hotkey', hotkey);

                        if (tooltip) {
                            $button.tooltip({
                                html: true,
                                placement: 'top',
                                title: tooltip.toString().trim()
                            });
                        }

                        if (popover) {

                            $button.popover({
                                html: true,
                                trigger: 'manual',
                                placement: 'bottom',
                                content: popover
                            }).on('shown.bs.popover', function(event) {

                                var popoverId = $(event.target).attr('aria-describedby');
                                var $popover = _this._$toolbar.find('#'+popoverId);

                                $popover.on('click', function() {
                                    $popover.popover('hide');
                                });

                                if($popover.find('.table-grid').length) {
                                    $popover.find('.table-grid tr > td').hover(function() {
                                        $(this).addClass('selected');
                                        $(this).prevAll().addClass('selected');
                                        $(this).parent().prevAll().find('td:lt('+ ($(this).index() + 1) + ')').addClass('selected');
                                    }, function() {
                                        $(this).removeClass('selected');
                                        $(this).prevAll().removeClass('selected');
                                        $(this).parent().prevAll().find('td:lt('+ ($(this).index() + 1) + ')').removeClass('selected');
                                    });
                                }

                            }).on('click', function(e) {

                                console.log(_this._popoverIsVisible);

                                if(_this._popoverIsVisible)
                                    _this._hideAllPopovers();

                                $button.popover('show');
                                _this._popoverIsVisible = true;
                                e.stopPropagation();
                            });

                        } else {
                            $button.on('click', function(e) {
                                _this._hideAllPopovers();
                            });
                        }

                        if (icon)
                            $button.append('<span class="' + icon + '" />');

                        return $button;
                    }
                },
                _buildTollbarDropdown: {
                    value: function buildTollbarDropdown(action, list, label) {

                        var $dropdown = $('<div class="dropdown" />');
                        var $dropdownBtn = $('<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" />');
                        var $dropdownMenu = $('<ul class="dropdown-menu" />');
                        var $dropdownItem = $('<li />');
                        var $dropdownLink = $('<a href="#" tabindex="-1" />');

                        if (typeof (list) == "object") {

                            $.each(list, function(index, elem) {

                                var $link = $dropdownLink.clone();
                                var $item = $dropdownItem.clone();

                                if (typeof (elem) == 'object') {

                                    if (elem['action'])
                                        $link.attr('data-action', elem['action']);

                                    if (elem['value'])
                                        $link.attr('data-value', elem['value']);

                                    if (elem['wrap'])
                                        $link.html($(elem['wrap']).text(index));
                                    else
                                        $link.text(index);

                                    if (elem['style'])
                                        $link.attr('style', elem['style'].toString());

                                    if(index == label)
                                        $item.addClass('active');

                                    $item.append($link);
                                    $dropdownMenu.append($item);

                                } else {

                                    $link.text(elem);
                                    $link.attr('data-action', action);
                                    $link.attr('data-value', elem);

                                    if(elem == label)
                                        $item.addClass('active');

                                    $item.append($link);
                                    $dropdownMenu.append($item);
                                }

                            });
                        }

                        if (label)
                            $dropdownBtn.text(label + ' ');
                        else
                            $dropdownBtn.text('Dropdown ');

                        $dropdownBtn.append('<b class="caret" />');

                        $dropdown.append($dropdownBtn);
                        $dropdown.append($dropdownMenu);
                        return $dropdown;
                    }
                },
                _buildColorPalette: {
                    value: function buildColorPalette(palette, action, reset) {
                        var content = '';
                        $.each(palette, function (outer, colors) {
                            content += '<table class="color-palette"><tr>';
                            $.each(colors, function (inner, color) {
                                content += '<td><a href="#" data-action="' + action + '" data-value="' + color + '" style="background-color: ' + color + '">&nbsp;</a></td>'
                                content += ((parseInt(inner) + 1)%10 ? '' : '</tr>');
                                content += ((parseInt(inner) + 1)%10 ? '' : '<tr>');
                            });
                            content += '</tr></table>';
                        });

                        if(reset)
                            content += '<p><a href="#" class="btn btn-sm btn-block" data-action="' + action + '" data-value="unset">Reset color</a></p>';

                        return content;
                    }
                },
                _buildTableGrid: {
                    value: function buildColorPalette() {

                        var content = '<table class="table-grid">';

                        for(var row = 1; row <= 6; row++) {

                            content += '<tr>';

                            for(var column = 1; column <= 8; column++) {
                                content += '<td><a href="#" data-action="insert-table" data-value="' + row + '|'+ column +'">&nbsp;</a></td>'
                            }

                            content += '</tr>';
                        }

                        content += '</table>';
                        return content;
                    }
                },
                _generateTable: {
                    value: function generateTable(rows, columns) {

                        rows = parseInt(rows) + 1;
                        columns = parseInt(rows);

                        if(!columns) columns = 1;

                        var content = '<table class="table">';

                        for(var row = 1; row <= rows; row++) {

                            if (row == 1)
                                content += '<thead>';
                            else if (row == ((rows - row) - 1))
                                content += '<tbody>';

                            content += '<tr>';

                            for(var column = 1; column <= columns; column++) {

                                if (row == 1)
                                    content += '<th>Header ' + column + '</th>'
                                else
                                    content += '<td>&nbsp;</td>'
                            }

                            content += '</tr>';

                            if (row == 1)
                                content += '</thead>';
                            else if (row == rows)
                                content += '</tbody>';
                        }

                        content += '</table>';
                        return content;
                    }
                },
                _updateState: {
                    value: function updateState($target, reset) {
                        var _this = this;
                        if (_this._config.mode == 'editor') {
                            var statInfo = _this._getTextStat(_this._$content.get(0));
                            var pathInfo = _this._getPath($target, _this._$content);

                            if(!reset) {
                                switch (pathInfo['tags'][0]) {
                                    case 'b' :
                                        _this._$toolbar.find('[data-action="text"]').removeClass('active');
                                        _this._$toolbar.find('[data-action="text"][data-value="bold"]').addClass('active');
                                        break;

                                    case 'u' :
                                        _this._$toolbar.find('[data-action="text"]').removeClass('active');
                                        _this._$toolbar.find('[data-action="text"][data-value="underline"]').addClass('active');
                                        break;

                                    case 'sub' :
                                        _this._$toolbar.find('[data-action="text"]').removeClass('active');
                                        _this._$toolbar.find('[data-action="text"][data-value="subscript"]').addClass('active');
                                        break;

                                    case 'sup' :
                                        _this._$toolbar.find('[data-action="text"]').removeClass('active');
                                        _this._$toolbar.find('[data-action="text"][data-value="superscript"]').addClass('active');
                                        break;

                                    case 'i' :
                                        _this._$toolbar.find('[data-action="text"]').removeClass('active');
                                        _this._$toolbar.find('[data-action="text"][data-value="italic"]').addClass('active');
                                        break;

                                    case 'a' :
                                        _this._$toolbar.find('[data-action="insert"]').removeClass('active');
                                        _this._$toolbar.find('[data-action="insert"][data-value="link"]').addClass('active');
                                        break;

                                    case 'p' :
                                        _this._$toolbar.find('[data-action="align"]').removeClass('active');

                                        if ($target.css('text-align') == 'center')
                                            _this._$toolbar.find('[data-action="align"][data-value="center"]').addClass('active');
                                        else if ($target.css('text-align') == 'right')
                                            _this._$toolbar.find('[data-action="align"][data-value="right"]').addClass('active');
                                        else if ($target.css('text-align') == 'justify')
                                            _this._$toolbar.find('[data-action="align"][data-value="justify"]').addClass('active');
                                        else
                                            _this._$toolbar.find('[data-action="align"][data-value="left"]').addClass('active');

                                        break;

                                    default :
                                        _this._$toolbar.find('[data-action="text"]').removeClass('active');
                                        _this._$toolbar.find('[data-action="align"]').removeClass('active');
                                        _this._$toolbar.find('[data-action="insert"]').removeClass('active');
                                        break;
                                }
                            } else {
                                _this._$toolbar.find('button[data-action]').removeClass('active');
                            }

                            if (pathInfo['path'].search(this._editorId) == -1)
                                _this._$statusbar.path.text(pathInfo['path']);

                            _this._$statusbar.stat.text('Length: ' + statInfo['length'] + ', chars: ' + statInfo['chars'] + ', words: ' +  statInfo['words']);

                        } else {

                            var position = _this._getTextPosition(_this._$content.get(0));
                            _this._$statusbar.path.empty();
                            _this._$statusbar.stat.text('Line: ' + position['line'] + ', column: ' + position['end']);

                        }

                        return _this._$element;

                    }
                },
            }, {
                Default: {
                    get: function() {
                        return defaults;
                    }
                },
                _jQueryInterface: {
                    value: function _jQueryInterface(config) {
                        var _this = this;
                        config = config || {};
                        return _this.each(function() {
                            var $this = $(_this);
                            var _config = $.extend({}, WYSIWYG.Default, $this.data(), typeof config === "object" && config);
                            new Editor(_this, _config);
                        });
                    }
                }
            });

            return Editor;

        })();

        $.fn[className] = Editor._jQueryInterface;
        $.fn[className].Constructor = Editor;
        $.fn[className].noConflict = function() {
            $.fn[className] = _jQueryNoConflict;
            return Editor._jQueryInterface;
        };

        return Editor;

    })(jQuery);
}(jQuery);